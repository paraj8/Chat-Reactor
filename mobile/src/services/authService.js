import api from "./api";

export const sendOtp = (data) => {
  return api.post("/auth/send-otp", data);
};

export const register = (data) => {
  return api.post("/auth/register", data);
};

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const getMe = () => {
  return api.get("/auth/me");
};

export const getUsers = () => {
  return api.get("/users");
};