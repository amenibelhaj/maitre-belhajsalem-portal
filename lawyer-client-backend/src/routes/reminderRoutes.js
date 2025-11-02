const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const reminderController = require("../controllers/reminderController");
const multer = require("multer");

// ✅ Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🔹 Routes for reminders
// Only clients can access
router.get("/client", authMiddleware, reminderController.getClientReminders);

// Create a reminder (Lawyer only)
router.post("/", authMiddleware, reminderController.createReminder);

// Get reminders (Lawyer sees own, client sees theirs)
router.get("/", authMiddleware, reminderController.getReminders);

// Update reminder (Lawyer only)
router.put("/:id", authMiddleware, reminderController.updateReminder);

// Delete reminder (Lawyer only)
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

// Client uploads document for a reminder
router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("document"), // 'document' is the form field name
  reminderController.uploadDocument
);

module.exports = router;
