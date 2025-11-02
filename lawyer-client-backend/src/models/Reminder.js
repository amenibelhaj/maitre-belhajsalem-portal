// backend/src/models/Reminder.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reminder = sequelize.define("Reminder", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  document: { type: DataTypes.STRING }, // path to uploaded file
  documentUrl: { type: DataTypes.STRING }, // public URL of uploaded file
  recipientId: { type: DataTypes.INTEGER, allowNull: false }, // client ID
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },    // lawyer ID
  type: {
    type: DataTypes.ENUM("normal", "document_request"),
    defaultValue: "normal",
  },
});

module.exports = Reminder;
