// src/components/Profile.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { auth, logout } = useContext(AuthContext);
  const [email, setEmail] = useState(auth.user);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        "http://localhost:8000/api/auth/update",
        { email, password },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      toast.success("Profile updated successfully.");
      if (email !== auth.user) {
        logout();
        toast.info("Please log in again with your new email.");
      }
    } catch (error) {
      setError("Error updating profile");
      toast.error("Error updating profile.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
