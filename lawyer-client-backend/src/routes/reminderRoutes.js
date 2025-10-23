const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const reminderController = require("../controllers/reminderController");

router.post("/", authMiddleware, reminderController.createReminder);
router.get("/", authMiddleware, reminderController.getReminders);
router.put("/:id", authMiddleware, reminderController.updateReminder);
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

module.exports = router;