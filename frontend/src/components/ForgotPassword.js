import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function ForgotPassword() {
  const [form, setForm] = useState({ email: "", studentId: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // validation
    if (!form.email || !form.studentId) {
      alert("Please fill all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // In a real app, this would send a reset link to the email
    // For demo purposes, we'll just show success message
    setIsSubmitted(true);
    
    // Store reset request (in real app, this would be handled by backend)
    const resetRequest = {
      email: form.email,
      studentId: form.studentId,
      requestedAt: new Date().toISOString(),
      token: "reset-" + Math.random().toString(36).substr(2, 9)
    };
    
    localStorage.setItem("passwordResetRequest", JSON.stringify(resetRequest));
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleResend = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "4rem", color: "#4CAF50", marginBottom: "1rem" }}>
              ✓
            </div>
            <h1 className="login-title" style={{ marginBottom: "1rem" }}>
              Reset Link Sent!
            </h1>
            <p style={{ color: "#666", marginBottom: "1.5rem", lineHeight: "1.5" }}>
              We've sent a password reset link to your email address:<br/>
              <strong>{form.email}</strong><br/><br/>
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button 
                onClick={handleResend} 
                className="login-button" 
                style={{ backgroundColor: "#2196F3" }}
              >
                Resend Email
              </button>
              <button 
                onClick={handleBackToLogin} 
                className="login-button" 
                style={{ backgroundColor: "#666" }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Forgot Password</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "2rem" }}>
          Enter your email and student ID to reset your password
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="login-input"
            required
          />

          <input
            type="text"
            name="studentId"
            placeholder="Student ID"
            value={form.studentId}
            onChange={handleChange}
            className="login-input"
            required
          />

          <button type="submit" className="login-button">
            SEND RESET LINK
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="#" onClick={handleBackToLogin} style={{ color: "#667eea", textDecoration: "none" }}>
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
