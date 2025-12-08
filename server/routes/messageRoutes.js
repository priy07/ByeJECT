// import express from "express";
// import { protect } from "../middlewares/auth.js";
// import { textMessageController } from "../controllers/messageController.js";
// import moderation from "../middlewares/moderation.js";

// const router = express.Router();

// router.post("/text", protect, moderation, textMessageController);

// export default router;
import express from "express";
import { protect } from "../middlewares/auth.js";
import moderation from "../middlewares/moderation.js";
import { textMessageController } from "../controllers/messageController.js";

const router = express.Router();

// moderation MUST come BEFORE the controller
router.post("/text", protect, moderation, textMessageController);

export default router;
