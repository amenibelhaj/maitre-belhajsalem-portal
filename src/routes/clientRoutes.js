const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createClient, getClients, getClientDetails } = require("../controllers/clientController");

const router = express.Router();

router.post("/", authMiddleware, createClient);
router.get("/", authMiddleware, getClients);
router.get("/:id", authMiddleware, getClientDetails);

module.exports = router;
