const Client = require("../models/Client");
const Case = require("../models/Case");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// 🔹 Create a new client + linked user account
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // only lawyers can create clients
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can add clients" });
    }

    // check if email already used
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // generate random password
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // create user for the client
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    // create client record linked to lawyer
    const client = await Client.create({
      name,
      email,
      phone,
      lawyerId: req.user.id,
    });

    res.status(201).json({
      message: "Client and user account created successfully",
      client,
      credentials: {
          id: user.id,  
        password: plainPassword, // lawyer sees this to give client
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get all clients of logged-in lawyer
exports.getClients = async (req, res) => {
  try {
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can view clients" });
    }

    const clients = await Client.findAll({ where: { lawyerId: req.user.id } });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get client details with their cases
exports.getClientDetails = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, { include: Case });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};