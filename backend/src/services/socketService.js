const { Server } = require("socket.io");

let io;

// Stores online users
const onlineUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User Connected:", socket.id);

    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      console.log(`User ${userId} joined`);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      console.log("🔴 User Disconnected:", socket.id);
    });
  });
};

const getIO = () => io;

const getOnlineUsers = () => onlineUsers;

module.exports = {
  initSocket,
  getIO,
  getOnlineUsers,
};