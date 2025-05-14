import React, { useState, useEffect } from 'react';

function StakeholderForm({ stakeholder, onSubmit, onCancel }) {
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
    
    // Functional colors
    completed: '#7986cb',    // Blue-ish purple for completed status
    inProgress: '#9575cd',   // Medium purple for in progress status
    review: '#5c6bc0',       // Blue-purple for review status
    todo: '#673ab7',         // Deep purple for todo status
    
    // Stakeholder-specific colors
    critical: '#8559da',     // Bright purple for critical priority
    high: '#9575cd',         // Medium purple for high priority
    medium: '#b39ddb',       // Lavender for medium priority
    low: '#d1c4e9',          // Very light purple for low priority
    supporter: '#7986cb',    // Blue-ish purple for supporter
    neutral: '#9d80c3',      // Light purple for neutral
    critic: '#8559da'        // Bright purple for critic
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

  const initialFormData = {
    id: '',
    name: '',
    organization: '',
    role: '',
    category: 'External',
    priority: 'Medium',
    influence: 3,
    interest: 3,
    supportLevel: 'Neutral',
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    },
    engagementStrategy: '',
    notes: '',
    lastContactDate: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (stakeholder) {
      setFormData({
        ...stakeholder,
        contactInfo: {
          ...initialFormData.contactInfo,
          ...(stakeholder.contactInfo || {})
        }
      });
    }
  }, [stakeholder]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    const requiredFields = ['name', 'organization', 'role', 'category', 'contactInfo.email'];
    const newTouched = { ...touched };
    
    requiredFields.forEach(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!formData[parent] || !formData[parent][child]) {
          newTouched[field] = true;
        }
      } else if (!formData[field]) {
        newTouched[field] = true;
      }
    });
    
    setTouched(newTouched);
    
    // Check if there are any validation errors
    const hasErrors = requiredFields.some(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return !formData[parent] || !formData[parent][child];
      }
      return !formData[field];
    });
    
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }
    
    // Submit the form
    onSubmit(formData);
    setIsSubmitting(false);
  };
  
  const isFieldInvalid = (name) => {
    if (!touched[name]) return false;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      return !formData[parent] || !formData[parent][child];
    }
    
    return !formData[name];
  };
  
  const getInfluenceColor = (level) => {
    if (level >= 4) return purpleColors.critical;
    if (level >= 3) return purpleColors.high;
    if (level >= 2) return purpleColors.medium;
    return purpleColors.low;
  };
  
  const getInterestColor = (level) => {
    if (level >= 4) return purpleColors.critical;
    if (level >= 3) return purpleColors.high;
    if (level >= 2) return purpleColors.medium;
    return purpleColors.low;
  };
  
  const getSupportLevelColor = (level) => {
    switch(level) {
      case 'Supporter': return purpleColors.supporter;
      case 'Neutral': return purpleColors.neutral;
      case 'Critic': return purpleColors.critic;
      default: return purpleColors.neutral;
    }
  };

  return (
    <div className="stakeholder-form">
      <form onSubmit={handleSubmit}>
        <div className="dashboard-card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-person-badge me-2"></i>Basic Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">
                  <i className="bi bi-person me-1" style={{ color: purpleColors.primary }}></i> Name*
                </label>
                <input
                  type="text"
                  className={`form-control ${isFieldInvalid('name') ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ borderColor: isFieldInvalid('name') ? '' : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                />
                {isFieldInvalid('name') && (
                  <div className="invalid-feedback">Name is required</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="organization" className="form-label">
                  <i className="bi bi-building me-1" style={{ color: purpleColors.primary }}></i> Organization*
                </label>
                <input
                  type="text"
                  className={`form-control ${isFieldInvalid('organization') ? 'is-invalid' : ''}`}
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  style={{ borderColor: isFieldInvalid('organization') ? '' : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                />
                {isFieldInvalid('organization') && (
                  <div className="invalid-feedback">Organization is required</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="role" className="form-label">
                  <i className="bi bi-briefcase me-1" style={{ color: purpleColors.primary }}></i> Role*
                </label>
                <input
                  type="text"
                  className={`form-control ${isFieldInvalid('role') ? 'is-invalid' : ''}`}
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ borderColor: isFieldInvalid('role') ? '' : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                />
                {isFieldInvalid('role') && (
                  <div className="invalid-feedback">Role is required</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="category" className="form-label">
                  <i className="bi bi-tags me-1" style={{ color: purpleColors.primary }}></i> Category*
                </label>
                <select
                  className={`form-select ${isFieldInvalid('category') ? 'is-invalid' : ''}`}
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ borderColor: isFieldInvalid('category') ? '' : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Client">Client</option>
                  <option value="Regulator">Regulator</option>
                  <option value="Community">Community</option>
                </select>
                {isFieldInvalid('category') && (
                  <div className="invalid-feedback">Category is required</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-envelope-paper me-2"></i>Contact Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="contactInfo.email" className="form-label">
                  <i className="bi bi-envelope me-1" style={{ color: purpleColors.primary }}></i> Email*
                </label>
                <input
                  type="email"
                  className={`form-control ${isFieldInvalid('contactInfo.email') ? 'is-invalid' : ''}`}
                  id="contactInfo.email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  style={{ borderColor: isFieldInvalid('contactInfo.email') ? '' : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                />
                {isFieldInvalid('contactInfo.email') && (
                  <div className="invalid-feedback">Email is required</div>
                )}
              </div>
              <div className="col-md-6">
                <label htmlFor="contactInfo.phone" className="form-label">
                  <i className="bi bi-telephone me-1" style={{ color: purpleColors.primary }}></i> Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                />
              </div>
              <div className="col-12">
                <label htmlFor="contactInfo.address" className="form-label">
                  <i className="bi bi-geo-alt me-1" style={{ color: purpleColors.primary }}></i> Address
                </label>
                <textarea
                  className="form-control"
                  id="contactInfo.address"
                  name="contactInfo.address"
                  value={formData.contactInfo.address}
                  onChange={handleChange}
                  rows="2"
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                ></textarea>
              </div>
              <div className="col-md-6">
                <label htmlFor="lastContactDate" className="form-label">
                  <i className="bi bi-calendar-date me-1" style={{ color: purpleColors.primary }}></i> Last Contact Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="lastContactDate"
                  name="lastContactDate"
                  value={formData.lastContactDate}
                  onChange={handleChange}
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-star me-2"></i>Stakeholder Assessment
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-4">
              <div className="col-md-6">
                <label htmlFor="priority" className="form-label">
                  <i className="bi bi-flag me-1" style={{ color: purpleColors.primary }}></i> Priority
                </label>
                <select
                  className="form-select"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="mt-2">
                  <span className="badge" style={{ 
                    backgroundColor: formData.priority === 'Critical' ? purpleColors.critical :
                                    formData.priority === 'High' ? purpleColors.high :
                                    formData.priority === 'Medium' ? purpleColors.medium :
                                    purpleColors.low
                  }}>
                    {formData.priority}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <label htmlFor="supportLevel" className="form-label">
                  <i className="bi bi-hand-thumbs-up me-1" style={{ color: purpleColors.primary }}></i> Support Level
                </label>
                <select
                  className="form-select"
                  id="supportLevel"
                  name="supportLevel"
                  value={formData.supportLevel}
                  onChange={handleChange}
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                >
                  <option value="Supporter">Supporter</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Critic">Critic</option>
                </select>
                <div className="mt-2">
                  <span className="badge" style={{ backgroundColor: getSupportLevelColor(formData.supportLevel) }}>
                    {formData.supportLevel}
                  </span>
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="influence" className="form-label d-flex justify-content-between">
                  <div><i className="bi bi-graph-up me-1" style={{ color: purpleColors.primary }}></i> Influence</div>
                  <div className="badge" style={{ backgroundColor: getInfluenceColor(formData.influence) }}>{formData.influence}/5</div>
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="influence"
                  name="influence"
                  min="1"
                  max="5"
                  value={formData.influence}
                  onChange={handleSliderChange}
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              
              <div className="col-md-6">
                <label htmlFor="interest" className="form-label d-flex justify-content-between">
                  <div><i className="bi bi-heart me-1" style={{ color: purpleColors.primary }}></i> Interest</div>
                  <div className="badge" style={{ backgroundColor: getInterestColor(formData.interest) }}>{formData.interest}/5</div>
                </label>
                <input
                  type="range"
                  className="form-range"
                  id="interest"
                  name="interest"
                  min="1"
                  max="5"
                  value={formData.interest}
                  onChange={handleSliderChange}
                />
                <div className="d-flex justify-content-between small text-muted">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-chat-square-text me-2"></i>Additional Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="engagementStrategy" className="form-label">
                  <i className="bi bi-diagram-3 me-1" style={{ color: purpleColors.primary }}></i> Engagement Strategy
                </label>
                <textarea
                  className="form-control"
                  id="engagementStrategy"
                  name="engagementStrategy"
                  value={formData.engagementStrategy}
                  onChange={handleChange}
                  rows="3"
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                  placeholder="Describe the strategy for engaging with this stakeholder"
                ></textarea>
              </div>
              <div className="col-12">
                <label htmlFor="notes" className="form-label">
                  <i className="bi bi-journal-text me-1" style={{ color: purpleColors.primary }}></i> Notes
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  style={{ borderColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.3)` }}
                  placeholder="Additional notes about this stakeholder"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-end gap-2 mb-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-outline-secondary rounded-pill"
            disabled={isSubmitting}
          >
            <i className="bi bi-x-circle me-1"></i> Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary rounded-pill"
            disabled={isSubmitting}
            style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
          >
            <i className="bi bi-save me-1"></i> {stakeholder?.id ? 'Update' : 'Save'} Stakeholder
          </button>
        </div>
      </form>
    </div>
  );
}

export default StakeholderForm;
