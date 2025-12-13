#!/usr/bin/env python3
"""
proxy_server.py — Clean, audited rewrite for ByeJect project.

Key behavior changes / guarantees:
- All moderation outcomes (accept/warning/alter/reject/block) return JSON responses (200)
  so the frontend/dashboard receives structured data for every request.
- Errors that truly are server faults still raise HTTPException (502/504).
- All audit-worthy events are saved to moderation_logs.json and moderation_text_logs.txt
  (newest-first) and include consistent keys expected by the Dashboard.
- Actions normalized to lowercase for UI compatibility.
"""

import os
import re
import uuid
import time
import logging
import asyncio
import json
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
from pathlib import Path
from collections import defaultdict

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# -----------------------
# App + CORS
# -----------------------
app = FastAPI(title="ByeJect Proxy (audited)")

# adjust to your frontend origin(s)
FRONTEND_ORIGINS = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # use explicit origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Logging + config
# -----------------------
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("byeject-proxy")

CONFIG = {
    "thresholds": {"warning": 0.3, "alter": 0.6, "reject": 0.85},
    "llm_timeout_s": float(os.getenv("LLM_TIMEOUT_S", "30.0")),
    "logging": {"log_dir": Path("logs"), "moderation_log": Path("logs/moderation_logs.json")},
    "injection_detection": {
        "enabled": True,
        "max_injection_score": 0.7,
        "learning_enabled": True,
        "rate_limit_window_s": 3600,
        "max_suspicious_attempts": 5,
        "auto_block_jailbreak_after": 3,
    },
}

# Ensure log directory exists
CONFIG["logging"]["log_dir"].mkdir(parents=True, exist_ok=True)
LOG_FILE = CONFIG["logging"]["moderation_log"].resolve()
TEXT_LOG_FILE = CONFIG["logging"]["log_dir"] / "moderation_text_logs.txt"


def now_iso() -> str:
    return datetime.utcnow().isoformat() + "Z"


def _ensure_logfile():
    try:
        LOG_FILE.parent.mkdir(parents=True, exist_ok=True)
        if not LOG_FILE.exists():
            LOG_FILE.write_text("[]", encoding="utf-8")
            logger.info(f"Created moderation log file at {LOG_FILE}")
    except Exception:
        logger.exception("Failed to ensure log file")


def save_moderation_log(entry: Dict[str, Any]) -> None:
    """Synchronous append to moderation log. Keeps newest entries first."""
    _ensure_logfile()
    try:
        # normalize a couple of fields first
        entry = dict(entry)
        if "timestamp" not in entry:
            entry["timestamp"] = now_iso()
        if "id" not in entry and "request_id" in entry:
            entry["id"] = entry["request_id"]
        if "action" in entry and entry["action"] is not None:
            entry["action"] = str(entry["action"]).lower()
        entry.setdefault("altered", bool(entry.get("altered", False)))
        entry.setdefault("prompt", entry.get("prompt", ""))

        with LOG_FILE.open("r+", encoding="utf-8") as f:
            try:
                data = json.load(f)
                if not isinstance(data, list):
                    data = []
            except Exception:
                data = []
            data.insert(0, entry)
            # keep file bounded
            if len(data) > 5000:
                data = data[:5000]
            f.seek(0)
            f.truncate()
            json.dump(data, f, default=str)
    except Exception:
        logger.exception("Failed to write moderation log")


def save_text_log(entry: Dict[str, Any]) -> None:
    """Append human readable line to moderation_text_logs.txt"""
    try:
        _ensure_logfile()
        ts = entry.get("timestamp", now_iso())
        rid = entry.get("id") or entry.get("request_id") or str(uuid.uuid4())
        action = (entry.get("action") or "info")
        reason = entry.get("reason") or entry.get("block_type") or "-"
        prompt = str(entry.get("prompt") or "")[:400].replace("\n", " ").replace("\r", " ")
        line = f"[{ts}] ID={rid} ACTION={action} REASON={reason} PROMPT={prompt}\n"
        with TEXT_LOG_FILE.open("a", encoding="utf-8") as f:
            f.write(line)
    except Exception:
        logger.exception("Failed to write text log")


async def audit_log(entry: Dict[str, Any]) -> None:
    """
    Async audit logger - chooses important events to persist and writes them in a background thread.
    """
    try:
        logger.info(f"AUDIT: {entry}")
        # normalize
        if "request_id" in entry and "id" not in entry:
            entry["id"] = entry["request_id"]
        entry.setdefault("timestamp", now_iso())
        if "action" in entry and entry["action"] is not None:
            entry["action"] = str(entry["action"]).lower()
        entry.setdefault("reason", entry.get("reason") or entry.get("block_type") or "Unknown")
        entry.setdefault("prompt", entry.get("prompt", ""))
        entry.setdefault("altered", bool(entry.get("altered", False)))

        EVENTS_TO_SAVE = {
            "injection_blocked",
            "jailbreak_blocked",
            "input_rejected",
            "request_completed",
            "user_feedback",
            "input_analysis",
            "output_analysis",
            "injection_scan",
            "input_warning",
            "output_warning",
        }

        # Always save anything that has an action
        
    # Always save ANY moderation result that contains an action
    # Accept / Warning / Alter / Reject / Block
        if entry.get("action"):
            await asyncio.to_thread(save_moderation_log, entry)
            await asyncio.to_thread(save_text_log, entry)
            return

    # If there is no action, save the entry anyway as a regular event
        await asyncio.to_thread(save_moderation_log, entry)
        await asyncio.to_thread(save_text_log, entry)

    except Exception:
        logger.exception("audit_log failed")


# -----------------------
# Simple detection rules and content rules
# -----------------------
JAILBREAK_PATTERNS = [
    r"ignore (all )?(previous|prior|above) instructions?",
    r"disregard (previous|prior) instructions?",
    r"forget (all )?(you )?(know|were told)",
    r"do anything now",
    r"\bdan\b",
    r"developer mode",
    r"unrestricted mode",
    r"sudo mode",
    r"god mode",
    r"hypothetical(ly)?",
    r"act like",
    r"pretend to",
    r"roleplay as",
]

INJECTION_PATTERNS = {
    "instruction_override": {
        "patterns": [r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?", r"disregard\s+(previous|prior)"],
        "severity": 0.8,
        "description": "Instruction override attempt",
    },
    "role_manipulation": {
        "patterns": [r"you\s+are\s+now\s+(a|an)\s+\w+", r"act\s+as\s+"],
        "severity": 0.85,
        "description": "Role manipulation attempt",
    },
    "prompt_leakage": {
        "patterns": [r"(show|reveal|print|display)\s+(your|the)\s+(system\s+)?(prompt|instructions)"],
        "severity": 0.75,
        "description": "System prompt extraction attempt",
    },
    "jailbreak_techniques": {
        "patterns": [r"do\s+anything\s+now", r"dann?(\s*mode)?", r"developer\s+mode"],
        "severity": 0.9,
        "description": "Jailbreak attempt",
    },
}

PII_PATTERNS = {
    "ssn": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    "email": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
    "phone": re.compile(r"\b\d{3}[-.]?\d{3}[-.]?\d{4}\b"),
    "credit_card": re.compile(r"\b4[0-9]{12}(?:[0-9]{3})?\b"),
}

CONTENT_RULES = {
    "violence": {"keywords": ["kill", "murder", "assault", "attack", "bomb", "weapon", "shoot", "stab"], "severity": 0.85},
    "hate_speech": {"keywords": ["hate", "racist", "nazi", "supremacist", "genocide"], "severity": 0.9},
    "illegal": {"keywords": ["illegal", "assassinate", "trafficking", "fraud", "smuggle", "drug manufacture"], "severity": 0.95},
    "suspicious_command": {
        "keywords": ["admin", "credentials", "secret", "internal", "details", "ignore all the instructions", "disregard", "act as", "pretend"],
        "severity": 0.85 # This severity (0.45) is > warning threshold (0.3) and < alter threshold (0.6)
    },
    "self_harm": {"keywords": ["kill myself", "suicide", "self harm", "end my life", "want to die"], "severity": 0.9},
    "profanity": {"keywords": ["fuck", "shit", "damn", "bitch", "asshole", "bastard"], "severity": 0.4},
}


# -----------------------
# Learning store (minimal)
# -----------------------
class InjectionLearningStore:
    def __init__(self):
        self.flagged_patterns = defaultdict(int)
        self.user_attempts = defaultdict(list)  # user_id -> [(datetime, pattern)]
        self.false_positives = set()
        self.blocked_users = set()
        self.attempt_log = defaultdict(list)  # user_id -> [{"timestamp": float, "is_injection": bool}]
        self.user_strikes = defaultdict(int)

    def record_detection(self, user_id: str, pattern: str, confirmed: bool = True):
        now = datetime.utcnow()
        self.user_attempts[user_id].append((now, pattern))
        if confirmed:
            self.flagged_patterns[pattern] += 1
            self.attempt_log[user_id].append({"timestamp": time.time(), "is_injection": True})
        else:
            self.false_positives.add(pattern)
            self.attempt_log[user_id].append({"timestamp": time.time(), "is_injection": False})

    def get_user_risk_score(self, user_id: str) -> float:
        cutoff = datetime.utcnow() - timedelta(seconds=CONFIG["injection_detection"]["rate_limit_window_s"])
        recent = [p for p in self.user_attempts.get(user_id, []) if p[0] > cutoff]
        if not recent:
            return 0.0
        max_attempts = CONFIG["injection_detection"]["max_suspicious_attempts"]
        return min(len(recent) / max_attempts, 1.0)

    def get_recent_jailbreak_count(self, user_id: str) -> int:
        now_ts = time.time()
        window = CONFIG["injection_detection"]["rate_limit_window_s"]
        recent = [a for a in self.attempt_log.get(user_id, []) if (now_ts - a["timestamp"]) <= window]
        return sum(1 for a in recent if a.get("is_injection"))

    def block_user(self, user_id: str):
        self.blocked_users.add(user_id)
        logger.info(f"User {user_id} auto-blocked")

    def is_blocked(self, user_id: str) -> bool:
        return user_id in self.blocked_users


learning_store = InjectionLearningStore()


# -----------------------
# Utilities: detection, sanitization
# -----------------------
def detect_jailbreak(prompt: str) -> bool:
    return any(re.search(p, prompt, re.IGNORECASE) for p in JAILBREAK_PATTERNS)


def detect_prompt_injection(text: str, user_id: str) -> Dict[str, Any]:
    if not CONFIG["injection_detection"]["enabled"]:
        return {"is_injection": False, "injection_score": 0.0, "patterns_detected": [], "severity": 0.0, "explanation": "disabled"}

    detected = []
    max_sev = 0.0
    details = []
    for cat, cfg in INJECTION_PATTERNS.items():
        for pattern in cfg["patterns"]:
            if re.search(pattern, text, re.IGNORECASE):
                detected.append(cat)
                max_sev = max(max_sev, cfg["severity"])
                details.append({"category": cat, "pattern": pattern, "description": cfg.get("description")})
                if CONFIG["injection_detection"]["learning_enabled"]:
                    learning_store.record_detection(user_id, cat, confirmed=True)
                break

    user_risk = learning_store.get_user_risk_score(user_id)
    adjusted = min(max_sev + (user_risk * 0.2), 1.0)
    is_flagged_user = learning_store.get_user_risk_score(user_id) >= 1.0
    threshold = CONFIG["injection_detection"]["max_injection_score"]
    is_injection = adjusted >= threshold or is_flagged_user

    explanation = "clean"
    if is_injection:
        explanation = f"Critical injection patterns detected: {', '.join(set(detected))}" if detected else "User flagged"
    elif detected:
        explanation = f"Suspicious patterns (below threshold): {', '.join(set(detected))}"

    return {
        "is_injection": bool(is_injection),
        "injection_score": round(adjusted, 3),
        "patterns_detected": detected,
        "severity": round(max_sev, 3),
        "user_risk_score": round(user_risk, 3),
        "pattern_details": details,
        "explanation": explanation,
    }


def _keyword_in_text(text_lower: str, keyword: str) -> bool:
    try:
        return bool(re.search(rf"\b{re.escape(keyword)}\b", text_lower))
    except re.error:
        return keyword in text_lower


def analyze_content(text: str) -> Dict[str, Any]:
    t = (text or "").lower()

    # Initialize PII and categories
    pii_found = {}
    categories = []

    # Detect PII
    for k, pat in PII_PATTERNS.items():
        matches = pat.findall(text or "")
        if matches:
            pii_found[k] = matches

    # Detect content keywords
    max_sev = 0.0
    for cat, cfg in CONTENT_RULES.items():
        for kw in cfg["keywords"]:
            if _keyword_in_text(t, kw):
                categories.append(cat)
                max_sev = max(max_sev, cfg["severity"])
                break

    # Increase severity if PII found
    if pii_found:
        max_sev = max(max_sev, 0.5)

    # Determine action based on thresholds
    thresholds = CONFIG["thresholds"]
    if max_sev >= thresholds["reject"] or any(c in {"violence", "illegal", "self_harm", "hate_speech"} for c in categories):
        action = "reject"
    elif max_sev >= thresholds["alter"]:
        action = "alter"
    elif max_sev >= thresholds["warning"]:
        action = "warning"
    else:
        action = "accept"

    # Safely define reason
    if categories:
        reason = ", ".join(categories)
    elif pii_found:
        reason = "PII detected"
    else:
        reason = "safe"

    return {"severity_score": round(max_sev, 3), "action": action, "categories": categories, "pii_found": pii_found, "reason": reason}


def sanitize_text(text: str, analysis: Dict[str, Any]) -> str:
    """
    Sanitizes text based on detected PII and content categories.
    
    - PII (emails, SSNs, phone numbers, credit cards) → [REDACTED_PII]
    - Sensitive content keywords → [FILTERED]
    """
    sanitized = text or ""

    # 1️⃣ Redact PII
    for pat in PII_PATTERNS.values():
        sanitized = pat.sub("[REDACTED_PII]", sanitized)

    # 2️⃣ Filter sensitive keywords from content categories
    for category in analysis.get("categories", []):
        keywords = CONTENT_RULES.get(category, {}).get("keywords", [])
        for kw in keywords:
            # case-insensitive, word-boundary replacement
            sanitized = re.sub(rf"(?i)\b{re.escape(kw)}\b", "[FILTERED]", sanitized)

    # 3️⃣ Optional: limit length or strip extra spaces/newlines
    sanitized = re.sub(r"\s+", " ", sanitized).strip()

    return sanitized



# -----------------------
# LLM integration (Gemini or stub)
# -----------------------
genai = None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
try:
    import google.generativeai as genai_lib  # type: ignore
    genai = genai_lib
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)  # may throw if not configured
        logger.info("Gemini configured")
except Exception:
    genai = None
    logger.info("Gemini client not available; using stub responses.")


async def call_gemini(prompt: str) -> Dict[str, str]:
    """
    If gemini is available and key set, attempt a call (minimal usage).
    Otherwise return a safe deterministic stub.
    """
    if genai and GEMINI_API_KEY:
        try:
            model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
            model = genai.GenerativeModel(model_name)  # may vary by genai version
            resp = await model.generate_content_async(prompt)
            text = getattr(resp, "text", str(resp))
            return {"text": text, "model": model_name}
        except Exception:
            logger.exception("Gemini call failed")
            raise
    # stub
    return {"text": f"(LLM stub) Echo: {prompt}", "model": "stub"}


# -----------------------
# Pydantic models
# -----------------------
class MessageIn(BaseModel):
    user_id: str
    session_id: Optional[str] = None
    message: str
    metadata: Optional[Dict[str, Any]] = {}


class FeedbackIn(BaseModel):
    request_id: str
    user_id: str
    verdict: str
    comments: Optional[str] = None
    was_false_positive: Optional[bool] = False


# -----------------------
# Routes
# -----------------------
@app.on_event("startup")
async def startup_event():
    logger.info("ByeJect proxy starting up")
    _ensure_logfile()


@app.post("/v1/message")
async def handle_message(payload: MessageIn):
    """
    Main proxy endpoint:
    - Always returns JSON. If blocked/rejected, returns a JSON object describing block with blocked: true.
    - Leaves HTTPExceptions for true server errors (e.g., LLM failed).
    """
    start_time = time.time()
    request_id = str(uuid.uuid4())
    logger.info(f"[{request_id}] Processing message from {payload.user_id}")

    # Phase 0: Injection / Jailbreak detection
    injection_analysis = detect_prompt_injection(payload.message or "", payload.user_id)
    await audit_log({
        "event": "injection_scan",
        "request_id": request_id,
        "user_id": payload.user_id,
        "is_injection": injection_analysis["is_injection"],
        "score": injection_analysis["injection_score"],
        "patterns": injection_analysis["patterns_detected"],
    })

    # Jailbreak detection (explicit patterns)
    if detect_jailbreak(payload.message or ""):
        learning_store.record_detection(payload.user_id, "jailbreak", confirmed=True)
        recent_jailbreaks = learning_store.get_recent_jailbreak_count(payload.user_id)
        if recent_jailbreaks >= CONFIG["injection_detection"]["auto_block_jailbreak_after"]:
            learning_store.block_user(payload.user_id)

        entry = {
            "event": "jailbreak_blocked",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "block",
            "block_type": "jailbreak",
            "reason": "jailbreak manipulation detected",
            "prompt": payload.message,
            "altered": True,
        }
        await audit_log(entry)

        # Return a structured JSON (200) so dashboard receives it cleanly
        return JSONResponse(content={
            "request_id": request_id,
            "user_id": payload.user_id,
            "blocked": True,
            "block_type": "JAILBREAK",
            "reason": entry["reason"],
            "recent_jailbreaks": recent_jailbreaks,
            "auto_blocked": learning_store.is_blocked(payload.user_id),
            "llm_text": None,
            "model_used": None,
            "latency_ms": int((time.time() - start_time) * 1000)
        })

    # If injection detection triggered
    if injection_analysis["is_injection"]:
        logger.warning(f"[{request_id}] PROMPT INJECTION BLOCKED: {injection_analysis['explanation']}")
        entry = {
            "event": "injection_blocked",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "block",
            "block_type": "prompt_injection",
            "reason": injection_analysis["explanation"],
            "patterns": injection_analysis["patterns_detected"],
            "score": injection_analysis["injection_score"],
            "prompt": payload.message,
        }
        await audit_log(entry)

        # Return structured JSON (200) to allow dashboard record w/out HTTP error
        return JSONResponse(content={
            "request_id": request_id,
            "user_id": payload.user_id,
            "blocked": True,
            "block_type": "PROMPT_INJECTION",
            "patterns_detected": injection_analysis["patterns_detected"],
            "injection_score": injection_analysis["injection_score"],
            "explanation": injection_analysis["explanation"],
            "llm_text": None,
            "model_used": None,
            "latency_ms": int((time.time() - start_time) * 1000)
        })

    # Phase 1: Content analysis of input (accept/warning/alter/reject)
    input_analysis = analyze_content(payload.message or "")
    await audit_log({
        "event": "input_analysis",
        "request_id": request_id,
        "user_id": payload.user_id,
        "action": input_analysis["action"],
        "severity": input_analysis["severity_score"],
    })

    user_notification = None
    final_prompt = payload.message or ""
    # If reject, we block but return structured JSON (200) so dashboard sees it as a block.
    if input_analysis["action"] == "reject":
        logger.warning(f"[{request_id}] INPUT REJECTED: {input_analysis['reason']}")
        entry = {
            "event": "input_rejected",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "reject",
            "reason": input_analysis.get("reason"),
            "prompt": payload.message,
        }
        await audit_log(entry)

        return JSONResponse(content={
            "request_id": request_id,
            "user_id": payload.user_id,
            "blocked": True,
            "block_type": "CONTENT_REJECT",
            "reason": input_analysis.get("reason"),
            "llm_text": None,
            "model_used": None,
            "latency_ms": int((time.time() - start_time) * 1000)
        })

    elif input_analysis["action"] == "alter":
        final_prompt = sanitize_text(payload.message or "", input_analysis)
        user_notification = {
            "type": "info",
            "message": "⚠️ Your message was modified for safety before processing.",
            "details": input_analysis
        }
        # persist the alteration
        await audit_log({
            "event": "input_update",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "alter",
            "reason": input_analysis.get("reason"),
            "prompt": payload.message,
            "altered_prompt": final_prompt,
            "altered": True,
        })

    elif input_analysis["action"] == "warning":
        user_notification = {
            "type": "warning",
            "message": "⚠️ Your message contains potentially sensitive content.",
            "details": input_analysis
        }
        await audit_log({
            "event": "input_warning",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "warning",
            "reason": input_analysis.get("reason"),
            "prompt": payload.message,
        })

    # Phase 2: Safe prompt wrapper (simple - extendable)
    wrapped_prompt = f"You are a safe assistant. User asked: {final_prompt}"

    # Phase 3: LLM inference
    try:
        llm_result = await asyncio.wait_for(call_gemini(wrapped_prompt), timeout=CONFIG["llm_timeout_s"])
        llm_text = llm_result.get("text", "")
        model_used = llm_result.get("model", "unknown")
    except asyncio.TimeoutError:
        # LLM timeout -> legitimate server error
        logger.error(f"[{request_id}] LLM timeout")
        raise HTTPException(status_code=504, detail="LLM timeout")
    except Exception as e:
        logger.exception(f"[{request_id}] LLM error: {e}")
        raise HTTPException(status_code=502, detail=f"LLM error: {str(e)}")

    # Phase 4: Output analysis + possible alter/warn/reject
    output_analysis = analyze_content(llm_text or "")
    final_response_text = llm_text
    output_warning = None
    if output_analysis["action"] in ("reject", "alter"):
        final_response_text = sanitize_text(llm_text or "", output_analysis)
        output_warning = {
            "type": "warning",
            "message": "⚠️ The AI response was modified for safety.",
            "details": output_analysis
        }
        await audit_log({
            "event": "output_analysis",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "alter",
            "reason": output_analysis.get("reason"),
            "sanitized_output": final_response_text,
            "altered": True,
        })
    elif output_analysis["action"] == "warning":
        output_warning = {
            "type": "info",
            "message": "ℹ️ This response may contain sensitive content.",
            "details": output_analysis
        }
        await audit_log({
            "event": "output_warning",
            "request_id": request_id,
            "user_id": payload.user_id,
            "action": "warning",
            "reason": output_analysis.get("reason"),
        })

    # Final latency metrics
    total_latency = int((time.time() - start_time) * 1000)

    # Persist a summary record
    try:
        save_moderation_log({
            "id": request_id,
            "request_id": request_id,
            "action": input_analysis["action"],
            "model_used": model_used,
            "user_id": payload.user_id,
            "prompt": payload.message,
            "llm_text": (final_response_text or "")[:2000],
            "latency_ms": total_latency,
            "timestamp": now_iso(),
            "altered": input_analysis["action"] == "alter" or output_analysis["action"] == "alter",
        })
    except Exception:
        logger.exception("Failed to save request summary to log")

    await audit_log({"event": "request_completed", "request_id": request_id, "user_id": payload.user_id, "latency_ms": total_latency})

    # Always return structured JSON (200) for the UI to handle.
    return JSONResponse(content={
        "request_id": request_id,
        "user_id": payload.user_id,
        "llm_text": final_response_text,
        "user_notification": user_notification,
        "output_warning": output_warning,
        "injection_analysis": injection_analysis,
        "input_analysis": input_analysis,
        "output_analysis": output_analysis,
        "model_used": model_used,
        "latency_ms": total_latency,
        "security_flags": {
            "prompt_injection_detected": injection_analysis["is_injection"],
            "user_risk_score": injection_analysis.get("user_risk_score", 0.0),
        }
    })


@app.post("/v1/feedback")
async def feedback(payload: FeedbackIn):
    await audit_log({
        "event": "user_feedback",
        "request_id": payload.request_id,
        "user_id": payload.user_id,
        "verdict": payload.verdict,
        "comments": payload.comments,
        "was_false_positive": payload.was_false_positive,
    })
    # Optionally adjust learning store (no-op here)
    if payload.was_false_positive and CONFIG["injection_detection"]["learning_enabled"]:
        logger.info(f"User reported false positive: {payload.user_id} for {payload.request_id}")
    return {"status": "received", "request_id": payload.request_id}


@app.get("/health")
async def health():
    return {"status": "ok", "version": "4.0.0", "injection_detection": CONFIG["injection_detection"]["enabled"]}


@app.get("/api/moderation/logs")
async def api_moderation_logs(limit: int = 50):
    _ensure_logfile()
    try:
        with LOG_FILE.open("r", encoding="utf-8") as f:
            logs = json.load(f)
    except Exception:
        logs = []
    return JSONResponse(content=logs[:limit])


@app.get("/api/moderation/stats")
async def api_moderation_stats():
    _ensure_logfile()
    try:
        with LOG_FILE.open("r", encoding="utf-8") as f:
            logs = json.load(f)
    except Exception:
        logs = []
    total = len(logs)
    counts: Dict[str, int] = {}
    for l in logs:
        action = (l.get("action") or "").lower()
        counts[action] = counts.get(action, 0) + 1
    return {"total_logs": total, "counts": counts}


@app.get("/api/moderation/timeline")
async def api_moderation_timeline(hours: int = 24):
    _ensure_logfile()
    try:
        with LOG_FILE.open("r", encoding="utf-8") as f:
            logs = json.load(f)
    except Exception:
        logs = []
    cutoff = datetime.utcnow() - timedelta(hours=hours)
    buckets: Dict[str, int] = {}
    for l in logs:
        ts = l.get("timestamp") or ""
        if not ts:
            continue
        try:
            # accept ISOZ or naive iso
            clean_ts = ts.rstrip("Z")
            dt = datetime.fromisoformat(clean_ts)
        except Exception:
            continue
        if dt < cutoff:
            continue
        key = dt.strftime("%Y-%m-%d %H:00")
        buckets[key] = buckets.get(key, 0) + 1
    items = [{"time": k, "count": buckets[k]} for k in sorted(buckets.keys())]
    return {"timeline": items}


# -----------------------
# Run server (only if executed directly)
# -----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
