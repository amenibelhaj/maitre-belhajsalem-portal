const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware"); // import correctly

// Protect routes with authMiddleware
router.post("/", authMiddleware, caseController.createCase);
router.get("/", authMiddleware, caseController.getCases);
router.get("/:id", authMiddleware, caseController.getCaseById);

module.exports = router;
