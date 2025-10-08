const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reminder = sequelize.define("Reminder", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  recipientId: { type: DataTypes.INTEGER, allowNull: false }, // client ID
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },    // lawyer ID
});

module.exports = Reminder;
