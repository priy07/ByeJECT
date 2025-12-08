import axios from "axios";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Moderation from "../models/moderation.model.js";

export const textMessageController = async (req, res) => {
  try {
    const { chatId, prompt: incomingPrompt, userId } = req.body;

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------
    if (!chatId || !incomingPrompt || !userId) {
      return res.status(400).json({ success: false, message: "Missing fields." });
    }

    const user = await User.findById(userId);
    if (!user || user.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits or user not found"
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // Moderation middleware may alter req.body.prompt
    const prompt = typeof req.body.prompt === "string" ? req.body.prompt : incomingPrompt;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ success: false, message: "Invalid prompt." });
    }

    // -----------------------------
    // CALL PROXY
    // -----------------------------
    let proxyResp;
    try {
      proxyResp = await axios.post(
        "http://127.0.0.1:8000/v1/message",
        {
          user_id: userId,
          session_id: chatId,
          message: prompt
        },
        { timeout: 15000 }
      );
    } catch (err) {
      console.error("Proxy error:", err.message);
      return res.status(502).json({ success: false, message: "Proxy request failed" });
    }

    const proxyData = proxyResp.data;

    // -----------------------------
    // SAFE LLM TEXT EXTRACTION
    // -----------------------------
    let llmText = null;

    if (typeof proxyData?.llm_text === "string") llmText = proxyData.llm_text;
    if (typeof proxyData?.reply === "string") llmText = proxyData.reply;

    // Gemini-like structure
    if (!llmText && proxyData?.candidates?.[0]?.content?.parts?.[0]?.text) {
      llmText = proxyData.candidates[0].content.parts[0].text;
    }

    if (!llmText || typeof llmText !== "string") {
      llmText = "No response.";
    }

    llmText = llmText.trim();

    // -----------------------------
    // MODERATION MERGE
    // -----------------------------
    const middlewareModeration = req.moderationResult;
    const action =
      middlewareModeration?.action ||
      proxyData?.moderation?.action ||
      "accept";

    const reason =
      middlewareModeration?.reason ||
      proxyData?.moderation?.reason ||
      "none";

    const altered =
      middlewareModeration?.altered ??
      proxyData?.moderation?.altered ??
      false;

    // log moderation if needed
    if (!middlewareModeration && proxyData?.moderation) {
      try {
        await Moderation.create({
          userId,
          prompt,
          action,
          reason,
          altered
        });
      } catch (err) {
        console.error("Failed to log moderation:", err);
      }
    }

    // -----------------------------
    // BUILD AND SAVE MESSAGES
    // -----------------------------
    const formattedUserMsg = {
      role: "user",
      content: prompt,
      isImage: false, 
      timestamp: Date.now()
    };

    const formattedBotMsg = {
      role: "assistant",
      content: llmText,
      isImage: false, 
      timestamp: Date.now(),
      moderation: { action, reason, altered }
    };

    chat.messages.push(formattedUserMsg);
    chat.messages.push(formattedBotMsg);
    await chat.save();

    // Deduct credits
    if (["accept", "warning", "alter"].includes(action)) {
      user.credits -= 1;
      await user.save();
    }

    // SUCCESS RESPONSE
    return res.status(200).json({
      success: true,
      moderation: { action, reason, altered },
      reply: formattedBotMsg
    });

  } catch (err) {
    console.error("textMessageController Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error in message controller"
    });
  }
};
