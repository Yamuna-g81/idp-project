import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Pages.css";

function Attendance() {
  const navigate = useNavigate();
  const [attendanceData] = useState([
    { date: "2024-04-20", status: "Present", subject: "Mathematics" },
    { date: "2024-04-19", status: "Present", subject: "Mathematics" },
    { date: "2024-04-18", status: "Present", subject: "Mathematics" },
    { date: "2024-04-17", status: "Absent", subject: "Mathematics" },
    { date: "2024-04-16", status: "Present", subject: "Physics" },
    { date: "2024-04-15", status: "Present", subject: "Physics" },
    { date: "2024-04-14", status: "Absent", subject: "Physics" },
    { date: "2024-04-13", status: "Present", subject: "Physics" },
    { date: "2024-04-12", status: "Present", subject: "Chemistry" },
    { date: "2024-04-11", status: "Absent", subject: "Chemistry" },
    { date: "2024-04-10", status: "Present", subject: "Chemistry" },
    { date: "2024-04-09", status: "Present", subject: "English" },
    { date: "2024-04-08", status: "Present", subject: "English" },
    { date: "2024-04-07", status: "Present", subject: "History" },
    { date: "2024-04-06", status: "Absent", subject: "History" },
  ]);

  const [expandedSubject, setExpandedSubject] = useState(null);

  // Calculate overall statistics
  const presentCount = attendanceData.filter(
    (record) => record.status === "Present"
  ).length;
  const attendancePercentage = Math.round(
    (presentCount / attendanceData.length) * 100
  );

  // Calculate subject-wise statistics
  const subjectStats = {};
  attendanceData.forEach((record) => {
    if (!subjectStats[record.subject]) {
      subjectStats[record.subject] = {
        total: 0,
        present: 0,
        absent: 0,
        records: [],
      };
    }
    subjectStats[record.subject].total += 1;
    subjectStats[record.subject].records.push(record);
    if (record.status === "Present") {
      subjectStats[record.subject].present += 1;
    } else {
      subjectStats[record.subject].absent += 1;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleSubject = (subject) => {
    setExpandedSubject(expandedSubject === subject ? null : subject);
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
          <Link to="/attendance" className="sidebar-link active">Attendance</Link>
          <Link to="/profile" className="sidebar-link">Student Profile</Link>
          <Link to="/resume" className="sidebar-link">Resume</Link>
          <Link to="/requirements" className="sidebar-link">Academic Requirements</Link>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h2>Attendance</h2>
            <div className="attendance-stats">
              <div className="stat-card">
                <h4>Overall Attendance</h4>
                <p className="stat-value">{attendancePercentage}%</p>
              </div>
              <div className="stat-card">
                <h4>Total Present</h4>
                <p className="stat-value">{presentCount}</p>
              </div>
              <div className="stat-card">
                <h4>Total Absent</h4>
                <p className="stat-value">
                  {attendanceData.length - presentCount}
                </p>
              </div>
            </div>
          </div>

          <div className="subject-wise-section">
            <h3>Subject Wise Attendance</h3>
            <div className="subject-cards">
              {Object.entries(subjectStats).map(([subject, stats]) => {
                const percentage = Math.round(
                  (stats.present / stats.total) * 100
                );
                return (
                  <div key={subject} className="subject-card">
                    <div
                      className="subject-header"
                      onClick={() => toggleSubject(subject)}
                    >
                      <div className="subject-info">
                        <h4>{subject}</h4>
                        <p>
                          {stats.present}/{stats.total} Classes
                        </p>
                      </div>
                      <div className="subject-percentage">
                        <div className="percentage-circle">
                          <span className={percentage >= 75 ? "high" : percentage >= 50 ? "medium" : "low"}>
                            {percentage}%
                          </span>
                        </div>
                        <span className="toggle-icon">
                          {expandedSubject === subject ? "▼" : "▶"}
                        </span>
                      </div>
                    </div>

                    {expandedSubject === subject && (
                      <div className="subject-records">
                        <table className="subject-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.records
                              .sort(
                                (a, b) =>
                                  new Date(b.date) - new Date(a.date)
                              )
                              .map((record, idx) => (
                                <tr key={idx}>
                                  <td>{record.date}</td>
                                  <td>
                                    <span
                                      className={`status-badge ${record.status.toLowerCase()}`}
                                    >
                                      {record.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
