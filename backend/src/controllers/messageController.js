const Message = require("../models/Message");
const {
  getIO,
  getOnlineUsers,
} = require("../services/socketService");

// Get chat history
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

// Send a message
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
    });

    // Emit message to receiver if online
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

module.exports = {
  getMessages,
  sendMessage,
};