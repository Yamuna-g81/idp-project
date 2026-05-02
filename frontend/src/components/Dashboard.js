import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    attendancePercentage: 85,
    totalSubjects: 6,
    upcomingEvents: 3,
    pendingAssignments: 2,
    earnedCredits: 85,
    totalCredits: 160,
    feeStatus: 'pending',
    nextDueDate: '2024-03-31'
  });

  useEffect(() => {
    // Get current user from localStorage
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

  const quickActions = [
    {
      title: "Update Profile",
      description: "Edit your personal information",
      icon: "",
      link: "/profile"
    },
    {
      title: "View Attendance",
      description: "Check your attendance records",
      icon: "",
      link: "/attendance"
    },
    {
      title: "Download Resume",
      description: "Get your resume in PDF format",
      icon: "",
      link: "/resume"
    },
    {
      title: "Academic Calendar",
      description: "View important dates and events",
      icon: "",
      link: "/calendar"
    }
  ];

  const upcomingEvents = [
    {
      title: "Mid-Term Exams",
      date: "2024-03-15",
      type: "exam"
    },
    {
      title: "Project Submission",
      date: "2024-03-20",
      type: "assignment"
    },
    {
      title: "Guest Lecture",
      date: "2024-03-22",
      type: "event"
    }
  ];

  const recentActivities = [
    {
      action: "Profile Updated",
      date: "2024-03-10 14:30",
      icon: ""
    },
    {
      action: "Resume Downloaded",
      date: "2024-03-10 12:15",
      icon: ""
    },
    {
      action: "Attendance Marked",
      date: "2024-03-09 10:00",
      icon: ""
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Dashboard</h1>
          {currentUser && (
            <div className="user-info">
              <span className="welcome-text">Welcome, {currentUser.name}</span>
              <span className="user-id">{currentUser.studentId}</span>
            </div>
          )}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <h3>Menu</h3>
          <Link to="/dashboard" className="sidebar-link active">Dashboard</Link>
          <Link to="/attendance" className="sidebar-link">Attendance</Link>
          <Link to="/profile" className="sidebar-link">Student Profile</Link>
          <Link to="/resume" className="sidebar-link">Resume</Link>
          <Link to="/requirements" className="sidebar-link">Academic Requirements</Link>
        </div>

        <div className="main-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card attendance">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>{stats.attendancePercentage}%</h3>
                <p>Attendance Rate</p>
              </div>
            </div>
            <div className="stat-card subjects">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <h3>{stats.totalSubjects}</h3>
                <p>Total Subjects</p>
              </div>
            </div>
            <div className="stat-card events">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{stats.upcomingEvents}</h3>
                <p>Upcoming Events</p>
              </div>
            </div>
            <div className="stat-card assignments">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3>{stats.pendingAssignments}</h3>
                <p>Pending Tasks</p>
              </div>
            </div>
          </div>

          {/* Academic Requirements Summary */}
          <div className="dashboard-section academic-summary">
            <h2>Academic Requirements Overview</h2>
            <div className="academic-grid">
              <div className="academic-card credits">
                <div className="academic-header">
                  <div className="academic-icon">🎓</div>
                  <h3>Credits Progress</h3>
                </div>
                <div className="academic-content">
                  <div className="credit-stats">
                    <div className="credit-item">
                      <span className="credit-label">Earned</span>
                      <span className="credit-value">{stats.earnedCredits}</span>
                    </div>
                    <div className="credit-item">
                      <span className="credit-label">Total</span>
                      <span className="credit-value">{stats.totalCredits}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(stats.earnedCredits / stats.totalCredits) * 100}%` }}
                    ></div>
                  </div>
                  <div className="progress-percentage">
                    {Math.round((stats.earnedCredits / stats.totalCredits) * 100)}% Complete
                  </div>
                </div>
                <Link to="/requirements" className="academic-link">View Details →</Link>
              </div>

              <div className="academic-card fees">
                <div className="academic-header">
                  <div className="academic-icon">💰</div>
                  <h3>Fee Status</h3>
                </div>
                <div className="academic-content">
                  <div className="fee-stats">
                    <div className="fee-item">
                      <span className="fee-label">Next Due</span>
                      <span className="fee-value">{stats.nextDueDate}</span>
                    </div>
                    <div className="fee-item">
                      <span className="fee-label">Status</span>
                      <span className={`fee-status ${stats.feeStatus}`}>
                        {stats.feeStatus === 'pending' ? '⏳ Pending' : '✅ Paid'}
                      </span>
                    </div>
                  </div>
                  <div className="fee-reminder">
                    {stats.feeStatus === 'pending' && (
                      <div className="reminder-alert">
                        <span>⚠️</span>
                        <span>Payment due soon</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link to="/requirements" className="academic-link">Manage Fees →</Link>
              </div>

              <div className="academic-card courses">
                <div className="academic-header">
                  <div className="academic-icon">📖</div>
                  <h3>Course Requirements</h3>
                </div>
                <div className="academic-content">
                  <div className="course-requirements">
                    <div className="requirement-item">
                      <span className="req-label">Core Courses</span>
                      <span className="req-progress">12/15</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-label">Electives</span>
                      <span className="req-progress">4/8</span>
                    </div>
                    <div className="requirement-item">
                      <span className="req-label">Projects</span>
                      <span className="req-progress">2/3</span>
                    </div>
                  </div>
                  <div className="overall-progress">
                    <span>Overall Progress: 65%</span>
                    <div className="progress-bar small">
                      <div className="progress-fill" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>
                <Link to="/requirements" className="academic-link">Track Progress →</Link>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link} className="quick-action-card">
                  <div className="action-icon">{action.icon}</div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboard-row">
            {/* Upcoming Events */}
            <div className="dashboard-section upcoming-events">
              <h2>Upcoming Events</h2>
              <div className="events-list">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className={`event-item ${event.type}`}>
                    <div className="event-content">
                      <h4>{event.title}</h4>
                      <p>{event.date}</p>
                    </div>
                    <div className="event-type">
                      {event.type === 'exam' && ''}
                      {event.type === 'assignment' && ''}
                      {event.type === 'event' && ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="dashboard-section recent-activities">
              <h2>Recent Activities</h2>
              <div className="activities-list">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">{activity.icon}</div>
                    <div className="activity-content">
                      <h4>{activity.action}</h4>
                      <p>{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Department Info */}
          {currentUser && (
            <div className="dashboard-section department-info">
              <h2>Academic Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Department:</span>
                  <span className="info-value">{currentUser.department || 'Computer Science'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Semester:</span>
                  <span className="info-value">{currentUser.semester || '1st Semester'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">CGPA:</span>
                  <span className="info-value">{currentUser.cgpa || '8.5'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value status-active">{currentUser.status || 'Active'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;