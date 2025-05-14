import React, { useState, useEffect } from 'react';

function EngagementHistory({ stakeholders, projectId }) {
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
    accent3: '#5e35b1',     // Deeper violet
    
    // Functional colors for status
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
    
    // Engagement-specific colors
    meeting: '#6a4c93',      // Meeting color
    email: '#8363ac',        // Email color
    phoneCall: '#9d80c3',    // Phone Call color
    workshop: '#7e57c2',     // Workshop color
    presentation: '#5e35b1', // Presentation color
    feedback: '#7986cb',     // Feedback color
    
    // Sentiment colors
    positive: '#7986cb',     // Positive sentiment
    neutral: '#9575cd',      // Neutral sentiment
    negative: '#8559da',     // Negative sentiment
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

  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEngagement, setSelectedEngagement] = useState(null);
  const [filter, setFilter] = useState({
    stakeholderId: 'all',
    type: 'all',
    dateRange: 'all'
  });
  
  // Load engagement history (simulated)
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock engagement history
      const mockEngagements = [
        {
          id: 1,
          stakeholderId: stakeholders.length > 0 ? stakeholders[0].id : 1,
          stakeholderName: stakeholders.length > 0 ? stakeholders[0].name : 'John Smith',
          engagementType: 'Meeting',
          date: '2023-06-02',
          duration: 60, // minutes
          topic: 'Project Kickoff',
          summary: 'Introduced the project to key stakeholders and discussed the overall scope and objectives.',
          keyPoints: [
            'Project timeline presented',
            'Initial scope agreed',
            'Key milestones identified'
          ],
          feedback: {
            sentimentRating: 4,
            comments: 'Stakeholder was enthusiastic about the project and provided valuable input.'
          },
          followUpRequired: true,
          followUpDate: '2023-06-15',
          notes: 'Need to share the project charter after the meeting.'
        },
        {
          id: 2,
          stakeholderId: stakeholders.length > 1 ? stakeholders[1].id : 2,
          stakeholderName: stakeholders.length > 1 ? stakeholders[1].name : 'Sarah Johnson',
          engagementType: 'Workshop',
          date: '2023-06-05',
          duration: 120, // minutes
          topic: 'Requirements Gathering',
          summary: 'Conducted a workshop to gather and document user requirements.',
          keyPoints: [
            'Identified key user requirements',
            'Discussed user interface preferences',
            'Prioritized features'
          ],
          feedback: {
            sentimentRating: 5,
            comments: 'Very productive session with detailed feedback on requirements.'
          },
          followUpRequired: true,
          followUpDate: '2023-06-20',
          notes: 'Send requirements document for review.'
        },
        {
          id: 3,
          stakeholderId: stakeholders.length > 3 ? stakeholders[3].id : 4,
          stakeholderName: stakeholders.length > 3 ? stakeholders[3].name : 'Emily Davis',
          engagementType: 'Email',
          date: '2023-06-08',
          topic: 'Compliance Requirements',
          summary: 'Exchanged emails regarding regulatory compliance requirements for the project.',
          keyPoints: [
            'Identified key compliance areas',
            'Requested documentation guidelines',
            'Scheduled follow-up meeting'
          ],
          feedback: {
            sentimentRating: 3,
            comments: 'Response was neutral, awaiting more information.'
          },
          followUpRequired: true,
          followUpDate: '2023-06-18',
          notes: 'Need to provide more details on data handling processes.'
        },
        {
          id: 4,
          stakeholderId: stakeholders.length > 2 ? stakeholders[2].id : 3,
          stakeholderName: stakeholders.length > 2 ? stakeholders[2].name : 'Michael Brown',
          engagementType: 'Phone Call',
          date: '2023-06-10',
          duration: 30, // minutes
          topic: 'Technical Integration Discussion',
          summary: 'Discussed technical integration approaches and potential challenges.',
          keyPoints: [
            'Identified integration points',
            'Discussed API requirements',
            'Addressed potential bottlenecks'
          ],
          feedback: {
            sentimentRating: 4,
            comments: 'Stakeholder provided helpful technical insights.'
          },
          followUpRequired: false,
          notes: 'Integration approach agreed, no immediate follow-up needed.'
        }
      ];
      
      setEngagements(mockEngagements);
      setLoading(false);
    }, 1000);
  }, [stakeholders, projectId]);
  
  // Form state for adding/editing engagements
  const [formData, setFormData] = useState({
    stakeholderId: '',
    engagementType: 'Meeting',
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    topic: '',
    summary: '',
    keyPoints: [],
    feedback: {
      sentimentRating: 3,
      comments: ''
    },
    followUpRequired: false,
    followUpDate: '',
    notes: ''
  });
  
  // Initialize form when editing
  useEffect(() => {
    if (selectedEngagement) {
      setFormData({
        ...selectedEngagement,
        date: selectedEngagement.date,
        followUpDate: selectedEngagement.followUpDate || ''
      });
    }
  }, [selectedEngagement]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('feedback.')) {
      const feedbackField = name.split('.')[1];
      setFormData({
        ...formData,
        feedback: {
          ...formData.feedback,
          [feedbackField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };
  
  // Handle key points input
  const [newKeyPoint, setNewKeyPoint] = useState('');
  
  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setFormData({
        ...formData,
        keyPoints: [...formData.keyPoints, newKeyPoint.trim()]
      });
      setNewKeyPoint('');
    }
  };
  
  const handleRemoveKeyPoint = (index) => {
    const updatedKeyPoints = [...formData.keyPoints];
    updatedKeyPoints.splice(index, 1);
    setFormData({ ...formData, keyPoints: updatedKeyPoints });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedEngagement) {
      // Update existing engagement
      setEngagements(engagements.map(eng => 
        eng.id === selectedEngagement.id ? { ...formData, id: eng.id } : eng
      ));
    } else {
      // Add new engagement
      const newEngagement = {
        ...formData,
        id: Date.now(),
        stakeholderName: stakeholders.find(s => s.id.toString() === formData.stakeholderId.toString())?.name || 'Unknown'
      };
      setEngagements([...engagements, newEngagement]);
    }
    
    // Reset and close modal
    setShowAddModal(false);
    setSelectedEngagement(null);
    setFormData({
      stakeholderId: '',
      engagementType: 'Meeting',
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      topic: '',
      summary: '',
      keyPoints: [],
      feedback: {
        sentimentRating: 3,
        comments: ''
      },
      followUpRequired: false,
      followUpDate: '',
      notes: ''
    });
  };
  
  // Delete an engagement
  const handleDeleteEngagement = (id) => {
    setEngagements(engagements.filter(eng => eng.id !== id));
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };
  
  // Apply filters to engagements
  const getFilteredEngagements = () => {
    return engagements.filter(engagement => {
      // Filter by stakeholder
      if (filter.stakeholderId !== 'all' && engagement.stakeholderId.toString() !== filter.stakeholderId) {
        return false;
      }
      
      // Filter by engagement type
      if (filter.type !== 'all' && engagement.engagementType !== filter.type) {
        return false;
      }
      
      // Filter by date range
      if (filter.dateRange !== 'all') {
        const engagementDate = new Date(engagement.date);
        const today = new Date();
        
        if (filter.dateRange === 'thisWeek') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          
          return engagementDate >= startOfWeek && engagementDate <= endOfWeek;
        }
        
        if (filter.dateRange === 'thisMonth') {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          
          return engagementDate >= startOfMonth && engagementDate <= endOfMonth;
        }
        
        if (filter.dateRange === 'last30Days') {
          const daysAgo30 = new Date(today);
          daysAgo30.setDate(today.getDate() - 30);
          
          return engagementDate >= daysAgo30;
        }
      }
      
      return true;
    });
  };
  
  const filteredEngagements = getFilteredEngagements().sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get icon for engagement type
  const getEngagementIcon = (type) => {
    switch (type) {
      case 'Meeting': return 'bi-calendar-event';
      case 'Email': return 'bi-envelope';
      case 'Phone Call': return 'bi-telephone';
      case 'Workshop': return 'bi-people';
      case 'Presentation': return 'bi-easel';
      case 'Feedback': return 'bi-chat-dots';
      default: return 'bi-journal-text';
    }
  };
  
  // Get color for engagement type
  const getEngagementColor = (type) => {
    switch(type) {
      case 'Meeting': return purpleColors.meeting;
      case 'Email': return purpleColors.email;
      case 'Phone Call': return purpleColors.phoneCall;
      case 'Workshop': return purpleColors.workshop;
      case 'Presentation': return purpleColors.presentation;
      case 'Feedback': return purpleColors.feedback;
      default: return purpleColors.primary;
    }
  };
  
  // Get color for sentiment rating
  const getSentimentColor = (rating) => {
    if (rating >= 4) return purpleColors.positive;
    if (rating >= 3) return purpleColors.neutral;
    return purpleColors.negative;
  };

  return (
    <div className="engagement-history">
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-people-fill me-2"></i>Stakeholder Engagement History
          </h5>
          <button 
            className="btn btn-primary btn-sm rounded-pill" 
            onClick={() => setShowAddModal(true)}
            style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
          >
            <i className="bi bi-plus-circle me-1"></i> Record Engagement
          </button>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap mb-4">
            <div className="me-2 mb-2" style={{ width: '200px' }}>
              <label className="form-label">
                <i className="bi bi-person me-1" style={{ color: purpleColors.primary }}></i>
                Stakeholder
              </label>
              <select 
                className="form-select form-select-sm rounded-pill"
                name="stakeholderId"
                value={filter.stakeholderId}
                onChange={handleFilterChange}
                style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
              >
                <option value="all">All Stakeholders</option>
                {stakeholders.map(stakeholder => (
                  <option key={stakeholder.id} value={stakeholder.id}>
                    {stakeholder.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="me-2 mb-2" style={{ width: '200px' }}>
              <label className="form-label">
                <i className="bi bi-grid me-1" style={{ color: purpleColors.primary }}></i>
                Engagement Type
              </label>
              <select 
                className="form-select form-select-sm rounded-pill"
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
                style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
              >
                <option value="all">All Types</option>
                <option value="Meeting">Meeting</option>
                <option value="Email">Email</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Workshop">Workshop</option>
                <option value="Presentation">Presentation</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>
            <div className="mb-2" style={{ width: '200px' }}>
              <label className="form-label">
                <i className="bi bi-calendar-event me-1" style={{ color: purpleColors.primary }}></i>
                Date Range
              </label>
              <select 
                className="form-select form-select-sm rounded-pill"
                name="dateRange"
                value={filter.dateRange}
                onChange={handleFilterChange}
                style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
              >
                <option value="all">All Time</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="last30Days">Last 30 Days</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border" style={{ color: purpleColors.primary }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredEngagements.length === 0 ? (
            <div className="text-center my-5">
              <i className="bi bi-calendar-x display-1" style={{ color: purpleColors.quaternary }}></i>
              <p className="mt-3 text-muted">No engagement records found</p>
              <button 
                className="btn btn-primary btn-sm rounded-pill" 
                onClick={() => setShowAddModal(true)}
                style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
              >
                <i className="bi bi-plus-circle me-1"></i> Record New Engagement
              </button>
            </div>
          ) : (
            <div className="engagement-timeline">
              {filteredEngagements.map(engagement => {
                const engagementColor = getEngagementColor(engagement.engagementType);
                return (
                  <div 
                    key={engagement.id} 
                    className={`engagement-item ${engagement.engagementType.toLowerCase().replace(' ', '')}`}
                  >
                    <div className="dashboard-card mb-3">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <i className={`bi ${getEngagementIcon(engagement.engagementType)} me-2`} style={{ color: engagementColor }}></i>
                          <h6 className="mb-0">{engagement.topic}</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <span 
                            className="badge rounded-pill me-2" 
                            style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(engagementColor)}, 0.1)`, 
                              color: engagementColor 
                            }}
                          >
                            {engagement.engagementType}
                          </span>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(engagement.date)}
                          </small>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="mb-3 d-flex justify-content-between">
                          <div>
                            <i className="bi bi-person me-1" style={{ color: purpleColors.primary }}></i>
                            <strong>Stakeholder:</strong> {engagement.stakeholderName}
                          </div>
                          {engagement.duration && (
                            <div>
                              <i className="bi bi-clock me-1" style={{ color: purpleColors.tertiary }}></i>
                              <strong>Duration:</strong> {engagement.duration} minutes
                            </div>
                          )}
                        </div>
                        
                        <div className="mb-3">
                          <i className="bi bi-card-text me-1" style={{ color: purpleColors.secondary }}></i>
                          <strong>Summary:</strong>
                          <p className="mb-0 mt-1 ps-4">{engagement.summary}</p>
                        </div>
                        
                        {engagement.keyPoints && engagement.keyPoints.length > 0 && (
                          <div className="mb-3">
                            <i className="bi bi-list-check me-1" style={{ color: purpleColors.tertiary }}></i>
                            <strong>Key Points:</strong>
                            <ul className="mb-0 mt-1 ps-4">
                              {engagement.keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {engagement.feedback && (
                          <div className="mb-3">
                            <i className="bi bi-chat-square-text me-1" style={{ color: purpleColors.accent2 }}></i>
                            <strong>Feedback:</strong>
                            <div className="d-flex align-items-center mt-1 mb-1 ps-4">
                              <div className="me-2">Sentiment:</div>
                              <div className="progress flex-grow-1 progress-thin" style={{ height: '6px' }}>
                                <div 
                                  className="progress-bar"
                                  style={{ 
                                    width: `${engagement.feedback.sentimentRating * 20}%`,
                                    backgroundColor: getSentimentColor(engagement.feedback.sentimentRating)
                                  }}
                                  role="progressbar" 
                                  aria-valuenow={engagement.feedback.sentimentRating}
                                  aria-valuemin="1" 
                                  aria-valuemax="5"
                                ></div>
                              </div>
                              <div 
                                className="ms-2 badge rounded-pill" 
                                style={{ 
                                  backgroundColor: `rgba(${safeHexToRgb(getSentimentColor(engagement.feedback.sentimentRating))}, 0.1)`, 
                                  color: getSentimentColor(engagement.feedback.sentimentRating) 
                                }}
                              >
                                {engagement.feedback.sentimentRating}/5
                              </div>
                            </div>
                            {engagement.feedback.comments && (
                              <p className="mb-0 ps-4">{engagement.feedback.comments}</p>
                            )}
                          </div>
                        )}
                        
                        {engagement.followUpRequired && (
                          <div className="mb-3">
                            <i className="bi bi-arrow-repeat me-1" style={{ color: purpleColors.accent3 }}></i>
                            <strong>Follow Up:</strong> 
                            <span className="badge ms-2" style={{ backgroundColor: purpleColors.accent3 }}>
                              Required by {formatDate(engagement.followUpDate)}
                            </span>
                          </div>
                        )}
                        
                        {engagement.notes && (
                          <div>
                            <i className="bi bi-journal-text me-1" style={{ color: purpleColors.primary }}></i>
                            <strong>Notes:</strong>
                            <p className="mb-0 mt-1 ps-4">{engagement.notes}</p>
                          </div>
                        )}
                      </div>
                      <div className="card-footer bg-white">
                        <div className="d-flex">
                          <button 
                            className="btn btn-sm btn-outline-primary rounded-pill me-2"
                            onClick={() => {
                              setSelectedEngagement(engagement);
                              setShowAddModal(true);
                            }}
                            style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this engagement record?')) {
                                handleDeleteEngagement(engagement.id);
                              }
                            }}
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Add/Edit Engagement Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title">
                  <i className={`bi ${selectedEngagement ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{ color: purpleColors.primary }}></i>
                  {selectedEngagement ? 'Edit Engagement Record' : 'Record New Engagement'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedEngagement(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="stakeholderId" className="form-label">
                        <i className="bi bi-person me-1" style={{ color: purpleColors.primary }}></i>
                        Stakeholder *
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
                      <label htmlFor="engagementType" className="form-label">
                        <i className="bi bi-grid me-1" style={{ color: purpleColors.primary }}></i>
                        Engagement Type *
                      </label>
                      <select
                        className="form-select rounded-pill"
                        id="engagementType"
                        name="engagementType"
                        value={formData.engagementType}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      >
                        <option value="Meeting">Meeting</option>
                        <option value="Email">Email</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Workshop">Workshop</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="date" className="form-label">
                        <i className="bi bi-calendar-event me-1" style={{ color: purpleColors.primary }}></i>
                        Date *
                      </label>
                      <input
                        type="date"
                        className="form-control rounded-pill"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="duration" className="form-label">
                        <i className="bi bi-clock me-1" style={{ color: purpleColors.primary }}></i>
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        className="form-control rounded-pill"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="e.g., 30"
                        style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="topic" className="form-label">
                      <i className="bi bi-tag me-1" style={{ color: purpleColors.primary }}></i>
                      Topic/Subject *
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-pill"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Project Kickoff Meeting"
                      style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="summary" className="form-label">
                      <i className="bi bi-card-text me-1" style={{ color: purpleColors.primary }}></i>
                      Summary *
                    </label>
                    <textarea
                      className="form-control"
                      id="summary"
                      name="summary"
                      rows="2"
                      value={formData.summary}
                      onChange={handleInputChange}
                      required
                      placeholder="Briefly describe the engagement"
                      style={{ 
                        borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)`,
                        borderRadius: '1rem'
                      }}
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-list-check me-1" style={{ color: purpleColors.primary }}></i>
                      Key Points
                    </label>
                    <div className="input-group mb-2 rounded-pill-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add key point"
                        value={newKeyPoint}
                        onChange={(e) => setNewKeyPoint(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyPoint())}
                        style={{ 
                          borderTopLeftRadius: '50rem',
                          borderBottomLeftRadius: '50rem',
                          borderRight: 'none',
                          borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)`
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={handleAddKeyPoint}
                        style={{ 
                          borderTopRightRadius: '50rem',
                          borderBottomRightRadius: '50rem',
                          borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)`,
                          color: purpleColors.primary
                        }}
                      >
                        <i className="bi bi-plus"></i> Add
                      </button>
                    </div>
                    
                    {formData.keyPoints.length > 0 ? (
                      <ul className="list-group" style={{ borderRadius: '0.75rem' }}>
                        {formData.keyPoints.map((point, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center"
                              style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)` }}>
                            <span><i className="bi bi-check-lg me-2" style={{ color: purpleColors.tertiary }}></i>{point}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              onClick={() => handleRemoveKeyPoint(index)}
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No key points added</p>
                    )}
                  </div>
                  
                  <div className="mb-3 p-3" style={{ 
                    backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`,
                    borderRadius: '0.75rem'
                  }}>
                    <label className="form-label">
                      <i className="bi bi-chat-square-text me-1" style={{ color: purpleColors.primary }}></i>
                      Stakeholder Feedback
                    </label>
                    <div className="row mb-2 align-items-center">
                      <div className="col-md-3">
                        <label htmlFor="feedback.sentimentRating" className="form-label mb-0">Sentiment Rating:</label>
                      </div>
                      <div className="col-md-9">
                        <div className="d-flex align-items-center">
                          <input
                            type="range"
                            className="form-range flex-grow-1 me-2"
                            id="feedback.sentimentRating"
                            name="feedback.sentimentRating"
                            min="1"
                            max="5"
                            value={formData.feedback.sentimentRating}
                            onChange={handleInputChange}
                          />
                          <span 
                            className="badge rounded-pill" 
                            style={{ 
                              backgroundColor: getSentimentColor(formData.feedback.sentimentRating),
                              minWidth: '36px'
                            }}
                          >
                            {formData.feedback.sentimentRating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="feedback.comments" className="form-label">Comments:</label>
                      <textarea
                        className="form-control"
                        id="feedback.comments"
                        name="feedback.comments"
                        rows="2"
                        value={formData.feedback.comments}
                        onChange={handleInputChange}
                        placeholder="Stakeholder's feedback or comments"
                        style={{ 
                          borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)`,
                          borderRadius: '0.75rem'
                        }}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="followUpRequired"
                        name="followUpRequired"
                        checked={formData.followUpRequired}
                        onChange={handleInputChange}
                        style={{ 
                          backgroundColor: formData.followUpRequired ? purpleColors.primary : '',
                          borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.5)`
                        }}
                      />
                      <label className="form-check-label" htmlFor="followUpRequired">
                        <i className="bi bi-arrow-repeat me-1" style={{ color: purpleColors.primary }}></i>
                        Follow-up Required
                      </label>
                    </div>
                    
                    {formData.followUpRequired && (
                      <div className="mt-2">
                        <label htmlFor="followUpDate" className="form-label">Follow-up By Date</label>
                        <input
                          type="date"
                          className="form-control rounded-pill"
                          id="followUpDate"
                          name="followUpDate"
                          value={formData.followUpDate}
                          onChange={handleInputChange}
                          required={formData.followUpRequired}
                          style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      <i className="bi bi-journal-text me-1" style={{ color: purpleColors.primary }}></i>
                      Additional Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="2"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional notes or information"
                      style={{ 
                        borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)`,
                        borderRadius: '1rem'
                      }}
                    ></textarea>
                  </div>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-pill me-2" 
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedEngagement(null);
                      }}
                    >
                      <i className="bi bi-x-circle me-1"></i> Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary rounded-pill" 
                      style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                    >
                      <i className={`bi ${selectedEngagement ? 'bi-save' : 'bi-plus-circle'} me-1`}></i>
                      {selectedEngagement ? 'Update Engagement' : 'Record Engagement'}
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

export default EngagementHistory;
