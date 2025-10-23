const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createClient, getClients, getClientDetails } = require("../controllers/clientController");
const { getMyCases } = require("../controllers/caseController");
const { getClientReminders } = require("../controllers/reminderController");

const router = express.Router();

// 🔹 Lawyer endpoints
router.post("/", authMiddleware, createClient);
router.get("/", authMiddleware, getClients);

// 🔹 Client endpoints (specific first)
router.get("/me/cases", authMiddleware, getMyCases);
router.get("/me/reminders", authMiddleware, getClientReminders);

// 🔹 Dynamic route must come last
router.get("/:id", authMiddleware, getClientDetails);

module.exports = router;
