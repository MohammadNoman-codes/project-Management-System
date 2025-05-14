import React, { useState, useEffect } from 'react';

function CommunicationPlan({ stakeholders, projectId }) {
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
    
    // Functional colors for communication types
    email: '#8363ac',        // Email color
    meeting: '#6a4c93',      // Meeting color
    presentation: '#9d80c3', // Presentation color
    report: '#7986cb',       // Report color
    workshop: '#5e35b1',     // Workshop color
    
    // Status colors
    planned: '#9d80c3',      // Purple for planned status
    inProgress: '#7e57c2',   // Accent for in progress
    completed: '#7986cb',    // Blue-ish purple for completed
    overdue: '#8559da',      // Bright purple for overdue/canceled
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

  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed', 'overdue'
  
  // Load communication plans (simulated)
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock communication plans
      const mockCommunications = [
        {
          id: 1,
          stakeholderId: stakeholders.length > 0 ? stakeholders[0].id : 1,
          stakeholderName: stakeholders.length > 0 ? stakeholders[0].name : 'John Smith',
          subject: 'Project Kickoff Meeting',
          communicationType: 'Meeting',
          frequency: 'Once',
          scheduledDate: '2023-06-15',
          deliverables: ['Meeting agenda', 'Project charter', 'Initial timeline'],
          purpose: 'Introduce the project and get initial buy-in from key stakeholders',
          keyMessages: ['Project objectives', 'Expected outcomes', 'Key milestones'],
          recipients: [
            { stakeholderId: 1, name: 'John Smith', role: 'Project Sponsor' },
            { stakeholderId: 3, name: 'Michael Brown', role: 'Technical Consultant' }
          ],
          owner: { id: 1, name: 'Project Manager' },
          status: 'Planned'
        },
        {
          id: 2,
          stakeholderId: stakeholders.length > 1 ? stakeholders[1].id : 2,
          stakeholderName: stakeholders.length > 1 ? stakeholders[1].name : 'Sarah Johnson',
          subject: 'Weekly Status Update',
          communicationType: 'Email',
          frequency: 'Weekly',
          scheduledDate: '2023-06-20',
          deliverables: ['Status report', 'Updated risk register'],
          purpose: 'Keep stakeholders informed of project progress',
          keyMessages: ['Accomplishments', 'Upcoming tasks', 'Issues/risks'],
          recipients: [
            { stakeholderId: 1, name: 'John Smith', role: 'Project Sponsor' },
            { stakeholderId: 2, name: 'Sarah Johnson', role: 'End User Representative' }
          ],
          owner: { id: 1, name: 'Project Manager' },
          status: 'Planned'
        },
        {
          id: 3,
          stakeholderId: stakeholders.length > 3 ? stakeholders[3].id : 4,
          stakeholderName: stakeholders.length > 3 ? stakeholders[3].name : 'Emily Davis',
          subject: 'Compliance Review Meeting',
          communicationType: 'Meeting',
          frequency: 'Quarterly',
          scheduledDate: '2023-07-05',
          deliverables: ['Compliance checklist', 'Issue log'],
          purpose: 'Ensure the project complies with regulatory requirements',
          keyMessages: ['Compliance status', 'Any identified issues', 'Mitigation actions'],
          recipients: [
            { stakeholderId: 4, name: 'Emily Davis', role: 'Compliance Officer' }
          ],
          owner: { id: 1, name: 'Project Manager' },
          status: 'Planned'
        },
        {
          id: 4,
          stakeholderId: stakeholders.length > 2 ? stakeholders[2].id : 3,
          stakeholderName: stakeholders.length > 2 ? stakeholders[2].name : 'Michael Brown',
          subject: 'Technical Design Review',
          communicationType: 'Workshop',
          frequency: 'Once',
          scheduledDate: '2023-06-10',
          deliverables: ['Design documents', 'Architecture diagrams'],
          purpose: 'Review and validate the technical design',
          keyMessages: ['Design approach', 'Technical constraints', 'Integration points'],
          recipients: [
            { stakeholderId: 3, name: 'Michael Brown', role: 'Technical Consultant' }
          ],
          owner: { id: 1, name: 'Project Manager' },
          status: 'Completed'
        }
      ];
      
      setCommunications(mockCommunications);
      setLoading(false);
    }, 1000);
  }, [stakeholders, projectId]);
  
  // Form state for adding/editing communications
  const [formData, setFormData] = useState({
    stakeholderId: '',
    subject: '',
    communicationType: 'Email',
    frequency: 'Once',
    scheduledDate: '',
    deliverables: [],
    purpose: '',
    keyMessages: [],
    recipients: [],
    status: 'Planned'
  });
  
  // Initialize form when editing
  useEffect(() => {
    if (selectedCommunication) {
      setFormData({
        ...selectedCommunication,
        scheduledDate: selectedCommunication.scheduledDate
      });
    }
  }, [selectedCommunication]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedCommunication) {
      // Update existing communication
      setCommunications(communications.map(comm => 
        comm.id === selectedCommunication.id ? { ...formData, id: comm.id } : comm
      ));
    } else {
      // Add new communication
      const newCommunication = {
        ...formData,
        id: Date.now(),
        stakeholderName: stakeholders.find(s => s.id.toString() === formData.stakeholderId.toString())?.name || 'Unknown'
      };
      setCommunications([...communications, newCommunication]);
    }
    
    // Reset and close modal
    setShowAddModal(false);
    setSelectedCommunication(null);
    setFormData({
      stakeholderId: '',
      subject: '',
      communicationType: 'Email',
      frequency: 'Once',
      scheduledDate: '',
      deliverables: [],
      purpose: '',
      keyMessages: [],
      recipients: [],
      status: 'Planned'
    });
  };
  
  // Delete a communication plan
  const handleDeleteCommunication = (id) => {
    setCommunications(communications.filter(comm => comm.id !== id));
  };
  
  // Get filtered communications
  const getFilteredCommunications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (filter === 'all') return communications;
    
    if (filter === 'upcoming') {
      return communications.filter(comm => {
        const schedDate = new Date(comm.scheduledDate);
        schedDate.setHours(0, 0, 0, 0);
        return schedDate >= today && comm.status !== 'Completed';
      });
    }
    
    if (filter === 'completed') {
      return communications.filter(comm => comm.status === 'Completed');
    }
    
    if (filter === 'overdue') {
      return communications.filter(comm => {
        const schedDate = new Date(comm.scheduledDate);
        schedDate.setHours(0, 0, 0, 0);
        return schedDate < today && comm.status !== 'Completed';
      });
    }
    
    return communications;
  };
  
  const filteredCommunications = getFilteredCommunications();
  
  // Check if a communication is overdue
  const isOverdue = (communication) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const schedDate = new Date(communication.scheduledDate);
    schedDate.setHours(0, 0, 0, 0);
    
    return schedDate < today && communication.status !== 'Completed';
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get communication type icon
  const getCommunicationTypeIcon = (type) => {
    switch (type) {
      case 'Email': return 'bi-envelope';
      case 'Meeting': return 'bi-calendar-event';
      case 'Presentation': return 'bi-easel';
      case 'Report': return 'bi-file-earmark-text';
      case 'Workshop': return 'bi-people';
      default: return 'bi-chat-square-text';
    }
  };

  // Get communication type color
  const getCommunicationTypeColor = (type) => {
    switch (type) {
      case 'Email': return purpleColors.email;
      case 'Meeting': return purpleColors.meeting;
      case 'Presentation': return purpleColors.presentation;
      case 'Report': return purpleColors.report;
      case 'Workshop': return purpleColors.workshop;
      default: return purpleColors.tertiary;
    }
  };

  // Get status color
  const getStatusColor = (status, isOver) => {
    if (isOver) return purpleColors.overdue;
    switch (status) {
      case 'Completed': return purpleColors.completed;
      case 'In Progress': return purpleColors.inProgress;
      case 'Cancelled': return purpleColors.overdue;
      default: return purpleColors.planned;
    }
  };
  
  return (
    <div className="communication-plan">
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-chat-dots me-2"></i>Communication Plan
          </h5>
          <div className="d-flex">
            <div className="btn-group me-2">
              <button 
                className={`btn btn-sm rounded-pill ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
                style={filter === 'all' ? 
                  { backgroundColor: purpleColors.primary, borderColor: purpleColors.primary } : 
                  { color: purpleColors.primary, borderColor: purpleColors.primary }
                }
              >
                <i className="bi bi-grid me-1"></i> All
              </button>
              <button 
                className={`btn btn-sm rounded-pill ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('upcoming')}
                style={filter === 'upcoming' ? 
                  { backgroundColor: purpleColors.primary, borderColor: purpleColors.primary } : 
                  { color: purpleColors.primary, borderColor: purpleColors.primary }
                }
              >
                <i className="bi bi-calendar me-1"></i> Upcoming
              </button>
              <button 
                className={`btn btn-sm rounded-pill ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('completed')}
                style={filter === 'completed' ? 
                  { backgroundColor: purpleColors.primary, borderColor: purpleColors.primary } : 
                  { color: purpleColors.primary, borderColor: purpleColors.primary }
                }
              >
                <i className="bi bi-check-circle me-1"></i> Completed
              </button>
              <button 
                className={`btn btn-sm rounded-pill ${filter === 'overdue' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('overdue')}
                style={filter === 'overdue' ? 
                  { backgroundColor: purpleColors.primary, borderColor: purpleColors.primary } : 
                  { color: purpleColors.primary, borderColor: purpleColors.primary }
                }
              >
                <i className="bi bi-exclamation-circle me-1"></i> Overdue
              </button>
            </div>
            <button 
              className="btn btn-primary btn-sm rounded-pill" 
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
            >
              <i className="bi bi-plus-circle me-1"></i> Add Communication
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border" style={{ color: purpleColors.primary }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredCommunications.length === 0 ? (
            <div className="text-center my-5">
              <i className="bi bi-chat-square-dots" style={{ fontSize: '2.5rem', color: purpleColors.quaternary }}></i>
              <p className="text-muted mt-3">No communication plans found</p>
              <button 
                className="btn btn-primary btn-sm rounded-pill" 
                onClick={() => setShowAddModal(true)}
                style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Communication Plan
              </button>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredCommunications.map(communication => {
                const commTypeColor = getCommunicationTypeColor(communication.communicationType);
                const isCommOverdue = isOverdue(communication);
                const statusColor = getStatusColor(communication.status, isCommOverdue);
                
                return (
                <div 
                  key={communication.id} 
                  className="list-group-item list-group-item-action p-3 communication-plan-item"
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="d-flex align-items-center mb-1">
                        <div 
                          className="d-flex align-items-center justify-content-center rounded-circle me-3" 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            backgroundColor: `rgba(${safeHexToRgb(commTypeColor)}, 0.15)`, 
                            flexShrink: 0 
                          }}
                        >
                          <i className={`bi ${getCommunicationTypeIcon(communication.communicationType)} fs-5`} style={{ color: commTypeColor }}></i>
                        </div>
                        <h5 className="mb-0">{communication.subject}</h5>
                      </div>
                      
                      <div className="ms-2 mt-2">
                        <div className="d-flex flex-wrap mb-2">
                          <span 
                            className="badge rounded-pill me-2 mb-1" 
                            style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(commTypeColor)}, 0.15)`, 
                              color: commTypeColor,
                              fontSize: '0.8rem',
                              padding: '0.35em 0.65em'
                            }}
                          >
                            <i className={`bi ${getCommunicationTypeIcon(communication.communicationType)} me-1`}></i>
                            {communication.communicationType}
                          </span>
                          <span 
                            className="badge rounded-pill me-2 mb-1" 
                            style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.15)`, 
                              color: purpleColors.primary,
                              fontSize: '0.8rem',
                              padding: '0.35em 0.65em'
                            }}
                          >
                            <i className="bi bi-people me-1"></i>
                            {communication.stakeholderName}
                          </span>
                          <span 
                            className="badge rounded-pill me-2 mb-1" 
                            style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.15)`, 
                              color: purpleColors.tertiary,
                              fontSize: '0.8rem',
                              padding: '0.35em 0.65em'
                            }}
                          >
                            <i className="bi bi-arrow-repeat me-1"></i>
                            {communication.frequency}
                          </span>
                          <span 
                            className="badge rounded-pill mb-1" 
                            style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(statusColor)}, 0.15)`, 
                              color: statusColor,
                              fontSize: '0.8rem',
                              padding: '0.35em 0.65em'
                            }}
                          >
                            <i className={`bi ${
                              communication.status === 'Completed' ? 'bi-check-circle' : 
                              isCommOverdue ? 'bi-exclamation-circle' : 
                              communication.status === 'In Progress' ? 'bi-hourglass-split' : 
                              'bi-calendar-check'
                            } me-1`}></i>
                            {communication.status}
                            {isCommOverdue && communication.status !== 'Completed' ? ' (Overdue)' : ''}
                          </span>
                        </div>
                        
                        <div className="text-muted mb-2">
                          <i className="bi bi-calendar3 me-2" style={{ color: purpleColors.tertiary }}></i>
                          Scheduled for {formatDate(communication.scheduledDate)}
                        </div>
                      
                        <div className="mt-3">
                          <div className="mb-1">
                            <i className="bi bi-journal-text me-2" style={{ color: purpleColors.secondary }}></i>
                            <strong>Purpose:</strong> {communication.purpose}
                          </div>
                          <div className="mb-1">
                            <i className="bi bi-chat-text me-2" style={{ color: purpleColors.secondary }}></i>
                            <strong>Key Messages:</strong> 
                            <div className="d-flex flex-wrap mt-1 ms-4">
                              {communication.keyMessages.map((message, idx) => (
                                <span 
                                  key={idx} 
                                  className="badge me-2 mb-1" 
                                  style={{ 
                                    backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`,
                                    color: purpleColors.secondary,
                                    padding: '0.4em 0.6em',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <i className="bi bi-dash me-1"></i>{message}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mb-1">
                            <i className="bi bi-file-earmark-check me-2" style={{ color: purpleColors.secondary }}></i>
                            <strong>Deliverables:</strong>
                            <div className="d-flex flex-wrap mt-1 ms-4">
                              {communication.deliverables.map((deliverable, idx) => (
                                <span 
                                  key={idx} 
                                  className="badge me-2 mb-1" 
                                  style={{ 
                                    backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`,
                                    color: purpleColors.secondary,
                                    padding: '0.4em 0.6em',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <i className="bi bi-file-earmark me-1"></i>{deliverable}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex">
                      <button 
                        className="btn btn-sm btn-outline-primary rounded-pill me-1" 
                        onClick={() => {
                          setSelectedCommunication(communication);
                          setShowAddModal(true);
                        }}
                        style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-success rounded-pill me-1" 
                        onClick={() => {
                          setCommunications(communications.map(comm => 
                            comm.id === communication.id ? { ...comm, status: 'Completed' } : comm
                          ));
                        }}
                        disabled={communication.status === 'Completed'}
                        style={{ 
                          borderColor: communication.status !== 'Completed' ? purpleColors.completed : '#ccc',
                          color: communication.status !== 'Completed' ? purpleColors.completed : '#ccc'
                        }}
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger rounded-pill" 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this communication plan?')) {
                            handleDeleteCommunication(communication.id);
                          }
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Communication Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title">
                  <i className={`bi ${selectedCommunication ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{ color: purpleColors.primary }}></i>
                  {selectedCommunication ? 'Edit Communication Plan' : 'Add Communication Plan'}
                </h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowAddModal(false);
                  setSelectedCommunication(null);
                }}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="stakeholderId" className="form-label">
                        <i className="bi bi-person me-1" style={{ color: purpleColors.primary }}></i>
                        Primary Stakeholder *
                      </label>
                      <select
                        className="form-select rounded-pill"
                        id="stakeholderId"
                        name="stakeholderId"
                        value={formData.stakeholderId}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      >
                        <option value="">Select Stakeholder</option>
                        {stakeholders.map(stakeholder => (
                          <option key={stakeholder.id} value={stakeholder.id}>
                            {stakeholder.name} - {stakeholder.role}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="subject" className="form-label">
                        <i className="bi bi-chat-square-text me-1" style={{ color: purpleColors.primary }}></i>
                        Subject *
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-pill"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      />
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label htmlFor="communicationType" className="form-label">
                        <i className="bi bi-grid me-1" style={{ color: purpleColors.primary }}></i>
                        Communication Type *
                      </label>
                      <select
                        className="form-select rounded-pill"
                        id="communicationType"
                        name="communicationType"
                        value={formData.communicationType}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      >
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Report">Report</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="frequency" className="form-label">
                        <i className="bi bi-arrow-repeat me-1" style={{ color: purpleColors.primary }}></i>
                        Frequency *
                      </label>
                      <select
                        className="form-select rounded-pill"
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      >
                        <option value="Once">Once</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Biweekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="As Needed">As Needed</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="scheduledDate" className="form-label">
                        <i className="bi bi-calendar-event me-1" style={{ color: purpleColors.primary }}></i>
                        Scheduled Date *
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-pill"
                        id="scheduledDate"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="purpose" className="form-label">
                      <i className="bi bi-journal-text me-1" style={{ color: purpleColors.primary }}></i>
                      Purpose
                    </label>
                    <textarea
                      className="form-control"
                      id="purpose"
                      name="purpose"
                      rows="2"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      style={{ 
                        borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)`,
                        borderRadius: '1rem'
                      }}
                    ></textarea>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="deliverables" className="form-label">
                        <i className="bi bi-file-earmark-check me-1" style={{ color: purpleColors.primary }}></i>
                        Deliverables (comma-separated)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-pill"
                        id="deliverables"
                        name="deliverables"
                        value={Array.isArray(formData.deliverables) ? formData.deliverables.join(', ') : formData.deliverables}
                        onChange={(e) => setFormData({
                          ...formData,
                          deliverables: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                        })}
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="keyMessages" className="form-label">
                        <i className="bi bi-chat-text me-1" style={{ color: purpleColors.primary }}></i>
                        Key Messages (comma-separated)
                      </label>
                      <input
                        type="text"
                        className="form-control rounded-pill"
                        id="keyMessages"
                        name="keyMessages"
                        value={Array.isArray(formData.keyMessages) ? formData.keyMessages.join(', ') : formData.keyMessages}
                        onChange={(e) => setFormData({
                          ...formData,
                          keyMessages: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                        })}
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      <i className="bi bi-flag me-1" style={{ color: purpleColors.primary }}></i>
                      Status
                    </label>
                    <select
                      className="form-select rounded-pill"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-pill me-2" 
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedCommunication(null);
                      }}
                    >
                      <i className="bi bi-x-circle me-1"></i> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill" 
                      style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                    >
                      <i className={`bi ${selectedCommunication ? 'bi-save' : 'bi-plus-circle'} me-1`}></i>
                      {selectedCommunication ? 'Update Communication' : 'Add Communication'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunicationPlan;
