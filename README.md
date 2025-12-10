<div align="center">

# ✨ ByeJect – AI Safety Proxy System

### Smart Filters · Safe Responses · Secure AI Interactions

<p>
  <img src="https://img.shields.io/badge/AI%20Safety-Enabled-blueviolet?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Proxy%20Layer-Active-brightgreen?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Logs-Real--time-orange?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Maintained%3F-Yes-blue?style=for-the-badge"/>
</p>

<p align="center">
  <b>ByeJect</b> is an advanced proxy-based safety layer that sits between your application and an AI model (GPT-4, Llama, etc.). It analyzes and moderates every prompt and response to ensure safe, ethical, and compliant interactions.
</p>

</div>

---

## 🚀 Designed For
* **AI Developers** building secure LLM applications.
* **Enterprises** requiring compliance and data protection.
* **Research Teams** analyzing LLM behavior.
* **Anyone** needing a safety net for their AI interactions.

## 🌟 Key Capabilities

### 🔒 1. Prompt Moderation
* Identifies harmful or risky user inputs.
* Detects **jailbreaks**, **prompt injections**, and **malicious intent**.
* **Categorization:** `Accept`, `Warning`, `Alter`, `Reject`.

### 🛡️ 2. Response Moderation
* Scans outgoing LLM responses in real-time.
* Removes unsafe or disallowed content before it reaches the user.
* Prevents hallucinated or harmful answers.

### 📜 3. Policy Engine
* **GDPR-friendly:** Automatic PII filtering.
* Sensitive content handling.
* Custom organization-level rules.
* Utilizes **Regex + NLP + Model-based detection**.

### 📊 4. Intelligent Dashboard
* Live moderation timeline.
* Graphs & usage statistics.
* Searchable logs with color-coded decisions.

### ⚙️ 5. Modular Architecture
* Plug-and-play middleware.
* Works with any AI API.
* Clear separation: **Input → Rules → Output → Logs**.

---

## 🧠 System Flow

```mermaid
graph LR
    User --> Frontend
    Frontend --> NodeServer[Node Server]
    NodeServer --> PythonProxy[Python Proxy]
    PythonProxy -- Moderation --> LLM
    LLM --> PythonProxy
    PythonProxy --> NodeServer
````
-----

## 📁 Project Structure

```bash
ByeJect/
│── proxy_server.py          # Moderation proxy (Python)
│── requirements.txt         # Python dependencies
│── ByeJect.pptx             #Presentation
│
├── client/                  # React frontend
├── server/                  # Node dashboard backend
└── logs/                    # Moderation logs
```

-----

## ⚙️ Getting Started

To run the full system manually, you need **3 terminals** running simultaneously.

### 🟦 Terminal 1 — Start Python Proxy

Handles the core logic and AI communication.

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (Mac/Linux)
# source venv/bin/activate

# Install dependencies & Run
pip install -r requirements.txt
uvicorn proxy_server:app --reload
```

> **Runs at:** `http://localhost:8000`

### 🟩 Terminal 2 — Start Dashboard Backend

Handles data storage and dashboard API.

```bash
cd server
npm install
npm start
```

### 🟨 Terminal 3 — Start Client Frontend

The visual interface for monitoring.

```bash
cd client
npm install
npm run dev
```

> **Runs at:** `http://localhost:5173`

-----

## 🔗 API Usage

You can interact with the proxy directly via API.

**Endpoint:** `POST /v1/message`

### 💬 Request

```json
{
  "user_id": "u1",
  "session_id": "s1",
  "message": "Hello!"
}
```

### 📥 Moderated Response

```json
{
  "action": "accept",
  "moderated_input": "Hello!",
  "llm_response": "Hi there!"
}
```

-----

## 📚 Logs & Monitoring

All interactions are logged for safety audits.

  * **File Path:** `logs/moderation_text_logs.txt`
  * **Dashboard View:** View Timestamps, Actions (Accept/Reject), Input/Output pairs, and detected risks.

-----

## 👨‍💻 Contributors
<table align="center"> <tr> <td align="center"><b>Mohit Dubey</b></td> <td align="center"><b>Priyanshi Dwivedi</b></td> <td align="center"><b>Samiksha Pandey</b></td> </tr> </table>

