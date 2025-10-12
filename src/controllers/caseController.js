const Case = require("../models/Case");
const Client = require("../models/Client");
const User = require("../models/User");

// 🔹 Create a new case for a client
exports.createCase = async (req, res) => {
  try {
    const { title, description, courtDate, status, clientId, sessions, actions, outcome } = req.body;

    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can create cases" });
    }

    const client = await Client.findByPk(clientId);
    if (!client || client.lawyerId !== req.user.id) {
      return res.status(404).json({ message: "Client not found or not yours" });
    }

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

    // Only the lawyer who owns the case can view
    if (foundCase.lawyerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this case" });
    }

    res.json(foundCase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Update a case
exports.updateCase = async (req, res) => {
  try {
    const { id } = req.params;
    const foundCase = await Case.findByPk(id);
    if (!foundCase) return res.status(404).json({ message: "Case not found" });

    if (foundCase.lawyerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this case" });
    }

    const { title, description, courtDate, status, sessions, actions, outcome } = req.body;

    await foundCase.update({
      title: title ?? foundCase.title,
      description: description ?? foundCase.description,
      courtDate: courtDate ?? foundCase.courtDate,
      status: status ?? foundCase.status,
      sessions: sessions ?? foundCase.sessions,
      actions: actions ?? foundCase.actions,
      outcome: outcome ?? foundCase.outcome,
    });

    const updatedCase = await Case.findByPk(id, {
      include: [
        { model: Client, as: "client", attributes: ["id", "name", "email", "phone"] },
        { model: User, as: "lawyer", attributes: ["id", "name", "email"] },
      ],
    });

    res.json({ message: "Case updated successfully", case: updatedCase });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Delete a case
exports.deleteCase = async (req, res) => {
  try {
    const { id } = req.params;
    const foundCase = await Case.findByPk(id);
    if (!foundCase) return res.status(404).json({ message: "Case not found" });

    if (foundCase.lawyerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this case" });
    }

    await foundCase.destroy();
    res.json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
