const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./Client");
const User = require("./User"); // lawyer

const Case = sequelize.define("Case", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM("open", "closed", "pending"), defaultValue: "pending" },
  courtDate: { type: DataTypes.DATE },
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },
});

Case.belongsTo(Client, { foreignKey: "clientId", as: "client" });
Case.belongsTo(User, { foreignKey: "lawyerId", as: "lawyer" });

module.exports = Case;
