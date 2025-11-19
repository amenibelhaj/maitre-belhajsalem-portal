const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Client = sequelize.define("Client", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phone: { type: DataTypes.STRING },
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },
   userId: { type: DataTypes.INTEGER, allowNull: false }, 
});
module.exports = Client;
