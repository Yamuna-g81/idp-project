import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "../styles/Pages.css";

function Resume() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  
  // Load saved resume content or use defaults
  const getInitialResumeContent = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const savedResume = localStorage.getItem("resumeContent");
      if (savedResume) {
        const resumeData = JSON.parse(savedResume);
        // Check if this resume belongs to the current user
        if (resumeData.userId === (currentUser.studentId || currentUser.email)) {
          return resumeData.content;
        }
      }
    }
    
    // Default content
    return {
      objective: "Seeking an internship opportunity to apply my technical skills and gain practical experience in software development and problem-solving.",
      education: {
        degree: "Bachelor of Technology",
        department: currentUser?.department || "Computer Science",
        university: "University Name",
        cgpa: currentUser?.cgpa || "8.5",
        startDate: "2022",
        endDate: "2026"
      },
      skills: [
        "Languages: Java, Python, JavaScript, C++",
        "Web Development: React, Node.js, MongoDB",
        "Tools: Git, VS Code, IntelliJ IDEA",
        "Databases: MySQL, MongoDB"
      ],
      projects: [
        {
          name: "Student Management System",
          description: "Developed a full-stack web application using React and Node.js for managing student records, attendance, and academic performance.",
          year: "2024"
        }
      ],
      certifications: [
        "JavaScript Fundamentals - Udemy (2023)",
        "React.js Basics - Coursera (2024)"
      ]
    };
  };
  
  const [resumeContent, setResumeContent] = useState(getInitialResumeContent());

  // Ensure proper state initialization
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/");
      return;
    }
    
    // Load saved resume content if it exists
    const savedResume = localStorage.getItem("resumeContent");
    if (savedResume) {
      const resumeData = JSON.parse(savedResume);
      if (resumeData.userId === (currentUser.studentId || currentUser.email)) {
        setResumeContent(resumeData.content);
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleDownload = () => {
    if (uploadedFile) {
      // Download the uploaded resume file
      const url = uploadedFile.url;
      const link = document.createElement("a");
      link.href = url;
      link.download = uploadedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate and download resume as PDF
      generateResumePDF();
    }
  };

  const generateResumePDF = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const studentName = currentUser?.name || "Student";
    const studentEmail = currentUser?.email || "student@email.com";
    const studentPhone = currentUser?.phone || "1234567890";
    const studentDepartment = currentUser?.department || "Computer Science";

    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font sizes and styles
    const titleFontSize = 20;
    const headerFontSize = 14;
    const normalFontSize = 11;
    const smallFontSize = 10;
    
    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    // Helper function to add new page if needed
    const checkPageBreak = (requiredHeight) => {
        if (yPosition + requiredHeight > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPosition = 20;
            return true;
        }
        return false;
    };
    
    // Helper function to add text with word wrap
    const addText = (text, fontSize = normalFontSize, fontStyle = 'normal') => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);
        const lines = doc.splitTextToSize(text, contentWidth);
        const lineHeight = fontSize * 0.35;
        
        checkPageBreak(lines.length * lineHeight);
        
        lines.forEach((line) => {
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
        });
        
        return yPosition;
    };
    
    // Resume Header
    doc.setFontSize(titleFontSize);
    doc.setFont("helvetica", "bold");
    doc.text(studentName, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    
    doc.setFontSize(smallFontSize);
    doc.setFont("helvetica", "normal");
    doc.text(`${studentEmail} | ${studentPhone} | City, State`, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    // Objective Section
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("OBJECTIVE", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(normalFontSize);
    doc.setFont("helvetica", "normal");
    yPosition = addText(resumeContent.objective);
    yPosition += 10;
    
    // Education Section
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("EDUCATION", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(normalFontSize);
    doc.setFont("helvetica", "bold");
    doc.text(`${resumeContent.education.degree} in ${resumeContent.education.department}`, margin, yPosition);
    yPosition += 6;
    
    doc.setFontSize(smallFontSize);
    doc.setFont("helvetica", "italic");
    doc.text(`${resumeContent.education.startDate} - ${resumeContent.education.endDate}`, pageWidth - margin, yPosition, { align: "right" });
    yPosition += 6;
    
    doc.setFontSize(normalFontSize);
    doc.setFont("helvetica", "normal");
    doc.text(`${resumeContent.education.university} | CGPA: ${resumeContent.education.cgpa}`, margin, yPosition);
    yPosition += 15;
    
    // Technical Skills Section
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("TECHNICAL SKILLS", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(normalFontSize);
    doc.setFont("helvetica", "normal");
    resumeContent.skills.forEach((skill) => {
      yPosition = addText(`• ${skill}`);
      yPosition += 3;
    });
    yPosition += 7;
    
    // Projects Section
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("PROJECTS", margin, yPosition);
    yPosition += 8;
    
    resumeContent.projects.forEach((project) => {
      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "bold");
      doc.text(project.name, margin, yPosition);
      yPosition += 6;
      
      doc.setFontSize(smallFontSize);
      doc.setFont("helvetica", "italic");
      doc.text(project.year, pageWidth - margin, yPosition, { align: "right" });
      yPosition += 6;
      
      doc.setFontSize(normalFontSize);
      doc.setFont("helvetica", "normal");
      yPosition = addText(project.description);
      yPosition += 10;
    });
    
    // Certifications Section
    doc.setFontSize(headerFontSize);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATIONS", margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(normalFontSize);
    doc.setFont("helvetica", "normal");
    resumeContent.certifications.forEach((cert) => {
      yPosition = addText(`• ${cert}`);
      yPosition += 3;
    });
    
    // Save the PDF
    const fileName = `${studentName.replace(/\s+/g, '_')}_Resume.pdf`;
    doc.save(fileName);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is PDF or common resume formats
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (allowedTypes.includes(file.type)) {
        // Create URL for the file
        const fileUrl = URL.createObjectURL(file);
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024).toFixed(2), // Convert to KB
          type: file.type,
          uploadedAt: new Date().toLocaleString(),
          url: fileUrl,
        });
        setUploadStatus("success");
        setTimeout(() => setUploadStatus(""), 3000);
      } else {
        setUploadStatus("error");
        setTimeout(() => setUploadStatus(""), 3000);
        alert("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      }
    }
  };

  const handleRemoveFile = () => {
    if (uploadedFile && uploadedFile.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // Save resume content to localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      const resumeData = {
        userId: currentUser.studentId || currentUser.email,
        content: resumeContent,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem("resumeContent", JSON.stringify(resumeData));
    }
    setIsEditing(false);
    alert("Resume updated successfully!");
  };

  const handleContentChange = (section, field, value) => {
    console.log('handleContentChange called:', { section, field, value });
    setResumeContent(prev => {
      if (field === null) {
        // Direct update for simple fields like objective
        return {
          ...prev,
          [section]: value
        };
      } else {
        // Nested object update for education
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        };
      }
    });
  };

  const handleSkillChange = (index, value) => {
    console.log('handleSkillChange called:', { index, value });
    const newSkills = [...resumeContent.skills];
    newSkills[index] = value;
    setResumeContent(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleAddSkill = () => {
    setResumeContent(prev => ({
      ...prev,
      skills: [...prev.skills, ""]
    }));
  };

  const handleRemoveSkill = (index) => {
    const newSkills = resumeContent.skills.filter((_, i) => i !== index);
    setResumeContent(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...resumeContent.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setResumeContent(prev => ({
      ...prev,
      projects: newProjects
    }));
  };

  const handleAddProject = () => {
    setResumeContent(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", year: "" }]
    }));
  };

  const handleRemoveProject = (index) => {
    const newProjects = resumeContent.projects.filter((_, i) => i !== index);
    setResumeContent(prev => ({
      ...prev,
      projects: newProjects
    }));
  };

  const handleCertificationChange = (index, value) => {
    const newCertifications = [...resumeContent.certifications];
    newCertifications[index] = value;
    setResumeContent(prev => ({
      ...prev,
      certifications: newCertifications
    }));
  };

  const handleAddCertification = () => {
    setResumeContent(prev => ({
      ...prev,
      certifications: [...prev.certifications, ""]
    }));
  };

  const handleRemoveCertification = (index) => {
    const newCertifications = resumeContent.certifications.filter((_, i) => i !== index);
    setResumeContent(prev => ({
      ...prev,
      certifications: newCertifications
    }));
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
          <Link to="/profile" className="sidebar-link">Student Profile</Link>
          <Link to="/resume" className="sidebar-link active">Resume</Link>
          <Link to="/requirements" className="sidebar-link">Academic Requirements</Link>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h2>Resume</h2>
            <div className="resume-actions">
              {!isEditing ? (
                <>
                  <button className="action-button download" onClick={handleDownload}>
                    📥 Download Resume
                  </button>
                  <button className="action-button upload" onClick={handleUploadClick}>
                    📤 Upload Resume
                  </button>
                  <button className="action-button edit" onClick={handleEdit}>
                    ✏️ Edit Resume
                  </button>
                </>
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

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {uploadedFile && (
            <div className={`upload-status ${uploadStatus}`}>
              <div className="status-content">
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <h4>{uploadedFile.name}</h4>
                    <p>{uploadedFile.size} KB • {uploadedFile.uploadedAt}</p>
                  </div>
                </div>
                <button
                  className="remove-file-btn"
                  onClick={handleRemoveFile}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
              <div className="success-message">
                ✓ Resume uploaded successfully!
              </div>
            </div>
          )}

          <div className="resume-container">
            {isEditing ? (
              <div className="resume-edit-form">
                {/* Test Input */}
                <div className="edit-section">
                  <h3>Test Input</h3>
                  <input
                    type="text"
                    value={resumeContent.objective}
                    onChange={(e) => {
                      console.log('Test input change:', e.target.value);
                      setResumeContent(prev => ({
                        ...prev,
                        objective: e.target.value
                      }));
                    }}
                    className="resume-input"
                    placeholder="Type here to test..."
                  />
                </div>
                
                <div className="edit-section">
                  <h3>Objective</h3>
                  <textarea
                    value={resumeContent.objective}
                    onChange={(e) => {
                      console.log('Textarea change:', e.target.value);
                      setResumeContent(prev => ({
                        ...prev,
                        objective: e.target.value
                      }));
                    }}
                    className="resume-textarea"
                    rows="3"
                    placeholder="Enter your career objective..."
                  />
                </div>

                <div className="edit-section">
                  <h3>Education</h3>
                  <div className="education-form">
                    <input
                      type="text"
                      value={resumeContent.education.degree}
                      onChange={(e) => {
                        console.log('Degree change:', e.target.value);
                        setResumeContent(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            degree: e.target.value
                          }
                        }));
                      }}
                      className="resume-input"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={resumeContent.education.department}
                      onChange={(e) => {
                        console.log('Department change:', e.target.value);
                        setResumeContent(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            department: e.target.value
                          }
                        }));
                      }}
                      className="resume-input"
                      placeholder="Department"
                    />
                    <input
                      type="text"
                      value={resumeContent.education.university}
                      onChange={(e) => {
                        console.log('University change:', e.target.value);
                        setResumeContent(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            university: e.target.value
                          }
                        }));
                      }}
                      className="resume-input"
                      placeholder="University"
                    />
                    <div className="form-row">
                      <input
                        type="text"
                        value={resumeContent.education.cgpa}
                        onChange={(e) => {
                          console.log('CGPA change:', e.target.value);
                          setResumeContent(prev => ({
                            ...prev,
                            education: {
                              ...prev.education,
                              cgpa: e.target.value
                            }
                          }));
                        }}
                        className="resume-input small"
                        placeholder="CGPA"
                      />
                      <input
                        type="text"
                        value={resumeContent.education.startDate}
                        onChange={(e) => {
                          console.log('Start Year change:', e.target.value);
                          setResumeContent(prev => ({
                            ...prev,
                            education: {
                              ...prev.education,
                              startDate: e.target.value
                            }
                          }));
                        }}
                        className="resume-input small"
                        placeholder="Start Year"
                      />
                      <input
                        type="text"
                        value={resumeContent.education.endDate}
                        onChange={(e) => {
                          console.log('End Year change:', e.target.value);
                          setResumeContent(prev => ({
                            ...prev,
                            education: {
                              ...prev.education,
                              endDate: e.target.value
                            }
                          }));
                        }}
                        className="resume-input small"
                        placeholder="End Year"
                      />
                    </div>
                  </div>
                </div>

                <div className="edit-section">
                  <h3>Technical Skills</h3>
                  {resumeContent.skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          console.log('Skill change:', index, e.target.value);
                          const newSkills = [...resumeContent.skills];
                          newSkills[index] = e.target.value;
                          setResumeContent(prev => ({
                            ...prev,
                            skills: newSkills
                          }));
                        }}
                        className="resume-input"
                        placeholder="Enter skill..."
                      />
                      {resumeContent.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="remove-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="add-btn"
                  >
                    + Add Skill
                  </button>
                </div>

                <div className="edit-section">
                  <h3>Projects</h3>
                  {resumeContent.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        className="resume-input"
                        placeholder="Project Name"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                        className="resume-textarea"
                        rows="2"
                        placeholder="Project Description..."
                      />
                      <div className="form-row">
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => handleProjectChange(index, 'year', e.target.value)}
                          className="resume-input small"
                          placeholder="Year"
                        />
                        {resumeContent.projects.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(index)}
                            className="remove-btn"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="add-btn"
                  >
                    + Add Project
                  </button>
                </div>

                <div className="edit-section">
                  <h3>Certifications</h3>
                  {resumeContent.certifications.map((cert, index) => (
                    <div key={index} className="cert-item">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertificationChange(index, e.target.value)}
                        className="resume-input"
                        placeholder="Enter certification..."
                      />
                      {resumeContent.certifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCertification(index)}
                          className="remove-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddCertification}
                    className="add-btn"
                  >
                    + Add Certification
                  </button>
                </div>
              </div>
            ) : (
              <div className="resume-preview">
                <div className="resume-header">
                  <h1>{JSON.parse(localStorage.getItem("currentUser") || "{}")?.name || "Student"}</h1>
                  <p>{JSON.parse(localStorage.getItem("currentUser") || "{}")?.email || "student@email.com"} | {JSON.parse(localStorage.getItem("currentUser") || "{}")?.phone || "1234567890"} | City, State</p>
                </div>

                <div className="resume-section">
                  <h3>OBJECTIVE</h3>
                  <p>{resumeContent.objective}</p>
                </div>

                <div className="resume-section">
                  <h3>EDUCATION</h3>
                  <div className="resume-item">
                    <div className="item-header">
                      <h4>{resumeContent.education.degree} in {resumeContent.education.department}</h4>
                      <span>{resumeContent.education.startDate} - {resumeContent.education.endDate}</span>
                    </div>
                    <p>{resumeContent.education.university} | CGPA: {resumeContent.education.cgpa}</p>
                  </div>
                </div>

                <div className="resume-section">
                  <h3>TECHNICAL SKILLS</h3>
                  <ul>
                    {resumeContent.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="resume-section">
                  <h3>PROJECTS</h3>
                  {resumeContent.projects.map((project, index) => (
                    <div key={index} className="resume-item">
                      <div className="item-header">
                        <h4>{project.name}</h4>
                        <span>{project.year}</span>
                      </div>
                      <p>{project.description}</p>
                    </div>
                  ))}
                </div>

                <div className="resume-section">
                  <h3>CERTIFICATIONS</h3>
                  <ul>
                    {resumeContent.certifications.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
