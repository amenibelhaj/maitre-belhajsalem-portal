
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Reminder = sequelize.define("Reminder", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  document: { type: DataTypes.STRING }, 
  documentUrl: { type: DataTypes.STRING }, 
  recipientId: { type: DataTypes.INTEGER, allowNull: false }, 
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },    
  type: {
    type: DataTypes.ENUM("normal", "document_request"),
    defaultValue: "normal",
  },
});

module.exports = Reminder;
