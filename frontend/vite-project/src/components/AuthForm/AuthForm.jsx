import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

const AuthForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login functionality
        const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
        localStorage.setItem("token", response.data.token);
        navigate("/categories");
      } else {
        // Sign-up functionality
        await axios.post("http://127.0.0.1:8000/api/signup/", formData);
        alert("Account created successfully");
      }
    } catch (error) {
      alert(isLogin ? "Invalid credentials" : "Error creating account");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <div className="toggle-section">
        <button onClick={() => setIsLogin(!isLogin)} className="toggle-button">
          {isLogin ? "Switch to Sign Up" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
