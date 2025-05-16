import React, { useState, useEffect } from 'react';

function RiskForm({ risk, onSubmit, onCancel, projectId, projects = [], users = [] }) {
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
    project_id: projectId || '',
    category: 'Technical',
    probability: 3,
    impact: 3,
    status: 'Identified',
    owner_id: '',
    mitigation_plan: '',
    contingency_plan: '',
    triggers: [],
    identified_date: new Date().toISOString().split('T')[0],
    review_date: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [newTrigger, setNewTrigger] = useState('');
  
  // Calculate risk score
  const riskScore = formData.probability * formData.impact;
  
  // Initialize form data from existing risk if editing
  useEffect(() => {
    if (risk && risk.id) {
      // Convert backend data structure to form structure
      setFormData({
        title: risk.title || '',
        description: risk.description || '',
        project_id: risk.project_id || projectId || '',
        category: risk.category || 'Technical',
        probability: risk.probability || 3,
        impact: risk.impact || 3,
        status: risk.status || 'Identified',
        owner_id: risk.owner_id || '',
        mitigation_plan: risk.mitigation_plan || '',
        contingency_plan: risk.contingency_plan || '',
        triggers: risk.triggers || [],
        identified_date: risk.identified_date || new Date().toISOString().split('T')[0],
        review_date: risk.review_date || ''
      });
    } else {
      // For new risks, make sure project_id is set from the projectId prop
      setFormData(prev => ({
        ...prev,
        project_id: projectId || ''
      }));
    }
  }, [risk, projectId]);
  
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
  
  // Handle basic form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation errors when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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
  
  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API - ensure probability, impact, owner_id and project_id are correctly formatted
      const riskData = {
        ...formData,
        probability: Number(formData.probability),
        impact: Number(formData.impact),
        // Ensure owner_id is a number or null
        owner_id: formData.owner_id ? Number(formData.owner_id) : null,
        // Ensure project_id is passed correctly - convert to number if needed
        project_id: formData.project_id ? Number(formData.project_id) : null,
        // Include calculated risk score
        risk_score: Number(formData.probability) * Number(formData.impact)
      };

      console.log("Submitting risk data:", riskData);
      
      // Additional validation
      if (!riskData.project_id) {
        setErrors({ submit: 'A project must be selected to create a risk' });
        setIsSubmitting(false);
        return;
      }
      
      await onSubmit(riskData);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting risk:', error);
      setErrors({ submit: error.message || 'Failed to save risk' });
      setIsSubmitting(false);
    }
  };
  
  // Determine risk severity level based on calculated score
  const getRiskSeverity = (score) => {
    if (score >= 16) return { level: 'Critical', color: chartColors.critical };
    if (score >= 11) return { level: 'High', color: chartColors.high };
    if (score >= 6) return { level: 'Medium', color: chartColors.medium };
    return { level: 'Low', color: chartColors.low };
  };
  
  const riskSeverity = getRiskSeverity(riskScore);
  
  return (
    <div className="risk-form dashboard-card">
      <div className="card-header">
        <h5 className="dashboard-section-title mb-0">
          <i className={`bi ${risk && risk.id ? 'bi-pencil-square' : 'bi-plus-shield'} me-2`}></i>
          {risk && risk.id ? 'Update Risk' : 'Create New Risk'}
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
              <label htmlFor="title" className="form-label">
                Risk Title <span className="text-danger">*</span>
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
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>
            <div className="col-md-4">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.value}</option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>
          </div>
          
          {/* Add project selection when not in project context or always show it for debugging */}
          <div className="mb-3">
            <label htmlFor="project_id" className="form-label">
              Project <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text" style={{ color: chartColors.primary }}>
                <i className="bi bi-briefcase"></i>
              </span>
              <select
                className={`form-select ${errors.project_id ? 'is-invalid' : ''}`}
                id="project_id"
                name="project_id"
                value={formData.project_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.title}</option>
                ))}
              </select>
              {errors.project_id && <div className="invalid-feedback">{errors.project_id}</div>}
            </div>
            {formData.project_id && <div className="form-text">Selected Project ID: {formData.project_id}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the risk and its potential impact"
              required
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>
          
          <div className="row mb-4">
            <div className="col-md-4">
              <label htmlFor="probability" className="form-label">
                Probability (1-5) <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="probability"
                name="probability"
                value={formData.probability}
                onChange={handleInputChange}
                required
              >
                <option value="1">1 - Very Low</option>
                <option value="2">2 - Low</option>
                <option value="3">3 - Medium</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Very High</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="impact" className="form-label">
                Impact (1-5) <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="impact"
                name="impact"
                value={formData.impact}
                onChange={handleInputChange}
                required
              >
                <option value="1">1 - Minimal</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Major</option>
                <option value="5">5 - Severe</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="status" className="form-label">
                Status <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.value}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="owner_id" className="form-label">Risk Owner</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-person" style={{ color: chartColors.primary }}></i>
                </span>
                <select
                  className="form-select"
                  id="owner_id"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleInputChange}
                  style={{ 
                    borderLeft: 0,
                    borderColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.3)`,
                    boxShadow: 'none'
                  }}
                >
                  <option value="">Select Owner</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="review_date" className="form-label">Review Date</label>
              <input
                type="date"
                className="form-control"
                id="review_date"
                name="review_date"
                value={formData.review_date}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="mitigation_plan" className="form-label">Mitigation Plan</label>
            <textarea
              className="form-control"
              id="mitigation_plan"
              name="mitigation_plan"
              rows="2"
              value={formData.mitigation_plan}
              onChange={handleInputChange}
              placeholder="Actions to reduce probability or impact of the risk"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label htmlFor="contingency_plan" className="form-label">Contingency Plan</label>
            <textarea
              className="form-control"
              id="contingency_plan"
              name="contingency_plan"
              rows="2"
              value={formData.contingency_plan}
              onChange={handleInputChange}
              placeholder="Actions to take if the risk materializes"
            ></textarea>
          </div>
          
          <div className="mb-3">
            <label className="form-label">
              Triggers / Early Warning Signs
            </label>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Add a trigger or early warning sign"
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAddTrigger}
              >
                <i className="bi bi-plus-lg"></i> Add
              </button>
            </div>
            
            {formData.triggers.length > 0 ? (
              <ul className="list-group">
                {formData.triggers.map((trigger, index) => (
                  <li 
                    key={index} 
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <i className="bi bi-arrow-right-circle me-2"></i>
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
              <div className="text-muted small">
                <i className="bi bi-info-circle me-1"></i>
                No triggers added. Triggers help identify when a risk is about to materialize.
              </div>
            )}
          </div>
          
          <div className="d-flex justify-content-end mt-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary me-2"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {risk && risk.id ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <i className={`bi ${risk && risk.id ? 'bi-check-lg' : 'bi-plus-lg'} me-1`}></i>
                  {risk && risk.id ? 'Update Risk' : 'Create Risk'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RiskForm;
