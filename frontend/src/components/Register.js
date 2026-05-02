import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { otpService } from "../utils/otpService";
import { userService } from "../utils/userService";
import "../styles/Login.css";

function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    department: "Computer Science"
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.firstName || !form.lastName || !form.email || !form.studentId || 
        !form.password || !form.confirmPassword || !form.phone || !form.dateOfBirth) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Generate and send OTP
      const otp = otpService.generateOTP();
      otpService.storeOTP(form.email, otp);
      await otpService.sendOTPToEmail(form.email, otp);

      // Store user data temporarily until OTP verification
      const userData = {
        ...form,
        name: `${form.firstName} ${form.lastName}`,
        enrollmentNo: form.studentId,
        registeredAt: new Date().toISOString(),
        semester: "1st Semester", // Default for new students
        cgpa: "0.0", // Default for new students
        status: "Active"
      };

      // Store pending registration data
      localStorage.setItem("pendingRegistration", JSON.stringify(userData));
      localStorage.setItem("registrationEmail", JSON.stringify(form.email));

      // Navigate to OTP verification
      navigate("/verify-otp");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: "500px" }}>
        <h1 className="login-title">Student Registration</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="login-input"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="login-input"
              required
            />
          </div>

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

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="login-input"
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="login-input"
              required
            />
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              className="login-input"
              required
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="login-input"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="login-input"
            required
          />

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "SENDING OTP..." : "REGISTER"}
          </button>
        </form>

        <p className="register-link">
          Already have an account? <a href="#" onClick={handleBackToLogin}>Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
