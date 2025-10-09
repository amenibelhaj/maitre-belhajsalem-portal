const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware"); // ✅ corrected import

// Use authMiddleware for all routes
router.post("/", authMiddleware, caseController.createCase);
router.get("/", authMiddleware, caseController.getCases);
router.get("/:id", authMiddleware, caseController.getCaseById);

module.exports = router;
