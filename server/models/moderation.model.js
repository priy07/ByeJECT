// models/moderation.model.js
import mongoose from "mongoose";

const moderationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    prompt: { type: String, required: true },
    action: { type: String, enum: ["accept", "warn", "reject"], required: true },
    reason: { type: String },
    altered: { type: Boolean, default: false } // Track if proxy modifies content
  },
  { timestamps: true }
);

const Moderation = mongoose.model("Moderation", moderationSchema);

export default Moderation;
