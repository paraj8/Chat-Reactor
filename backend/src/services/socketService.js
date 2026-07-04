const { Server } = require("socket.io");

let io;

// Stores: userId -> socketId
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

    // ================= JOIN =================
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      console.log(`✅ User ${userId} joined`);

      // Notify everyone that this user is online
      io.emit("userOnline", userId);

      // Send complete online users list
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    // ================= READ RECEIPTS =================
    socket.on("messagesRead", ({ senderId, readerId }) => {
      const senderSocketId = onlineUsers.get(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesRead", {
          reader: readerId,
        });
      }
    });

    // ================= DISCONNECT =================
    socket.on("disconnect", () => {
      let disconnectedUser = null;

      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUser = userId;
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUser) {
        console.log(`🔴 User ${disconnectedUser} disconnected`);

        // Notify everyone
        io.emit("userOffline", disconnectedUser);
      }

      // Update online users list
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
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