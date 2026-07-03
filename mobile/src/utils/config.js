export const SERVER_URL = __DEV__
  ? "http://192.168.1.11:5000" // Your local backend
  : "https://chat-reactor.onrender.com"; // Production backend

export const API_URL = `${SERVER_URL}/api`;