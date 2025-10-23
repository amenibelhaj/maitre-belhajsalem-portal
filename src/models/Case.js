const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./Client");
const User = require("./User"); // lawyer

const Case = sequelize.define("Case", {
  title: { type: DataTypes.STRING, allowNull: false },           // موضوع القضية
  description: { type: DataTypes.TEXT },                         // تفاصيل إضافية
  status: { type: DataTypes.ENUM("open", "closed", "pending"), defaultValue: "pending" }, // المآل
  courtDate: { type: DataTypes.DATE },                            // تاريخ الجلسة
  sessions: { type: DataTypes.JSON, defaultValue: [] },           // الجلسات
  actions: { type: DataTypes.JSON, defaultValue: [] },            // الأعمال
  outcome: { type: DataTypes.STRING, defaultValue: "" },          // المآل النهائي
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },
});

Case.belongsTo(Client, { foreignKey: "clientId", as: "client" });
Case.belongsTo(User, { foreignKey: "lawyerId", as: "lawyer" });

module.exports = Case;