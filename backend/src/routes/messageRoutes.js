const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} = require("../controllers/messageController");

// Get chat history
router.get(
  "/:receiverId",
  authMiddleware,
  getMessages
);

// Send message
router.post(
  "/",
  authMiddleware,
  sendMessage
);

// Mark messages as read
router.put(
  "/read/:senderId",
  authMiddleware,
  markMessagesAsRead
);

module.exports = router;