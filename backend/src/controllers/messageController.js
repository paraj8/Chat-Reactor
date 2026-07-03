const Message = require("../models/Message");

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

// Save a message
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

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};