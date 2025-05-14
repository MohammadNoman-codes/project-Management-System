import React, { useState, useEffect } from 'react';
import ResourceCalendar from './ResourceCalendar';
import ResourceAllocationMatrix from './ResourceAllocationMatrix';
import ResourceWorkloadAnalysis from './ResourceWorkloadAnalysis';

function ResourcePage() {
  // Purple-themed color palette for styling to match Dashboard
  const purpleColors = {
    // Primary purple shades
    primary: '#6a4c93',      // Deep purple
    secondary: '#8363ac',    // Medium purple
    tertiary: '#9d80c3',     // Light purple
    quaternary: '#b39ddb',   // Lavender
    quinary: '#d1c4e9',      // Very light purple
    
    // Complementary colors
    accent1: '#4d4398',      // Blue-purple
    accent2: '#7e57c2',      // Brighter purple
    accent3: '#5e35b1',      // Deeper violet
    
    // Functional colors for status
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
  };

  // Safe hexToRgb function that handles undefined values
  const safeHexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    try {
      // Remove the # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    } catch (error) {
      console.error("Error in hexToRgb:", error);
      return '0, 0, 0'; // Fallback if any error occurs
    }
  };
  
  const [activeTab, setActiveTab] = useState('list');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [newResource, setNewResource] = useState({
    name: '',
    department: '',
    role: '',
    email: '',
    phone: '',
    utilizationTarget: 80,
    skills: []
  });
  
  // Get a color for utilization based on value
  const getUtilizationColor = (value) => {
    if (value > 90) return purpleColors.accent2;
    if (value > 75) return purpleColors.tertiary;
    return purpleColors.completed;
  };
  
  useEffect(() => {
    const fetchResources = async () => {
      const resourceData = [
        { id: 1, name: 'Mohammad', department: 'Development', role: 'Senior Developer', email: 'Mohammad@example.com', phone: '+973 1234 5678', skills: ['React', 'Node.js', 'MongoDB'], utilizationTarget: 85, avatar: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Ali', department: 'Design', role: 'UI/UX Designer', email: 'Ali@example.com', phone: '+973 2345 6789', skills: ['UI Design', 'Figma', 'User Research'], utilizationTarget: 80, avatar: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Abdulla', department: 'Development', role: 'Backend Developer', email: 'Abdulla@example.com', phone: '+973 3456 7890', skills: ['Java', 'Spring Boot', 'SQL'], utilizationTarget: 90, avatar: 'https://via.placeholder.com/40' },
        { id: 4, name: 'Ahmed', department: 'QA', role: 'Test Engineer', email: 'Ahmed@example.com', phone: '+973 4567 8901', skills: ['QA Automation', 'Selenium', 'Cucumber'], utilizationTarget: 75, avatar: 'https://via.placeholder.com/40' },
        { id: 5, name: 'Mariam', department: 'Development', role: 'Frontend Developer', email: 'Mariam@example.com', phone: '+973 5678 9012', skills: ['Angular', 'TypeScript', 'SCSS'], utilizationTarget: 85, avatar: 'https://via.placeholder.com/40' },
        { id: 6, name: 'Mohammad', department: 'Project Management', role: 'Project Manager', email: 'Mohammad@example.com', phone: '+973 6789 0123', skills: ['PRINCE2', 'Agile', 'MS Project'], utilizationTarget: 70, avatar: 'https://via.placeholder.com/40' },
        { id: 7, name: 'Salman', department: 'QA', role: 'QA Lead', email: 'Salman@example.com', phone: '+973 7890 1234', skills: ['Test Planning', 'Test Case Design', 'QA Processes'], utilizationTarget: 80, avatar: 'https://via.placeholder.com/40' }
      ];
      
      setResources(resourceData);
      setLoading(false);
    };
    
    fetchResources();
  }, []);
  
  const handleResourceInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddResource = () => {
    if (!newResource.name || !newResource.role || !newResource.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newResourceItem = {
      id: Date.now(),
      ...newResource,
      avatar: 'https://via.placeholder.com/40'
    };
    
    setResources(prev => [...prev, newResourceItem]);
    
    setNewResource({
      name: '',
      department: '',
      role: '',
      email: '',
      phone: '',
      utilizationTarget: 80,
      skills: []
    });
    setShowResourceModal(false);
  };
  
  const handleSkillsChange = (e) => {
    const skillsText = e.target.value;
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(Boolean);
    setNewResource(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };
  
  const getDepartments = () => {
    const departments = [...new Set(resources.map(r => r.department))];
    return departments;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border" style={{ color: purpleColors.primary }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="resource-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">Resource Management</h1>
        <button 
          className="btn btn-primary rounded-pill" 
          onClick={() => setShowResourceModal(true)}
          style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
        >
          <i className="bi bi-plus-circle me-1"></i> Add Resource
        </button>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
            style={activeTab === 'list' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-list me-1"></i> Resource List
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
            style={activeTab === 'calendar' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-calendar3 me-1"></i> Availability Calendar
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
            style={activeTab === 'matrix' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-grid-3x3 me-1"></i> Allocation Matrix
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'workload' ? 'active' : ''}`}
            onClick={() => setActiveTab('workload')}
            style={activeTab === 'workload' ? {
              borderBottomColor: purpleColors.primary,
              color: purpleColors.primary,
              fontWeight: '500'
            } : {}}
          >
            <i className="bi bi-bar-chart me-1"></i> Workload Analysis
          </button>
        </li>
      </ul>
      
      {activeTab === 'list' && (
        <div className="dashboard-card">
          <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-people me-2"></i>Resource List
            </h5>
            <div>
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Search resources..."
                />
                <button 
                  className="btn btn-sm btn-outline-primary rounded-end"
                  style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover dashboard-table">
                <thead>
                  <tr>
                    <th>Resource</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Skills</th>
                    <th>Contact</th>
                    <th>Utilization Target</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map(resource => (
                    <tr key={resource.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2" style={{ 
                            backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                            color: purpleColors.primary,
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: '500'
                          }}>
                            {resource.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-medium">{resource.name}</div>
                            <div className="text-muted small">{resource.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{ 
                          backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
                          color: purpleColors.tertiary,
                          fontWeight: 'normal',
                          padding: '5px 10px'
                        }}>
                          {resource.role}
                        </span>
                      </td>
                      <td>{resource.department}</td>
                      <td>
                        <div className="d-flex flex-wrap">
                          {resource.skills?.map((skill, index) => (
                            <span 
                              key={index} 
                              className="badge me-1 mb-1"
                              style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`,
                                color: purpleColors.quaternary,
                                borderRadius: '12px',
                                padding: '4px 8px'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <i className="bi bi-envelope me-1" style={{ color: purpleColors.secondary }}></i>
                          {resource.email}
                        </div>
                        <div className="small">
                          <i className="bi bi-telephone me-1" style={{ color: purpleColors.secondary }}></i>
                          {resource.phone}
                        </div>
                      </td>
                      <td>
                        <div className="progress progress-thin">
                          <div 
                            className="progress-bar" 
                            role="progressbar"
                            style={{ 
                              width: `${resource.utilizationTarget}%`,
                              backgroundColor: getUtilizationColor(resource.utilizationTarget)
                            }}
                            aria-valuenow={resource.utilizationTarget} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="small text-center mt-1" style={{ color: getUtilizationColor(resource.utilizationTarget) }}>
                          {resource.utilizationTarget}%
                        </div>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-primary rounded-start"
                            style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary rounded-end"
                            style={{ borderColor: purpleColors.quaternary, color: purpleColors.quaternary }}
                          >
                            <i className="bi bi-calendar3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'calendar' && <ResourceCalendar resources={resources} purpleColors={purpleColors} />}
      
      {activeTab === 'matrix' && <ResourceAllocationMatrix purpleColors={purpleColors} />}
      
      {activeTab === 'workload' && <ResourceWorkloadAnalysis purpleColors={purpleColors} />}
      
      {showResourceModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-person-plus-fill me-2"></i>Add Resource
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowResourceModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={newResource.name}
                      onChange={handleResourceInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-building"></i>
                    </span>
                    <select 
                      className="form-select"
                      name="department"
                      value={newResource.department}
                      onChange={handleResourceInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {getDepartments().map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                      <option value="QA">QA</option>
                      <option value="Project Management">Project Management</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Role <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-briefcase"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="role"
                      value={newResource.role}
                      onChange={handleResourceInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email" 
                      className="form-control"
                      name="email"
                      value={newResource.email}
                      onChange={handleResourceInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="text" 
                      className="form-control"
                      name="phone"
                      value={newResource.phone}
                      onChange={handleResourceInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Utilization Target (%)</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-speedometer"></i>
                    </span>
                    <input
                      type="number" 
                      className="form-control"
                      name="utilizationTarget"
                      min="0"
                      max="100"
                      value={newResource.utilizationTarget}
                      onChange={handleResourceInputChange}
                    />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="progress progress-thin mt-2">
                    <div 
                      className="progress-bar" 
                      style={{ 
                        width: `${newResource.utilizationTarget}%`,
                        backgroundColor: getUtilizationColor(newResource.utilizationTarget)
                      }}
                    ></div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Skills (comma separated)</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-tools"></i>
                    </span>
                    <input
                      type="text" 
                      className="form-control"
                      placeholder="e.g. JavaScript, React, Node.js"
                      onChange={handleSkillsChange}
                    />
                  </div>
                  <small className="text-muted">Enter skills separated by commas</small>
                </div>
              </div>
              <div className="modal-footer" style={{ borderTop: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <button 
                  type="button"
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={() => setShowResourceModal(false)}
                >
                  <i className="bi bi-x-circle me-1"></i> Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary rounded-pill"
                  onClick={handleAddResource}
                  style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                >
                  <i className="bi bi-person-plus me-1"></i> Add Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourcePage;
