const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const Reminder = require("../models/Reminder");

const router = express.Router();

// ➤ Lawyer creates a reminder for a client
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, recipientId } = req.body;

    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can create reminders" });
    }

    const reminder = await Reminder.create({
      title,
      description,
      recipientId,
      lawyerId: req.user.id,
    });

    // Emit the event to the client room via Socket.IO
    const io = req.app.get("io");
    io.to(`user_${recipientId}`).emit("newReminder", reminder);

    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get reminders for logged-in lawyer or client
router.get("/", authMiddleware, async (req, res) => {
  try {
    let reminders;

    if (req.user.role === "lawyer") {
      reminders = await Reminder.findAll({ where: { lawyerId: req.user.id } });
    } else if (req.user.role === "client") {
      reminders = await Reminder.findAll({ where: { recipientId: req.user.id } });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
