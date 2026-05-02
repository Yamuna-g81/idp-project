import React, { useState, useEffect } from "react";
import { emailService } from "../utils/emailService";

function EmailNotification({ email, otp, show }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [emailContent, setEmailContent] = useState(null);

  useEffect(() => {
    if (show && email && otp) {
      // Get the last sent email
      const lastEmail = emailService.getLastSentEmail();
      if (lastEmail && lastEmail.to === email) {
        setEmailContent(lastEmail);
      }
    }
  }, [email, otp, show]);

  if (!show || !emailContent) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "350px",
      backgroundColor: "white",
      border: "2px solid #4CAF50",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      zIndex: 1000,
      overflow: "hidden",
      animation: "slideIn 0.5s ease-out"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
        color: "white",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>📧</span>
          <div>
            <h4 style={{ margin: "0", fontSize: "14px", fontWeight: "600" }}>Email Sent!</h4>
            <p style={{ margin: "0", fontSize: "12px", opacity: "0.9" }}>Check your inbox</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            borderRadius: "50%",
            width: "25px",
            height: "25px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "15px" }}>
        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>To:</p>
          <p style={{ margin: "0", fontSize: "14px", fontWeight: "600", color: "#333" }}>{email}</p>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>Subject:</p>
          <p style={{ margin: "0", fontSize: "14px", color: "#333" }}>{emailContent.subject}</p>
        </div>

        <div style={{
          background: "#f8f9fa",
          border: "1px dashed #4CAF50",
          padding: "15px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "10px"
        }}>
          <p style={{ margin: "0", fontSize: "12px", color: "#666", marginBottom: "5px" }}>Your OTP code is:</p>
          <h2 style={{ margin: "0", color: "#4CAF50", fontSize: "24px", letterSpacing: "3px", fontWeight: "bold" }}>{otp}</h2>
        </div>

        {isExpanded && (
          <div style={{
            marginTop: "10px",
            padding: "10px",
            background: "#f8f9fa",
            borderRadius: "5px",
            fontSize: "11px",
            color: "#666",
            maxHeight: "150px",
            overflow: "auto"
          }}>
            <p style={{ margin: "0 0 5px 0", fontWeight: "600" }}>Email Preview:</p>
            <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.4" }}>
              {emailContent.body ? emailContent.body.substring(0, 200) + "..." : "Email content loading..."}
            </div>
          </div>
        )}

        <div style={{
          marginTop: "10px",
          fontSize: "11px",
          color: "#999",
          textAlign: "center"
        }}>
          Sent at {new Date(emailContent.sentAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Close button */}
      <div style={{ padding: "0 15px 15px" }}>
        <button
          onClick={() => {
            // This would be handled by parent component
            const event = new CustomEvent('closeEmailNotification');
            window.dispatchEvent(event);
          }}
          style={{
            width: "100%",
            padding: "8px",
            background: "#f8f9fa",
            border: "1px solid #ddd",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#666"
          }}
        >
          Close
        </button>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default EmailNotification;
