import React, { useState, useEffect } from 'react';

function RiskForm({ risk, mode = 'create', projectId, onSubmit, onCancel }) {
  // Purple-themed color palette for UI elements
  const chartColors = {
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
    critical: '#9c27b0',     // Bright purple for critical risks
    high: '#8559da',         // Medium-bright purple for high risks
    medium: '#9575cd',       // Medium purple for medium risks
    low: '#b39ddb',          // Light purple for low risks
  };
  
  // Safe hexToRgb function that handles undefined values
  const safeHexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    try {
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    } catch (error) {
      console.error("Error in hexToRgb:", error);
      return '0, 0, 0'; // Fallback if any error occurs
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: projectId || '',
    category: 'Technical',
    probability: 3,
    impact: 3,
    status: 'Identified',
    owner: '',
    mitigationPlan: '',
    contingencyPlan: '',
    triggers: [],
    reviewDate: ''
  });
  
  const [newTrigger, setNewTrigger] = useState('');
  const [errors, setErrors] = useState({});
  
  // Calculate risk score
  const riskScore = formData.probability * formData.impact;
  
  // Determine risk severity level
  const getRiskSeverity = (score) => {
    if (score >= 16) return { level: 'Critical', color: chartColors.critical };
    if (score >= 11) return { level: 'High', color: chartColors.high };
    if (score >= 6) return { level: 'Medium', color: chartColors.medium };
    return { level: 'Low', color: chartColors.low };
  };
  
  const riskSeverity = getRiskSeverity(riskScore);
  
  // Risk categories with icons
  const categories = [
    { value: 'Technical', icon: 'bi-gear' },
    { value: 'Schedule', icon: 'bi-calendar' },
    { value: 'Cost', icon: 'bi-currency-dollar' },
    { value: 'Scope', icon: 'bi-arrows-fullscreen' },
    { value: 'Resource', icon: 'bi-person-gear' },
    { value: 'Quality', icon: 'bi-stars' },
    { value: 'Stakeholder', icon: 'bi-people' },
    { value: 'External', icon: 'bi-globe' },
    { value: 'Other', icon: 'bi-three-dots' }
  ];
  
  // Risk statuses with icons
  const statuses = [
    { value: 'Identified', icon: 'bi-eye' },
    { value: 'Assessed', icon: 'bi-clipboard-data' },
    { value: 'Mitigated', icon: 'bi-shield-check' },
    { value: 'Accepted', icon: 'bi-check-circle' },
    { value: 'Closed', icon: 'bi-archive' }
  ];
  
  // Team members (would come from API in a real app)
  const teamMembers = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ];
  
  // Initialize form if editing
  useEffect(() => {
    if (mode === 'edit' && risk) {
      setFormData({
        ...risk,
        owner: risk.owner ? risk.owner.id : '',
        triggers: risk.triggers || []
      });
    }
  }, [mode, risk]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle trigger input
  const handleAddTrigger = () => {
    if (newTrigger.trim()) {
      setFormData({
        ...formData,
        triggers: [...formData.triggers, newTrigger.trim()]
      });
      setNewTrigger('');
    }
  };
  
  // Remove a trigger
  const handleRemoveTrigger = (index) => {
    const updatedTriggers = [...formData.triggers];
    updatedTriggers.splice(index, 1);
    setFormData({ ...formData, triggers: updatedTriggers });
  };
  
  // Handle key press for trigger input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && newTrigger.trim()) {
      e.preventDefault();
      handleAddTrigger();
    }
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = {};
    if (!formData.title) validationErrors.title = 'Title is required';
    if (!formData.description) validationErrors.description = 'Description is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Format data and submit
    const submitData = {
      ...formData,
      probability: parseInt(formData.probability),
      impact: parseInt(formData.impact)
    };
    
    onSubmit(submitData);
  };
  
  return (
    <div className="risk-form dashboard-card">
      <div className="card-header">
        <h5 className="dashboard-section-title mb-0">
          <i className={`bi ${mode === 'create' ? 'bi-plus-shield' : 'bi-pencil-square'} me-2`}></i>
          {mode === 'create' ? 'Create New Risk' : 'Update Risk'}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Risk Score Visual Indicator */}
          <div className="risk-score-indicator mb-4 p-3 rounded-3" style={{ 
            backgroundColor: `rgba(${safeHexToRgb(riskSeverity.color)}, 0.1)`,
            border: `1px solid rgba(${safeHexToRgb(riskSeverity.color)}, 0.3)`
          }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 style={{ color: riskSeverity.color }} className="mb-1">Risk Score</h6>
                <div className="d-flex align-items-center">
                  <div className="badge me-2 fs-5" style={{ backgroundColor: riskSeverity.color }}>
                    {riskScore}
                  </div>
                  <span className="fw-bold" style={{ color: riskSeverity.color }}>
                    {riskSeverity.level} Risk
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="text-center mx-2">
                  <div className="small text-muted mb-1">Probability</div>
                  <div className="badge" style={{ 
                    backgroundColor: chartColors.tertiary,
                    fontSize: '1rem'
                  }}>{formData.probability}/5</div>
                </div>
                <div className="text-center ms-3">
                  <div className="small text-muted mb-1">Impact</div>
                  <div className="badge" style={{ 
                    backgroundColor: chartColors.secondary,
                    fontSize: '1rem'
                  }}>{formData.impact}/5</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-8">
              <label htmlFor="title" className="form-label d-flex align-items-center">
                <i className="bi bi-type-bold me-2" style={{ color: chartColors.primary }}></i>
                Risk Title <span className="text-danger ms-1">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a clear, concise risk title"
                required
                style={{ 
                  borderColor: errors.title ? '' : `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                  boxShadow: 'none'
                }}
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="category" className="form-label d-flex align-items-center">
                <i className="bi bi-tag me-2" style={{ color: chartColors.primary }}></i>
                Category <span className="text-danger ms-1">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className={`bi ${categories.find(c => c.value === formData.category)?.icon}`} style={{ color: chartColors.primary }}></i>
                </span>
                <select
                  className="form-select"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    borderLeft: 0,
                    borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                    boxShadow: 'none'
                  }}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label d-flex align-items-center">
              <i className="bi bi-card-text me-2" style={{ color: chartColors.primary }}></i>
              Description <span className="text-danger ms-1">*</span>
            </label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Detailed description of the risk and its potential impact"
              style={{ 
                borderColor: errors.description ? '' : `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                boxShadow: 'none'
              }}
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="probability" className="form-label d-flex align-items-center">
                <i className="bi bi-graph-up me-2" style={{ color: chartColors.primary }}></i>
                Probability (1-5) <span className="text-danger ms-1">*</span>
              </label>
              <select
                className="form-select"
                id="probability"
                name="probability"
                value={formData.probability}
                onChange={handleInputChange}
                required
                style={{ 
                  borderColor: `rgba(${safeHexToRgb(chartColors.tertiary)}, 0.5)`,
                  boxShadow: 'none'
                }}
              >
                <option value="1">1 - Very Low</option>
                <option value="2">2 - Low</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Very High</option>
              </select>
              <div className="mt-2">
                <div className="progress" style={{ height: '8px' }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <div 
                      key={val}
                      className="progress-bar" 
                      style={{ 
                        width: '20%', 
                        backgroundColor: val <= formData.probability ? chartColors.tertiary : `rgba(${safeHexToRgb(chartColors.tertiary)}, 0.2)`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="impact" className="form-label d-flex align-items-center">
                <i className="bi bi-lightning-charge me-2" style={{ color: chartColors.primary }}></i>
                Impact (1-5) <span className="text-danger ms-1">*</span>
              </label>
              <select
                className="form-select"
                id="impact"
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
                required
                style={{ 
                  borderColor: `rgba(${safeHexToRgb(chartColors.secondary)}, 0.5)`,
                  boxShadow: 'none'
                }}
              >
                <option value="1">1 - Minimal</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Major</option>
                <option value="5">5 - Severe</option>
              </select>
              <div className="mt-2">
                <div className="progress" style={{ height: '8px' }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <div 
                      key={val}
                      className="progress-bar" 
                      style={{ 
                        width: '20%', 
                        backgroundColor: val <= formData.impact ? chartColors.secondary : `rgba(${safeHexToRgb(chartColors.secondary)}, 0.2)`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="status" className="form-label d-flex align-items-center">
                <i className="bi bi-flag me-2" style={{ color: chartColors.primary }}></i>
                Status <span className="text-danger ms-1">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className={`bi ${statuses.find(s => s.value === formData.status)?.icon}`} style={{ color: chartColors.primary }}></i>
                </span>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    borderLeft: 0,
                    borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                    boxShadow: 'none'
                  }}
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="owner" className="form-label d-flex align-items-center">
                <i className="bi bi-person me-2" style={{ color: chartColors.primary }}></i>
                Risk Owner
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person-fill" style={{ color: chartColors.primary }}></i>
                </span>
                <select
                  className="form-select"
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleInputChange}
                  style={{ 
                    borderLeft: 0,
                    borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                    boxShadow: 'none'
                  }}
                >
                  <option value="">Select Owner</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>{member.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="reviewDate" className="form-label d-flex align-items-center">
                <i className="bi bi-calendar-check me-2" style={{ color: chartColors.primary }}></i>
                Review Date
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-calendar3" style={{ color: chartColors.primary }}></i>
                </span>
                <input
                  type="date"
                  className="form-control"
                  id="reviewDate"
                  name="reviewDate"
                  value={formData.reviewDate}
                  onChange={handleInputChange}
                  style={{ 
                    borderLeft: 0,
                    borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                    boxShadow: 'none'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="mitigationPlan" className="form-label d-flex align-items-center">
              <i className="bi bi-shield me-2" style={{ color: chartColors.primary }}></i>
              Mitigation Plan
            </label>
            <textarea
              className="form-control"
              id="mitigationPlan"
              name="mitigationPlan"
              rows="2"
              value={formData.mitigationPlan}
              onChange={handleInputChange}
              placeholder="Actions to reduce probability or impact of the risk"
              style={{ 
                borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                boxShadow: 'none'
              }}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="contingencyPlan" className="form-label d-flex align-items-center">
              <i className="bi bi-life-preserver me-2" style={{ color: chartColors.primary }}></i>
              Contingency Plan
            </label>
            <textarea
              className="form-control"
              id="contingencyPlan"
              name="contingencyPlan"
              rows="2"
              value={formData.contingencyPlan}
              onChange={handleInputChange}
              placeholder="Actions to take if the risk materializes"
              style={{ 
                borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                boxShadow: 'none'
              }}
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label className="form-label d-flex align-items-center">
              <i className="bi bi-bell me-2" style={{ color: chartColors.primary }}></i>
              Triggers / Early Warning Signs
            </label>
            <div className="input-group mb-2">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-exclamation-diamond" style={{ color: chartColors.tertiary }}></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Add a trigger or early warning sign"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ 
                  borderLeft: 0,
                  borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                  boxShadow: 'none'
                }}
              />
              <button
                type="button"
                className="btn btn-outline-primary rounded-end"
                onClick={handleAddTrigger}
                style={{ borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)` }}
              >
                <i className="bi bi-plus-lg me-1"></i> Add
              </button>
            </div>
            
            {formData.triggers.length > 0 ? (
              <ul className="list-group" style={{ borderRadius: '0.5rem' }}>
                {formData.triggers.map((trigger, index) => (
                  <li 
                    key={index} 
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ 
                      borderColor: `rgba(${safeHexToRgb(chartColors.quaternary)}, 0.3)`,
                      backgroundColor: index % 2 === 0 ? `rgba(${safeHexToRgb(chartColors.quaternary)}, 0.05)` : 'transparent'
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-arrow-right-circle me-2" style={{ color: chartColors.tertiary }}></i>
                      {trigger}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger rounded-pill"
                      onClick={() => handleRemoveTrigger(index)}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div 
                className="alert py-2" 
                style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(chartColors.quaternary)}, 0.1)`,
                  border: `1px solid rgba(${safeHexToRgb(chartColors.quaternary)}, 0.2)`,
                  color: chartColors.primary
                }}
              >
                <i className="bi bi-info-circle me-2"></i>
                No triggers added. Triggers help identify when a risk is about to materialize.
              </div>
            )}
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary me-2 rounded-pill"
              onClick={onCancel}
            >
              <i className="bi bi-x-lg me-1"></i> Cancel
            </button>
            <button type="submit" className="btn btn-primary rounded-pill">
              <i className={`bi ${mode === 'create' ? 'bi-plus-lg' : 'bi-check-lg'} me-1`}></i>
              {mode === 'create' ? 'Create Risk' : 'Update Risk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RiskForm;
