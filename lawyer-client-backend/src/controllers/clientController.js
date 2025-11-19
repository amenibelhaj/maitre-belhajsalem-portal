const Client = require("../models/Client");
const Case = require("../models/Case");
const User = require("../models/User");
const Reminder = require("../models/Reminder");
const bcrypt = require("bcryptjs");


exports.createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

   
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can add clients" });
    }

    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

   
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    const client = await Client.create({
      name,
      email,
      phone,
      lawyerId: req.user.id,
      userId: user.id,
    });

    res.status(201).json({
      message: "Client and user account created successfully",
      client,
      credentials: {
        id: user.id,
        password: plainPassword, 
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getClients = async (req, res) => {
  try {
    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can view clients" });
    }

    const clients = await Client.findAll({
      where: { lawyerId: req.user.id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"], 
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(clients);
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getClientDetails = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, { include: Case });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyCases = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can view their cases" });
    }

    const client = await Client.findOne({ where: { userId: req.user.id } });
    if (!client) return res.status(404).json({ message: "Client profile not found" });

    const cases = await Case.findAll({
      where: { clientId: client.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(cases);
  } catch (err) {
    console.error("Error fetching client cases:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getMyReminders = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can view reminders" });
    }

    const reminders = await Reminder.findAll({
      where: { recipientId: req.user.id }, 
      order: [["createdAt", "DESC"]],
    });

    res.json(reminders);
  } catch (err) {
    console.error("Error fetching client reminders:", err);
    res.status(500).json({ error: err.message });
  }
};
