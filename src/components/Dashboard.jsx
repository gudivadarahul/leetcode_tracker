// src/components/Dashboard.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {auth.user}</p>
      <nav>
        <Link to="/">Home</Link> | <Link to="/problems">Problems</Link> |{" "}
        <Link to="/profile">Profile</Link>
      </nav>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
