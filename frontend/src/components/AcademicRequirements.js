import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Pages.css";

function AcademicRequirements() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("credits");
  
  // Credit Management State
  const [credits, setCredits] = useState({
    totalCredits: 160,
    earnedCredits: 85,
    currentSemesterCredits: 24,
    completedCourses: 18,
    remainingCredits: 75
  });

  // Fee Management State
  const [fees, setFees] = useState({
    totalFee: 85000,
    paidAmount: 68000,
    pendingAmount: 17000,
    lastPaymentDate: "2024-02-15",
    nextDueDate: "2024-03-31",
    paymentHistory: [
      { date: "2024-02-15", amount: 25000, type: "Semester Fee", status: "Completed" },
      { date: "2024-01-10", amount: 20000, type: "Tuition Fee", status: "Completed" },
      { date: "2023-12-05", amount: 23000, type: "Hostel Fee", status: "Completed" }
    ]
  });

  
  // Course Requirements State
  const [requirements, setRequirements] = useState({
    coreCourses: { completed: 12, total: 15, credits: 36 },
    electives: { completed: 4, total: 8, credits: 12 },
    labs: { completed: 6, total: 8, credits: 12 },
    projects: { completed: 2, total: 3, credits: 6 },
    seminars: { completed: 1, total: 2, credits: 2 }
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  
  const courseList = [
    { code: "CS201", name: "Data Structures", credits: 4, status: "completed", grade: "A" },
    { code: "CS202", name: "Algorithms", credits: 4, status: "completed", grade: "B+" },
    { code: "CS203", name: "Database Systems", credits: 3, status: "in-progress", grade: "-" },
    { code: "CS204", name: "Web Development", credits: 3, status: "in-progress", grade: "-" },
    { code: "CS205", name: "Machine Learning", credits: 4, status: "pending", grade: "-" },
    { code: "CS206", name: "Cloud Computing", credits: 3, status: "pending", grade: "-" }
  ];

  const feeBreakdown = [
    { type: "Tuition Fee", amount: 45000, paid: true },
    { type: "Hostel Fee", amount: 23000, paid: true },
    { type: "Library Fee", amount: 5000, paid: false },
    { type: "Lab Fee", amount: 8000, paid: false },
    { type: "Exam Fee", amount: 4000, paid: false }
  ];

  return (
    <React.Fragment>
      <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Academic Requirements</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <h3>Menu</h3>
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
          <Link to="/attendance" className="sidebar-link">Attendance</Link>
          <Link to="/profile" className="sidebar-link">Student Profile</Link>
          <Link to="/resume" className="sidebar-link">Resume</Link>
          <Link to="/requirements" className="sidebar-link active">Academic Requirements</Link>
        </div>

        <div className="main-content">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === "credits" ? "active" : ""}`}
              onClick={() => setActiveTab("credits")}
            >
              📊 Credit Management
            </button>
            <button 
              className={`tab-button ${activeTab === "fees" ? "active" : ""}`}
              onClick={() => setActiveTab("fees")}
            >
              💰 Fee Management
            </button>
            <button 
              className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => setActiveTab("courses")}
            >
              📚 Course Requirements
            </button>
          </div>

          {/* Credits Tab */}
          {activeTab === "credits" && (
            <div className="requirements-content">
              <div className="credits-overview">
                <h2>Credit Overview</h2>
                <div className="credits-grid">
                  <div className="credit-card total">
                    <h3>{credits.totalCredits}</h3>
                    <p>Total Credits Required</p>
                  </div>
                  <div className="credit-card earned">
                    <h3>{credits.earnedCredits}</h3>
                    <p>Credits Earned</p>
                  </div>
                  <div className="credit-card remaining">
                    <h3>{credits.remainingCredits}</h3>
                    <p>Credits Remaining</p>
                  </div>
                  <div className="credit-card current">
                    <h3>{credits.currentSemesterCredits}</h3>
                    <p>Current Semester</p>
                  </div>
                </div>
              </div>

              <div className="credit-progress">
                <h3>Progress Overview</h3>
                <div className="progress-item">
                  <span>Overall Progress</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(credits.earnedCredits / credits.totalCredits) * 100}%` }}
                    ></div>
                  </div>
                  <span>{Math.round((credits.earnedCredits / credits.totalCredits) * 100)}%</span>
                </div>
              </div>

              <div className="course-list-section">
                <h3>Course Credits</h3>
                <div className="course-grid">
                  {courseList.map((course, index) => (
                    <div key={index} className={`course-card ${course.status}`}>
                      <div className="course-header">
                        <span className="course-code">{course.code}</span>
                        <span className={`status-badge ${course.status}`}>
                          {course.status === "completed" ? "✅" : course.status === "in-progress" ? "🔄" : "⏳"}
                          {course.status}
                        </span>
                      </div>
                      <h4 className="course-name">{course.name}</h4>
                      <div className="course-details">
                        <span className="credits">{course.credits} credits</span>
                        <span className="grade">Grade: {course.grade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === "fees" && (
            <div className="requirements-content">
              <div className="fees-overview">
                <h2>Fee Overview</h2>
                <div className="fees-grid">
                  <div className="fee-card total">
                    <h3>₹{fees.totalFee.toLocaleString()}</h3>
                    <p>Total Annual Fee</p>
                  </div>
                  <div className="fee-card paid">
                    <h3>₹{fees.paidAmount.toLocaleString()}</h3>
                    <p>Amount Paid</p>
                  </div>
                  <div className="fee-card pending">
                    <h3>₹{fees.pendingAmount.toLocaleString()}</h3>
                    <p>Amount Pending</p>
                  </div>
                  <div className="fee-card due">
                    <h3>{fees.nextDueDate}</h3>
                    <p>Next Due Date</p>
                  </div>
                </div>
              </div>

              <div className="fee-breakdown">
                <h3>Fee Breakdown</h3>
                <div className="breakdown-list">
                  {feeBreakdown.map((fee, index) => (
                    <div key={index} className={`fee-item ${fee.paid ? "paid" : "pending"}`}>
                      <div className="fee-info">
                        <h4>{fee.type}</h4>
                        <span>₹{fee.amount.toLocaleString()}</span>
                      </div>
                      <div className={`fee-status ${fee.paid ? "paid" : "pending"}`}>
                        {fee.paid ? "✅ Paid" : "⏳ Pending"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="payment-history">
                <h3>Payment History</h3>
                <div className="history-list">
                  {fees.paymentHistory.map((payment, index) => (
                    <div key={index} className="payment-item">
                      <div className="payment-info">
                        <h4>{payment.type}</h4>
                        <span className="payment-date">{payment.date}</span>
                      </div>
                      <div className="payment-amount">
                        ₹{payment.amount.toLocaleString()}
                      </div>
                      <div className="payment-status completed">
                        {payment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                          </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="requirements-content">
              <div className="requirements-overview">
                <h2>Course Requirements</h2>
                <div className="requirements-grid">
                  <div className="requirement-card">
                    <h3>Core Courses</h3>
                    <div className="requirement-progress">
                      <span>{requirements.coreCourses.completed}/{requirements.coreCourses.total}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(requirements.coreCourses.completed / requirements.coreCourses.total) * 100}%` }}
                        ></div>
                      </div>
                      <span>{requirements.coreCourses.credits} credits</span>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <h3>Electives</h3>
                    <div className="requirement-progress">
                      <span>{requirements.electives.completed}/{requirements.electives.total}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(requirements.electives.completed / requirements.electives.total) * 100}%` }}
                        ></div>
                      </div>
                      <span>{requirements.electives.credits} credits</span>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <h3>Laboratory Courses</h3>
                    <div className="requirement-progress">
                      <span>{requirements.labs.completed}/{requirements.labs.total}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(requirements.labs.completed / requirements.labs.total) * 100}%` }}
                        ></div>
                      </div>
                      <span>{requirements.labs.credits} credits</span>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <h3>Projects</h3>
                    <div className="requirement-progress">
                      <span>{requirements.projects.completed}/{requirements.projects.total}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(requirements.projects.completed / requirements.projects.total) * 100}%` }}
                        ></div>
                      </div>
                      <span>{requirements.projects.credits} credits</span>
                    </div>
                  </div>
                  <div className="requirement-card">
                    <h3>Seminars</h3>
                    <div className="requirement-progress">
                      <span>{requirements.seminars.completed}/{requirements.seminars.total}</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(requirements.seminars.completed / requirements.seminars.total) * 100}%` }}
                        ></div>
                      </div>
                      <span>{requirements.seminars.credits} credits</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="graduation-requirements">
                <h3>Graduation Requirements</h3>
                <div className="requirements-checklist">
                  <div className="checklist-item">
                    <span className="check-icon">✅</span>
                    <span>Minimum 160 credits completed</span>
                  </div>
                  <div className="checklist-item">
                    <span className="check-icon">✅</span>
                    <span>All core courses completed</span>
                  </div>
                  <div className="checklist-item">
                    <span className="check-icon">⏳</span>
                    <span>Minimum 6 elective courses (4 completed)</span>
                  </div>
                  <div className="checklist-item">
                    <span className="check-icon">✅</span>
                    <span>Minimum CGPA of 6.0 maintained</span>
                  </div>
                  <div className="checklist-item">
                    <span className="check-icon">⏳</span>
                    <span>2 major projects completed (1 pending)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}

export default AcademicRequirements;
