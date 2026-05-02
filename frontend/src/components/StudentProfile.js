import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../utils/userService";
import "../styles/Pages.css";

function StudentProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Load current user data from localStorage or use defaults
  const getInitialStudentData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (currentUser) {
      return {
        name: currentUser.name || "John Doe",
        enrollmentNo: currentUser.studentId || currentUser.enrollmentNo || "STU2024001",
        email: currentUser.email || "john.doe@student.com",
        phone: currentUser.phone || "9876543210",
        dateOfBirth: currentUser.dateOfBirth || "2005-03-15",
        gender: currentUser.gender || "Male",
        address: currentUser.address || "123 Main Street, City, State - 123456",
        department: currentUser.department || "Computer Science",
        semester: currentUser.semester || "4th Semester",
        cgpa: currentUser.cgpa || "8.5",
        status: "Active",
      };
    }
    
    // Default data if no current user found (shouldn't happen with proper login flow)
    return {
      name: "John Doe",
      enrollmentNo: "STU2024001",
      email: "john.doe@student.com",
      phone: "9876543210",
      dateOfBirth: "2005-03-15",
      gender: "Male",
      address: "123 Main Street, City, State - 123456",
      department: "Computer Science",
      semester: "4th Semester",
      cgpa: "8.5",
      status: "Active",
    };
  };
  
  const [studentData, setStudentData] = useState(getInitialStudentData());

  const [formData, setFormData] = useState(studentData);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleEdit = () => {
    setFormData(studentData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(studentData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setStudentData(formData);
    // Update user in the database
    try {
      userService.updateUser(formData);
      localStorage.setItem("currentUser", JSON.stringify(formData));
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <h3>Menu</h3>
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
          <Link to="/attendance" className="sidebar-link">Attendance</Link>
          <Link to="/profile" className="sidebar-link active">Student Profile</Link>
          <Link to="/resume" className="sidebar-link">Resume</Link>
          <Link to="/requirements" className="sidebar-link">Academic Requirements</Link>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h2>Student Profile</h2>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="action-button edit" onClick={handleEdit}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <>
                  <button className="action-button save" onClick={handleSave}>
                    💾 Save Changes
                  </button>
                  <button className="action-button cancel" onClick={handleCancel}>
                    ❌ Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="profile-container">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{studentData.name}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Enrollment No</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="enrollmentNo"
                      value={formData.enrollmentNo}
                      onChange={handleChange}
                      className="profile-input"
                      disabled
                    />
                  ) : (
                    <p>{studentData.enrollmentNo}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{studentData.email}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{studentData.phone}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="profile-input"
                    />
                  ) : (
                    <p>{studentData.dateOfBirth}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Gender</label>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="profile-input"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p>{studentData.gender}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Academic Information</h3>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Department</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="profile-input"
                      disabled
                    />
                  ) : (
                    <p>{studentData.department}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Current Semester</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="semester"
                      value={formData.semester}
                      onChange={handleChange}
                      className="profile-input"
                      disabled
                    />
                  ) : (
                    <p>{studentData.semester}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>CGPA</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleChange}
                      className="profile-input"
                      disabled
                    />
                  ) : (
                    <p>{studentData.cgpa}</p>
                  )}
                </div>
                <div className="profile-field">
                  <label>Status</label>
                  <p>
                    <span className="status-badge active">{studentData.status}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Address</h3>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="profile-textarea"
                  rows="4"
                />
              ) : (
                <p>{studentData.address}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
