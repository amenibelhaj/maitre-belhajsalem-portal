const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,     // database name
  process.env.DB_USER,     // username
  process.env.DB_PASS,     // password
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,        // optional: disable SQL logging
  }
);

module.exports = sequelize;
