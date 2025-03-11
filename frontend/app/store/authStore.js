import { create } from "zustand";
import axios from "axios";

const API_URL = "https://tvmstd.onrender.com/api/admin";
    

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  role:null,

  // signup: async (email, password, name) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axios.post(`${API_URL}/signup`, {
  //       email,
  //       password,
  //       name,
  //     });
  //     set({ user: response.data.user, isAuthenticated: true, isLoading: false });
  //   } catch (error) {
  //     set({
  //       error: error.response.data.message || "Error signing up",
  //       isLoading: false,
  //     });
  //     throw error;
  //   }
  // },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { _id, name, email: userEmail,role} = response.data.user;
      localStorage.setItem("user", JSON.stringify({ id:_id, name, email: userEmail,role}));
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
        role:response.data.user.role
      });
	  
	  
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      localStorage.removeItem("user");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // verifyEmail: async (code) => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await axios.post(`${API_URL}/verify-email`, { code });
  //     set({ user: response.data.user, isAuthenticated: true, isLoading: false });
  //     const { _id, name, email: userEmail,role} = response.data.user;
  //     localStorage.setItem("user", JSON.stringify({ id:_id, name, email: userEmail,role}));
  //     return response.data;
  //   } catch (error) {
  //     set({
  //       error: error.response.data.message || "Error verifying email",
  //       isLoading: false,
  //     });
  //     throw error;
  //   }
  // },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      console.log("before")
      const response = await axios.post(`https://tvmstd.onrender.com/api/admin/forgot-password`, { email });
      console.log("after sent")
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`https://tvmstd.onrender.com/api/admin/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
