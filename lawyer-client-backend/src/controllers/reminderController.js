const Reminder = require("../models/Reminder");

const createReminder = async (req, res) => {
  try {
    const { title, description, recipientId, type } = req.body;

    if (req.user.role !== "lawyer") {
      return res.status(403).json({ message: "Only lawyers can create reminders" });
    }

    const reminder = await Reminder.create({
      title,
      description,
      recipientId,
      lawyerId: req.user.id,
      type: type || "normal",
     
    });


    const io = req.app.get("io");
    io.to(`user_${recipientId}`).emit("newReminder", reminder);

    res.status(201).json({ message: "Reminder created successfully", reminder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating reminder", error: error.message });
  }
};

const getReminders = async (req, res) => {
  try {
    let reminders;
    if (req.user.role === "lawyer") {
      reminders = await Reminder.findAll({ where: { lawyerId: req.user.id }, order: [["createdAt", "DESC"]] });
    } else if (req.user.role === "client") {
      reminders = await Reminder.findAll({ where: { recipientId: req.user.id }, order: [["createdAt", "DESC"]] });
    } else {
      return res.status(403).json({ message: "Unauthorized role" });
    }

    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching reminders", error: error.message });
  }
};


const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByPk(id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    if (req.user.role !== "lawyer" || reminder.lawyerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this reminder" });
    }

    const { title, description } = req.body;
    await reminder.update({
      title: title ?? reminder.title,
      description: description ?? reminder.description,
    });

    res.json({ message: "Reminder updated successfully", reminder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating reminder", error: error.message });
  }
};


const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByPk(id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    if (req.user.role !== "lawyer" || reminder.lawyerId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this reminder" });
    }

    await reminder.destroy();
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting reminder", error: error.message });
  }
};

const getClientReminders = async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can view their reminders" });
    }

    const reminders = await Reminder.findAll({
      where: { recipientId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching client reminders", error: error.message });
  }
};


const uploadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const reminder = await Reminder.findByPk(id);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can upload documents" });
    }

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    await reminder.update({ documentUrl: req.file.path });

  
    const io = req.app.get("io");
    io.to(`user_${reminder.lawyerId}`).emit("documentUploaded", reminder);

  
    res.json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading document", error: error.message });
  }
};


module.exports = {
  createReminder,
  getReminders,
  getClientReminders,
  updateReminder,
  deleteReminder,
  uploadDocument,
};
