import API from "../api/api";

export const sendOtp = (data) => {
  return API.post("/auth/send-otp", data);
};

export const register = (data) => {
  return API.post("/auth/register", data);
};

export const login = (data) => {
  return API.post("/auth/login", data);
};

export const getMe = (token) => {
  return API.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};