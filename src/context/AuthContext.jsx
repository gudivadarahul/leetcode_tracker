// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        try {
          const { jwtDecode } = await import("jwt-decode");
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setAuth({ token: null, user: null });
            toast.error("Session expired, please log in again.");
          } else {
            setAuth({ token, user });
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          toast.error("Error decoding token. Please log in again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setAuth({ token: null, user: null });
        }
      }
    };

    checkToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        { email, password }
      );
      const { token } = response.data;
      setAuth({ token, user: email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", email);
      toast.success("Logged in successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        { email, password }
      );
      const { token } = response.data;
      setAuth({ token, user: email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", email);
      toast.success("Signed up successfully!");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out.");
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, AuthContext, useAuth };
