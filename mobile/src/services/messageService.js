import api from "./api";

// Get all messages with a user
export const getMessages = (receiverId) => {
  return api.get(`/messages/${receiverId}`);
};

// Send a new message
export const sendMessage = (receiver, message) => {
  return api.post("/messages", {
    receiver,
    message,
  });
};

// Mark all messages from a sender as read
export const markMessagesAsRead = (senderId) => {
  return api.put(`/messages/read/${senderId}`);
};