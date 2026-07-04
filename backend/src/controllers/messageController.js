const Message = require("../models/Message");
const {
  getIO,
  getOnlineUsers,
} = require("../services/socketService");

// ================= GET CHAT HISTORY =================
const getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const messages = await Message.find({
      $or: [
        {
          sender: senderId,
          receiver: receiverId,
        },
        {
          sender: receiverId,
          receiver: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= SEND MESSAGE =================
const sendMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiver, message } = req.body;

    if (!receiver || !message) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      isRead: false,
    });

    // Emit message if receiver is online
    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const receiverSocketId = onlineUsers.get(receiver);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
        "receiveMessage",
        newMessage
      );
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= MARK AS READ =================
const markMessagesAsRead = async (req, res) => {
  try {
    const receiver = req.user.id;
    const sender = req.params.senderId;

    await Message.updateMany(
      {
        sender,
        receiver,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    // Notify sender if online
    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const senderSocketId = onlineUsers.get(sender);

    if (senderSocketId) {
      io.to(senderSocketId).emit(
        "messagesRead",
        {
          reader: receiver,
        }
      );
    }

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  markMessagesAsRead,
};