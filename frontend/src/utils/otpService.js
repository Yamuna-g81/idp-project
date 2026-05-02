// OTP Service for email verification
export const otpService = {
  // Generate a 6-digit OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Store OTP with expiry time (5 minutes)
  storeOTP(email, otp) {
    const otpData = {
      email: email,
      otp: otp,
      timestamp: Date.now(),
      expiryTime: Date.now() + (5 * 60 * 1000), // 5 minutes
      attempts: 0,
      maxAttempts: 3
    };
    
    localStorage.setItem("otpData", JSON.stringify(otpData));
    return otpData;
  },

  // Get stored OTP data
  getStoredOTP() {
    const otpData = JSON.parse(localStorage.getItem("otpData"));
    if (!otpData) return null;

    // Check if OTP has expired
    if (Date.now() > otpData.expiryTime) {
      this.clearOTP();
      return null;
    }

    return otpData;
  },

  // Verify OTP
  verifyOTP(email, enteredOTP) {
    const otpData = this.getStoredOTP();
    
    if (!otpData) {
      return { success: false, message: "OTP has expired or not found" };
    }

    if (otpData.email !== email) {
      return { success: false, message: "Invalid email" };
    }

    if (otpData.attempts >= otpData.maxAttempts) {
      this.clearOTP();
      return { success: false, message: "Maximum attempts reached. Please request a new OTP" };
    }

    // Increment attempts
    otpData.attempts++;
    localStorage.setItem("otpData", JSON.stringify(otpData));

    if (otpData.otp === enteredOTP) {
      this.clearOTP();
      return { success: true, message: "OTP verified successfully" };
    } else {
      const remainingAttempts = otpData.maxAttempts - otpData.attempts;
      return { 
        success: false, 
        message: `Invalid OTP. ${remainingAttempts} attempts remaining` 
      };
    }
  },

  // Clear OTP data
  clearOTP() {
    localStorage.removeItem("otpData");
  },

  // Simulate sending OTP to email (in real app, this would call backend API)
  async sendOTPToEmail(email, otp) {
    // Import email service dynamically to avoid circular dependencies
    const { emailService } = await import('./emailService.js');
    
    // Use the email service to send OTP
    return await emailService.sendOTPEmail(email, otp);
  },

  // Get last sent OTP info (for demo purposes)
  getLastSentOTP() {
    return JSON.parse(localStorage.getItem("lastOTPSent"));
  }
};
