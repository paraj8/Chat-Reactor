import api from "./api";

export const getMessages = (receiverId) => {
  return api.get(`/messages/${receiverId}`);
};

export const sendMessage = (receiver, message) => {
  return api.post("/messages", {
    receiver,
    message,
  });
};