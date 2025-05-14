import React, { useState, useEffect } from 'react';
import moment from 'moment';

function ResourceAvailabilityForm({ event, date, resources, onSave, onCancel }) {
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
  
  const [formData, setFormData] = useState({
    resourceId: '',
    title: '',
    start: date ? moment(date.start).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
    end: date ? moment(date.end).format('YYYY-MM-DD') : moment().add(1, 'days').format('YYYY-MM-DD'),
    allDay: true,
    type: 'allocation', // 'allocation' or 'unavailable'
    allocationPercentage: 100,
    project: null,
    reason: '',
  });
  
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);
  
  // Load projects (in a real app, this would fetch from API)
  useEffect(() => {
    // Mock data - in real app, this would be an API call
    const projectData = [
      { id: 101, name: 'Project Alpha' },
      { id: 102, name: 'Project Beta' },
      { id: 103, name: 'Project Gamma' },
      { id: 104, name: 'Project Delta' }
    ];
    
    setProjects(projectData);
  }, []);
  
  // Populate form when editing an existing event
  useEffect(() => {
    if (event) {
      setFormData({
        resourceId: event.resourceId,
        title: event.title,
        start: moment(event.start).format('YYYY-MM-DD'),
        end: moment(event.end).format('YYYY-MM-DD'),
        allDay: event.allDay,
        type: event.type,
        allocationPercentage: event.allocationPercentage || 100,
        project: event.project || null,
        reason: event.reason || '',
      });
    }
  }, [event]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle project selection
  const handleProjectSelect = (e) => {
    const projectId = parseInt(e.target.value);
    if (projectId) {
      const selectedProject = projects.find(p => p.id === projectId);
      setFormData(prev => ({
        ...prev,
        project: selectedProject,
        title: selectedProject.name
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        project: null,
        title: ''
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.resourceId) newErrors.resourceId = 'Resource is required';
    if (formData.type === 'allocation') {
      if (!formData.project) newErrors.project = 'Project is required';
      if (!formData.allocationPercentage) newErrors.allocationPercentage = 'Allocation percentage is required';
    } else if (formData.type === 'unavailable') {
      if (!formData.reason) newErrors.reason = 'Reason is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Convert dates back to Date objects for Calendar component
    const savedData = {
      ...formData,
      resourceId: parseInt(formData.resourceId),
      allocationPercentage: parseInt(formData.allocationPercentage),
      start: new Date(formData.start),
      end: new Date(formData.end)
    };
    
    onSave(savedData);
  };

  const getBorderColor = () => {
    if (formData.type === 'allocation') {
      return `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)`;
    } else {
      return `1px solid rgba(${safeHexToRgb(purpleColors.accent2)}, 0.2)`;
    }
  };
  
  const getTypeColor = (type) => {
    return type === 'allocation' ? purpleColors.primary : purpleColors.accent2;
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 pb-3" style={{ 
        borderBottom: getBorderColor(),
        position: 'relative'
      }}>
        <h6 className="mb-3 text-muted">Resource Details</h6>
        
        <div className="mb-3">
          <label htmlFor="resourceId" className="form-label">Resource <span className="text-danger">*</span></label>
          <div className="input-group">
            <span className="input-group-text" style={{ color: purpleColors.primary }}>
              <i className="bi bi-person"></i>
            </span>
            <select
              id="resourceId"
              name="resourceId"
              className={`form-select ${errors.resourceId ? 'is-invalid' : ''}`}
              value={formData.resourceId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Resource</option>
              {resources.map(resource => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} - {resource.role}
                </option>
              ))}
            </select>
            {errors.resourceId && <div className="invalid-feedback">{errors.resourceId}</div>}
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type <span className="text-danger">*</span></label>
          <div className="d-flex">
            <div className="form-check me-3">
              <input
                type="radio"
                id="typeAllocation"
                name="type"
                className="form-check-input"
                value="allocation"
                checked={formData.type === 'allocation'}
                onChange={handleInputChange}
                style={{ borderColor: purpleColors.primary }}
              />
              <label 
                className="form-check-label" 
                htmlFor="typeAllocation"
                style={{ 
                  color: formData.type === 'allocation' ? purpleColors.primary : 'inherit',
                  fontWeight: formData.type === 'allocation' ? '500' : 'normal'
                }}
              >
                <i className="bi bi-briefcase me-1"></i> Project Allocation
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="typeUnavailable"
                name="type"
                className="form-check-input"
                value="unavailable"
                checked={formData.type === 'unavailable'}
                onChange={handleInputChange}
                style={{ borderColor: purpleColors.accent2 }}
              />
              <label 
                className="form-check-label" 
                htmlFor="typeUnavailable"
                style={{ 
                  color: formData.type === 'unavailable' ? purpleColors.accent2 : 'inherit',
                  fontWeight: formData.type === 'unavailable' ? '500' : 'normal'
                }}
              >
                <i className="bi bi-calendar-x me-1"></i> Unavailability
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conditional section based on type */}
      <div className="mb-4 pb-3" style={{ 
        borderBottom: getBorderColor(),
        position: 'relative'
      }}>
        <h6 className="mb-3 text-muted">
          {formData.type === 'allocation' ? 'Project Details' : 'Unavailability Details'}
        </h6>
        
        {formData.type === 'allocation' ? (
          <>
            <div className="mb-3">
              <label htmlFor="project" className="form-label">Project <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-briefcase"></i>
                </span>
                <select
                  id="project"
                  name="project"
                  className={`form-select ${errors.project ? 'is-invalid' : ''}`}
                  value={formData.project ? formData.project.id : ''}
                  onChange={handleProjectSelect}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.project && <div className="invalid-feedback">{errors.project}</div>}
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="allocationPercentage" className="form-label">Allocation Percentage <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-percent"></i>
                </span>
                <input
                  type="number"
                  id="allocationPercentage"
                  name="allocationPercentage"
                  className={`form-control ${errors.allocationPercentage ? 'is-invalid' : ''}`}
                  value={formData.allocationPercentage}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  required
                />
                <span className="input-group-text">%</span>
                {errors.allocationPercentage && (
                  <div className="invalid-feedback d-block">{errors.allocationPercentage}</div>
                )}
              </div>
              <div className="progress progress-thin mt-2">
                <div 
                  className="progress-bar" 
                  role="progressbar"
                  style={{ 
                    width: `${formData.allocationPercentage}%`,
                    backgroundColor: formData.allocationPercentage > 75 ? purpleColors.primary : purpleColors.tertiary 
                  }}
                  aria-valuenow={formData.allocationPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </>
        ) : (
          <div className="mb-3">
            <label htmlFor="reason" className="form-label">Reason <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text" style={{ color: purpleColors.accent2 }}>
                <i className="bi bi-info-circle"></i>
              </span>
              <input
                type="text"
                id="reason"
                name="reason"
                className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Vacation, Training, etc."
                required
              />
              {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
            </div>
            <small className="text-muted">Specify the reason for unavailability (e.g., vacation, training, sick leave)</small>
          </div>
        )}
      </div>
      
      {/* Date section */}
      <div className="mb-4">
        <h6 className="mb-3 text-muted">Date & Time</h6>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="start" className="form-label">Start Date <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text" style={{ color: getTypeColor(formData.type) }}>
                <i className="bi bi-calendar-event"></i>
              </span>
              <input
                type="date"
                id="start"
                name="start"
                className="form-control"
                value={formData.start}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="col-md-6 mb-3">
            <label htmlFor="end" className="form-label">End Date <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text" style={{ color: getTypeColor(formData.type) }}>
                <i className="bi bi-calendar-check"></i>
              </span>
              <input
                type="date"
                id="end"
                name="end"
                className="form-control"
                value={formData.end}
                onChange={handleInputChange}
                required
              />
            </div>
            <small className="text-muted">
              Duration: {moment(formData.end).diff(moment(formData.start), 'days') + 1} days
            </small>
          </div>
        </div>
        
        <div className="mb-3 form-check" style={{ marginLeft: '8px' }}>
          <input
            type="checkbox"
            id="allDay"
            name="allDay"
            className="form-check-input"
            checked={formData.allDay}
            onChange={handleInputChange}
            style={{ borderColor: purpleColors.primary }}
          />
          <label className="form-check-label" htmlFor="allDay">All Day</label>
        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-4">
        <button 
          type="button" 
          className="btn btn-outline-secondary rounded-pill me-2" 
          onClick={onCancel}
        >
          <i className="bi bi-x-circle me-1"></i> Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary rounded-pill"
          style={{ backgroundColor: getTypeColor(formData.type), borderColor: getTypeColor(formData.type) }}
        >
          <i className="bi bi-check-circle me-1"></i> Save {formData.type === 'allocation' ? 'Allocation' : 'Unavailability'}
        </button>
      </div>
    </form>
  );
}

export default ResourceAvailabilityForm;
