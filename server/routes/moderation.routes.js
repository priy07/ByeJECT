import express from "express"
import Moderation from "../models/moderation.model.js"

const router = express.Router()

// GET STATS
router.get("/stats", async (req, res) => {
  try {
    const stats = {
      accept: await Moderation.countDocuments({ action: "accept" }),
      warning: await Moderation.countDocuments({ action: "warning" }),
      alter: await Moderation.countDocuments({ action: "alter" }),
      reject: await Moderation.countDocuments({ action: "reject" }),
    }

    res.json(stats)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET TIMELINE
router.get("/timeline", async (req, res) => {
  try {
    const logs = await Moderation.find().sort({ createdAt: 1 })

    const timeline = logs.reduce((acc, log) => {
      const date = log.createdAt.toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = { date, accept: 0, warning: 0, alter: 0, reject: 0 }
      }
      acc[date][log.action]++
      return acc
    }, {})

    res.json(Object.values(timeline))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET LOGS
router.get("/logs", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 25
    const logs = await Moderation.find()
      .sort({ createdAt: -1 })
      .limit(limit)

    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
