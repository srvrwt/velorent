import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register User
export async function registerUser(userData) {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
}

// Login User
export async function loginUser(userData) {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
}

// Forgot Password
export async function forgotPassword(userData) {
  const response = await axios.post(
    `${API_URL}/forgot-password`,
    userData
  );

  return response.data;
}

export async function resetPassword(userData) {
  const response = await axios.post(
    `${API_URL}/reset-password`,
    userData
  );

  return response.data;
}