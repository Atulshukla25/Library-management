"use client";

import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const useAuthStore = create((set) => ({
  departments: [],
  loading: false,
  serverError: "",
  user: null,
  books: [],

  fetchDepartments: async () => {
    try {
      const response = await axios.get("/api/departments");
      set({ departments: response.data });
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  },

  signupWithCredential: async (data, router) => {
    set({ loading: true });
    try {
      await axios.post("/api/auth/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Signup Successfully");
      router.push("/login");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Email already exists. Please use a different email.");
      } else {
        set({ serverError: "Failed to sign up. Please try again." });
      }
    } finally {
      set({ loading: false });
    }
  },
  loginWithCredential: async (data, router) => {
    set({ loading: true });
    try {
      const res = await axios.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        Cookies.set("token", res.data.token);
        Cookies.set("userId", res.data.userId);
        router.push("/dashboard");
        toast.success("Login successful");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid Credentials");
      } else {
        toast.error("Something want Wrong!");
      }
    } finally {
      set({ loading: false });
    }
  },

  logout: async (router) => {
    try {
      const res = await axios.get("/api/auth/logout", {
        withCredentials: true,
      });
      if (res.status === 200) {
        Cookies.remove("token");
        Cookies.remove("userId");
        router.push("/login");
      } else {
        console.error("Logout failed:", res.data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  fetchBooks: async () => {
    try {
      const response = await axios.get(`/api/books`);
      set({ books: response.data });
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  },
  fetchStudents: async (userId) => {
    try {
      const response = await axios.get(`/api/students/${userId}`);
      set({ user: response.data });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  },

  handleOAuth: async (provider) => {
    const providers = {
      google: "/api/auth/google",
      github: "http://localhost:3000/api/auth/github",
      facebook: "http://localhost:3000/api/auth/facebook",
    };
    try {
      window.location.href = providers[provider];
    } catch (error) {
      console.error("Login failed", error);
    }
  },
}));

export default useAuthStore;
