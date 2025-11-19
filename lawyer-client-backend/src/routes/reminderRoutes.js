const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const reminderController = require("../controllers/reminderController");
const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });



router.get("/client", authMiddleware, reminderController.getClientReminders);


router.post("/", authMiddleware, reminderController.createReminder);


router.get("/", authMiddleware, reminderController.getReminders);


router.put("/:id", authMiddleware, reminderController.updateReminder);


router.delete("/:id", authMiddleware, reminderController.deleteReminder);


router.post(
  "/:id/upload",
  authMiddleware,
  upload.single("document"), 
  reminderController.uploadDocument
);

module.exports = router;
