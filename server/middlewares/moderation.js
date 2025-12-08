// // server/middlewares/moderation.js
import Moderation from "../models/moderation.model.js";

const violenceRegex = /(kill|murder|shoot|stab|bomb|blow up)/i;

const moderation = async (req, res, next) => {
  try {
    const userId = req.user?._id || null;
    // prefer `prompt` (your controller expects `prompt`)
    const originalPrompt = req.body.prompt || req.body.message || "";

    if (!originalPrompt) {
      return next();
    }

    // Default values
    let action = "accept";
    let reason = "safe";
    let alteredPrompt = originalPrompt;

    // Simple rule-based checks (expand with ML/classifier later)
    if (violenceRegex.test(originalPrompt)) {
      action = "reject";
      reason = "violent intent detected";
    }

    // Example of a simple 'alter' rule (remove dangerous words but keep the question)
    // You can expand this to more complex sanitization.
    if (/sensitive_placeholder/i.test(originalPrompt)) {
      action = "alter";
      reason = "sanitized placeholder";
      alteredPrompt = originalPrompt.replace(/sensitive_placeholder/gi, "[REDACTED]");
    }

    // Log moderation result to DB
    await Moderation.create({
      userId,
      prompt: originalPrompt,
      action,
      reason,
      altered: alteredPrompt !== originalPrompt
    });

    // Attach result for downstream use
    req.moderationResult = { action, reason, altered: alteredPrompt !== originalPrompt };

    // If 'alter', overwrite req.body.prompt so controller sends altered content to proxy
    if (action === "alter") {
      req.body.prompt = alteredPrompt;
      return next();
    }

    // If 'reject', respond safely (HTTP 200 so client doesn't "freeze")
    if (action === "reject") {
      return res.status(200).json({
        success: true,
        moderation: { action, reason, altered: false },
        reply: { role: "assistant", content: "I can’t help with that topic." }
      });
    }

    // action === "accept" or "warning": continue to controller
    return next();
  } catch (err) {
    console.error("Moderation middleware error:", err);
    // Don't block the flow if moderation fails — allow controller to continue
    return next();
  }
};

export default moderation;
