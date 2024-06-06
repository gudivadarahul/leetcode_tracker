// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProblemsProvider } from "./context/ProblemsContext";
import Home from "./components/Home.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Auth from "./components/Auth.jsx";
import ProblemsPage from "./components/ProblemsPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Profile from "./components/Profile";

function App() {
  return (
    <AuthProvider>
      <ProblemsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/problems"
              element={
                <PrivateRoute>
                  <ProblemsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </ProblemsProvider>
    </AuthProvider>
  );
}

export default App;
