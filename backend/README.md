# Student Management System - Backend

## Overview
This is the backend API server for the Student Management System, built with Node.js, Express, and MongoDB.

## Features
- User registration and authentication
- OTP-based email verification
- JWT token-based authorization
- Resume management
- Profile management
- Rate limiting for security

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and update with your actual values:
```env
MONGODB_URI=mongodb://localhost:27017/student-management
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/send-otp` - Send OTP to email
- `POST /api/verify-otp` - Verify OTP
- `POST /api/login` - User login

### Protected Routes (Require JWT Token)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `POST /api/resume` - Save/update resume
- `GET /api/resume` - Get user resume

## Request/Response Examples

### Register User
```javascript
POST /api/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "studentId": "231FA04G81",
  "password": "password123",
  "confirmPassword": "password123",
  "phone": "1234567890",
  "dateOfBirth": "2000-01-01",
  "gender": "Male",
  "address": "123 Main St, City, State",
  "department": "Computer Science"
}
```

### Login
```javascript
POST /api/login
{
  "username": "john.doe@email.com", // or studentId
  "password": "password123"
}
```

### Save Resume
```javascript
POST /api/resume
Headers: Authorization: Bearer <jwt-token>
{
  "objective": "Seeking internship...",
  "education": {
    "degree": "B.Tech",
    "department": "Computer Science",
    "university": "University Name",
    "cgpa": "8.5",
    "startDate": "2022",
    "endDate": "2026"
  },
  "skills": ["Java, Python, JavaScript"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "year": "2024"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"]
}
```

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation
- OTP expiration (5 minutes)
- Maximum OTP attempts (3)

## Database Schema

### User
- studentId (unique, required)
- name (required)
- email (unique, required)
- phone (required)
- password (hashed, required)
- dateOfBirth, gender, address, department
- semester, cgpa, status
- registeredAt (timestamp)

### Resume
- userId (references User)
- content (nested object with resume sections)
- updatedAt (timestamp)

### OTP
- email (required)
- otp (required)
- expiresAt (timestamp)
- attempts (counter)
- createdAt (timestamp)

## Error Handling
All endpoints return consistent error responses:
```javascript
{
  "message": "Error description",
  "error": "Detailed error info" // optional
}
```

## Development Notes
- Uses nodemailer for email sending (Gmail SMTP)
- MongoDB with Mongoose ODM
- CORS enabled for frontend integration
- Environment variables for sensitive data
