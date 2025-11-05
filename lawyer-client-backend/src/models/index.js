const sequelize = require("../config/db");
const User = require("./User");
const Client = require("./Client");
const Case = require("./Case");
const Reminder = require("./Reminder");
console.log({ User: !!User, Client: !!Client, Case: !!Case, Reminder: !!Reminder });

// Associations
User.hasMany(Client, { as: "clients", foreignKey: "lawyerId" });
Client.belongsTo(User, { as: "lawyer", foreignKey: "lawyerId" });

Client.belongsTo(User, { as: "user", foreignKey: "userId" });

Client.hasMany(Case, { as: "cases", foreignKey: "clientId" });
Case.belongsTo(Client, { as: "client", foreignKey: "clientId" });

User.hasMany(Case, { as: "lawyerCases", foreignKey: "lawyerId" });
Case.belongsTo(User, { as: "lawyer", foreignKey: "lawyerId" });

Reminder.belongsTo(User, { as: "sender", foreignKey: "senderId" });
Reminder.belongsTo(User, { as: "recipient", foreignKey: "recipientId" });
User.hasMany(Reminder, { as: "sentReminders", foreignKey: "senderId" });
User.hasMany(Reminder, { as: "receivedReminders", foreignKey: "recipientId" });

// Export everything cleanly
module.exports = { sequelize, User, Client, Case, Reminder };
