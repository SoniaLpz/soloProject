import axios from "axios";
import type { UserData } from "../types/userData.js";

// Base URL for the backend API
const API_URL = "http://localhost:3000/auth";

interface AuthResponse {
  token: string;
  role: string;
}

export const register = async (userData: UserData): Promise<void> => {
  await axios.post(`${API_URL}/register`, userData);
};

export const login = async (userData: UserData): Promise<AuthResponse> => {
  // ? if time: add try catch for better error handling
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token in localStorage
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("token");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};
