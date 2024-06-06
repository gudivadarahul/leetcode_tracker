// src/components/Auth.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(email, password);
    }
    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert("Authentication failed: " + error.response.data.message);
  }
};
;

  return (
    <div>
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </button>
    </div>
  );
};

export default Auth;
