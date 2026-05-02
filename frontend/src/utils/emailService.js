// Email Service Simulation for OTP sending
export const emailService = {
  // Simulate sending OTP email
  async sendOTPEmail(email, otp) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create email content
    const emailContent = {
      to: email,
      from: "noreply@studentmanagement.com",
      subject: "Verify Your Email - Student Management System",
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Student Management System</h1>
            <p style="color: white; margin: 5px 0;">Email Verification</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Verify Your Email Address</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for registering with the Student Management System. 
              To complete your registration, please use the following One-Time Password (OTP):
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
              <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">Your OTP is:</p>
              <h1 style="color: #667eea; font-size: 32px; letter-spacing: 8px; margin: 0; font-weight: bold;">${otp}</h1>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Important:</strong> This OTP will expire in 5 minutes. 
                Please do not share this code with anyone.
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              If you didn't request this verification, please ignore this email or 
              contact our support team.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated message from Student Management System. 
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };
    
    // Store email in sent emails for demo purposes
    const sentEmails = JSON.parse(localStorage.getItem("sentEmails") || "[]");
    sentEmails.push({
      ...emailContent,
      sentAt: new Date().toISOString(),
      otp: otp
    });
    localStorage.setItem("sentEmails", JSON.stringify(sentEmails));
    
    // Log to console for development
    console.log("📧 EMAIL SENT:");
    console.log("To:", email);
    console.log("Subject:", emailContent.subject);
    console.log("OTP:", otp);
    console.log("--- Email Content ---");
    console.log(emailContent.body);
    
    return { 
      success: true, 
      message: "OTP sent successfully to your email",
      emailPreview: {
        to: email,
        subject: emailContent.subject,
        otp: otp,
        sentAt: new Date().toISOString()
      }
    };
  },
  
  // Get sent emails for demo purposes
  getSentEmails() {
    return JSON.parse(localStorage.getItem("sentEmails") || "[]");
  },
  
  // Get last sent email
  getLastSentEmail() {
    const emails = this.getSentEmails();
    return emails[emails.length - 1] || null;
  },
  
  // Clear sent emails
  clearSentEmails() {
    localStorage.removeItem("sentEmails");
  }
};
