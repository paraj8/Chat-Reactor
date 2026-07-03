import { io } from "socket.io-client";
import { SERVER_URL } from "../utils/config";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(SERVER_URL, {
      transports: ["websocket"],
    });

    socket.emit("join", userId);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};