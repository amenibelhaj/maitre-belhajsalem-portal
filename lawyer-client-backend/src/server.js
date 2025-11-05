// server.js
const dotenv = require("dotenv");
dotenv.config(); // ✅ must be before using process.env

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { sequelize } = require("./models"); // ✅ single source of truth

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" }, // allow all origins (adjust in production)
});

// Make io accessible in routes
app.set("io", io);

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A client connected");

  // ⚡ Authenticate socket using JWT
  const token = socket.handshake.auth.token;
  if (!token) return socket.disconnect();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Automatically join user-specific room
    socket.join(`user_${userId}`);
    console.log(`User ${userId} connected and joined room user_${userId}`);
  } catch (err) {
    console.error("Socket auth failed:", err.message);
    socket.disconnect();
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // ⚠️ DEVELOPMENT ONLY: Drop and recreate all tables
    await sequelize.sync({ alter: true });
    console.log("✅ All tables dropped & recreated");

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();
