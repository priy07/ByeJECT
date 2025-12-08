import express from "express";

const creditRouter = express.Router();

// Payment routes removed - return 410 Gone
creditRouter.get('/plan', (req, res) => res.status(410).json({ success: false, message: 'Payments removed' }));
creditRouter.post('/purchase', (req, res) => res.status(410).json({ success: false, message: 'Payments removed' }));

export default creditRouter;