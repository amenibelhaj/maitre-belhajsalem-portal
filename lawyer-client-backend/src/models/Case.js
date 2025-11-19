const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Case = sequelize.define("Case", {
  title: { type: DataTypes.STRING, allowNull: false },           
  description: { type: DataTypes.TEXT },                         
  status: { type: DataTypes.ENUM("open", "closed", "pending"), defaultValue: "pending" }, 
  courtDate: { type: DataTypes.DATE },                            
  sessions: { type: DataTypes.JSON, defaultValue: [] },           
  actions: { type: DataTypes.JSON, defaultValue: [] },            
  outcome: { type: DataTypes.STRING, defaultValue: "" },          
  clientId: { type: DataTypes.INTEGER, allowNull: false },
  lawyerId: { type: DataTypes.INTEGER, allowNull: false },
});



module.exports = Case;