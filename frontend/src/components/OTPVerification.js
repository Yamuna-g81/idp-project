import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { otpService } from "../utils/otpService";
import { userService } from "../utils/userService";
import EmailNotification from "./EmailNotification";
import "../styles/Login.css";

function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [currentOTP, setCurrentOTP] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get stored user data and email
    const storedUserData = JSON.parse(localStorage.getItem("pendingRegistration"));
    const storedEmail = JSON.parse(localStorage.getItem("registrationEmail"));
    
    if (storedUserData && storedEmail) {
      setUserData(storedUserData);
      setEmail(storedEmail);
      
      // Get current OTP from storage
      const otpData = otpService.getStoredOTP();
      if (otpData && otpData.email === storedEmail) {
        setCurrentOTP(otpData.otp);
        setShowEmailNotification(true);
      }
    } else {
      navigate("/register");
    }

    // Timer for OTP expiry
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Handle close email notification
    const handleCloseNotification = () => {
      setShowEmailNotification(false);
    };
    window.addEventListener('closeEmailNotification', handleCloseNotification);

    return () => {
      clearInterval(timer);
      window.removeEventListener('closeEmailNotification', handleCloseNotification);
    };
  }, [navigate]);

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pastedData.split("").map((char, index) => 
      index < 6 ? char : otp[index]
    );
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const result = otpService.verifyOTP(email, otpString);
      
      if (result.success) {
        // OTP verified, complete registration
        if (userData) {
          try {
            // Add user to the user database
            userService.addUser(userData);
            localStorage.removeItem("pendingRegistration");
            localStorage.removeItem("registrationEmail");
            
            alert("Registration successful! Please login with your credentials.");
            navigate("/");
          } catch (error) {
            alert(error.message);
          }
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend && timeLeft > 0) return;

    setIsLoading(true);

    try {
      const newOTP = otpService.generateOTP();
      otpService.storeOTP(email, newOTP);
      await otpService.sendOTPToEmail(email, newOTP);
      
      // Update current OTP and show notification
      setCurrentOTP(newOTP);
      setShowEmailNotification(true);
      
      // Reset timer
      setTimeLeft(300);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      
      alert("New OTP sent to your email");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getDemoOTP = () => {
    return currentOTP || "Check your email";
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Verify Email</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "1.5rem" }}>
          We've sent a 6-digit OTP to your email:<br/>
          <strong>{email}</strong>
        </p>

        {/* Email notification */}
        <div style={{ 
          background: "#f0f8ff", 
          padding: "1rem", 
          borderRadius: "8px", 
          marginBottom: "1.5rem",
          textAlign: "center",
          border: "1px solid #4CAF50"
        }}>
          <small style={{ color: "#666" }}>
            <strong>✅ Email Sent!</strong> Check your inbox for the OTP.
          </small>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="otp-input"
                style={{
                  width: "45px",
                  height: "45px",
                  textAlign: "center",
                  fontSize: "1.2rem",
                  border: "2px solid #e1e1e1",
                  borderRadius: "8px",
                  fontWeight: "bold"
                }}
                required
              />
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            {timeLeft > 0 ? (
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                OTP expires in <strong>{formatTime(timeLeft)}</strong>
              </p>
            ) : (
              <p style={{ color: "#f44336", fontSize: "0.9rem" }}>
                OTP has expired
              </p>
            )}
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "Verifying..." : "VERIFY OTP"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Didn't receive the OTP?
          </p>
          <button
            onClick={handleResendOTP}
            disabled={!canResend && timeLeft > 0}
            style={{
              background: canResend || timeLeft === 0 ? "#4CAF50" : "#ccc",
              color: "white",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              cursor: canResend || timeLeft === 0 ? "pointer" : "not-allowed"
            }}
          >
            {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : "Resend OTP"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a href="#" onClick={() => navigate("/register")} style={{ color: "#667eea", textDecoration: "none" }}>
            ← Back to Registration
          </a>
        </div>
      </div>
      
      {/* Email Notification Popup */}
      <EmailNotification 
        email={email} 
        otp={currentOTP} 
        show={showEmailNotification} 
      />
    </div>
  );
}

export default OTPVerification;
