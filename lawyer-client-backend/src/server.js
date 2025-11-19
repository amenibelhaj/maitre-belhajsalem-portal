const dotenv = require("dotenv");
dotenv.config(); 

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { sequelize } = require("./models"); 

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);


const io = new Server(server, {
  cors: { origin: "*" }, 
});


app.set("io", io);


io.on("connection", (socket) => {
  console.log("A client connected");

  
  const token = socket.handshake.auth.token;
  if (!token) return socket.disconnect();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    
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

    
    await sequelize.sync({ alter: true });
    console.log(" All tables dropped & recreated");

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();
