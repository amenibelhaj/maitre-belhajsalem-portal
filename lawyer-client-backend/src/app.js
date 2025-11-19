const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const clientRoutes = require("./routes/clientRoutes");
const caseRoutes = require("./routes/caseRoutes");
const lawyerRoutes = require("./routes/lawyerRoutes");



const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev")); 


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/clients", clientRoutes); 
app.use("/api/cases", caseRoutes);
app.use("/api/lawyers", lawyerRoutes);
app.use("/uploads", express.static("uploads"));

module.exports = app;
