import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import OTPVerification from './components/OTPVerification';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import StudentProfile from './components/StudentProfile';
import Resume from './components/Resume';
import AcademicRequirements from './components/AcademicRequirements';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/requirements" element={<AcademicRequirements />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
