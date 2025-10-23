const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User"); // lawyer

const Client = sequelize.define("Client", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },
});

Client.belongsTo(User, { foreignKey: "lawyerId", as: "lawyer" });

module.exports = Client;