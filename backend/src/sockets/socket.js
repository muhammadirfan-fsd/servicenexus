const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Chat events
    socket.on("send_message", (data) => {
      io.to(data.receiverId).emit("new_message", data);
    });

    socket.on("typing", (data) => {
      socket.to(data.receiverId).emit("typing", data);
    });

    socket.on("stop_typing", (data) => {
      socket.to(data.receiverId).emit("stop_typing", data);
    });

    // Booking updates
    socket.on("booking_update", (data) => {
      io.to(data.customerId).emit("booking_update", data);
      io.to(data.providerId).emit("booking_update", data);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };