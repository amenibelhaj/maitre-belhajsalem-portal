const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware");

// Protect all routes
router.get("/me", authMiddleware, caseController.getMyCases);
router.post("/", authMiddleware, caseController.createCase);
router.get("/", authMiddleware, caseController.getCases);
router.get("/:id", authMiddleware, caseController.getCaseById);
router.put("/:id", authMiddleware, caseController.updateCase);     // update a case by its ID
router.delete("/:id", authMiddleware, caseController.deleteCase);  // delete a case by its ID


module.exports = router;