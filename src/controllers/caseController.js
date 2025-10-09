const Case = require("../models/Case");
const Client = require("../models/Client");
const User = require("../models/User");

// 🔹 Create a new case for a client
exports.createCase = async (req, res) => {
  try {
    const { title, description, courtDate, status, clientId, sessions, actions, outcome } = req.body;

    // Only lawyers can create cases
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can create cases" });
    }

    // Verify client exists and belongs to this lawyer
    const client = await Client.findByPk(clientId);
    if (!client || client.lawyerId !== req.user.id) {
      return res.status(404).json({ message: "Client not found or not yours" });
    }

    // Create the case
    const newCase = await Case.create({
      title,
      description,
      status: status || "pending",
      courtDate,
      sessions: sessions || [],
      actions: actions || [],
      outcome: outcome || "",
      clientId,
      lawyerId: req.user.id,
    });

    // Fetch the case with client info included
    const fullCase = await Case.findByPk(newCase.id, {
      include: [
        { model: Client, as: "client", attributes: ["id", "name", "email", "phone"] },
        { model: User, as: "lawyer", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json({ message: "Case created successfully", case: fullCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get all cases for logged-in lawyer
exports.getCases = async (req, res) => {
  try {
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can view cases" });
    }

    const cases = await Case.findAll({
      where: { lawyerId: req.user.id },
      include: [
        { model: Client, as: "client", attributes: ["id", "name", "email", "phone"] },
        { model: User, as: "lawyer", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get one case by ID
exports.getCaseById = async (req, res) => {
  try {
    const foundCase = await Case.findByPk(req.params.id, {
      include: [
        { model: Client, as: "client", attributes: ["id", "name", "email", "phone"] },
        { model: User, as: "lawyer", attributes: ["id", "name", "email"] },
      ],
    });

    if (!foundCase) return res.status(404).json({ message: "Case not found" });

    res.json(foundCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
