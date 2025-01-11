import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/signup/", formData);
      alert("Account created successfully");
    } catch (error) {
      alert("Error creating account");
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input
        type="text"
        placeholder="Username"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
