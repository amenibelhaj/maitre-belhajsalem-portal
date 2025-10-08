const Reminder = require("../models/Reminder");

exports.createReminder = async (req, res) => {
  try {
    const { title, description, recipientId } = req.body;

    const reminder = await Reminder.create({
      title,
      description,
      recipientId,
      lawyerId: req.user.id, // lawyer creating reminder
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: "Error creating reminder", error });
  }
};

exports.getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { recipientId: req.user.id }, // client fetches only their reminders
    });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reminders", error });
  }
};
