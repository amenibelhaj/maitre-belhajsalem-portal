const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const authMiddleware = require("../middlewares/authMiddleware");


router.get("/me", authMiddleware, caseController.getMyCases);
router.post("/", authMiddleware, caseController.createCase);
router.get("/", authMiddleware, caseController.getCases);
router.get("/:id", authMiddleware, caseController.getCaseById);
router.put("/:id", authMiddleware, caseController.updateCase);     
router.delete("/:id", authMiddleware, caseController.deleteCase);  


module.exports = router;