const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/lawyers/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Lawyer not found" });
    if (user.role !== "lawyer") return res.status(400).json({ message: "User is not a lawyer" });
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
