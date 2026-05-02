import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../utils/userService";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ username: "", password: "", rememberMe: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // simple validation
    if (form.username && form.password) {
      // Authenticate user using userService
      const authResult = userService.authenticateUser(form.username, form.password);
      
      if (authResult.success) {
        // Set current user data for profile display
        localStorage.setItem("currentUser", JSON.stringify(authResult.user));
        navigate("/dashboard");
      } else {
        alert(authResult.message);
      }
    } else {
      alert("Enter all fields");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Student Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Student ID or Username"
            value={form.username}
            onChange={handleChange}
            className="login-input"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="login-input"
          />

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password
            </a>
          </div>

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>

        <p className="register-link">
          Don't have an account? <a href="#register" onClick={handleRegister}>Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;