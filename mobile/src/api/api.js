import axios from "axios";

// Replace with your PC's IPv4 address
const API = axios.create({
  baseURL: "http://192.168.1.11:5000/api",
});

export default API;