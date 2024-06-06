import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      setAuth({ token, user });
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:8000/api/auth/login", {
      email,
      password,
    });
    const { token } = response.data;
    setAuth({ token, user: email });
    localStorage.setItem("token", token);
    localStorage.setItem("user", email);
  };

  const signup = async (email, password) => {
    const response = await axios.post("http://localhost:8000/api/auth/signup", {
      email,
      password,
    });
    const { token } = response.data;
    setAuth({ token, user: email });
    localStorage.setItem("token", token);
    localStorage.setItem("user", email);
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ auth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
