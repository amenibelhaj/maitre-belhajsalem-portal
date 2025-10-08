const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const clientRoutes = require("./routes/clientRoutes"); // <-- add here

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // logs method, url, status, response time

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/clients", clientRoutes); // <-- add here

module.exports = app;
