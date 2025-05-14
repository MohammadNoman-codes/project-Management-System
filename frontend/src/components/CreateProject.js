import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ProjectTemplates from './ProjectTemplates';
import projectService from '../services/projectService';

function CreateProject({ onClose }) {
  // Purple-themed color palette to match Dashboard
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
  
  const history = useHistory();
  const [step, setStep] = useState(1);
  const [useTemplate, setUseTemplate] = useState(true);
  const [project, setProject] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    objectives: '',
    scope: '',
    budget: {
      estimated: 0,
      currency: 'BHD'
    },
    team: [],
    stakeholders: [],
    milestones: []
  });
  
  const handleTemplateSelection = (template) => {
    // Convert template milestones to project milestones format
    const milestones = template.milestones.map((milestone, index) => {
      // Calculate approximate dates based on duration
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (index > 0 ? 14 * index : 0)); // 2 weeks per previous milestone
      
      // Extract weeks from duration string
      const durationWeeks = parseInt(milestone.duration.split(' ')[0]);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (durationWeeks * 7));
      
      return {
        name: milestone.name,
        status: 'Not Started',
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        // Convert processes to tasks
        tasks: milestone.processes.map(process => ({
          name: process,
          description: `Task for ${process}`,
          status: 'Not Started',
          priority: 'Medium',
          start_date: startDate.toISOString().split('T')[0],
          due_date: new Date(startDate.getTime() + (durationWeeks * 7 * 24 * 60 * 60 * 1000) / milestone.processes.length).toISOString().split('T')[0]
        }))
      };
    });
    
    setProject({
      ...project,
      milestones
    });
    setStep(2);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1];
      setProject({
        ...project,
        budget: {
          ...project.budget,
          [budgetField]: value
        }
      });
    } else {
      setProject({
        ...project,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Show loading state
    setIsSubmitting(true);
    
    try {
      // Prepare the project data in the format expected by the API
      const projectData = {
        title: project.title,
        description: project.description,
        status: 'Not Started',
        start_date: project.startDate,
        end_date: project.endDate,
        budget_estimated: parseFloat(project.budget.estimated) || 0,
        budget_actual: 0, // Starting with 0 actual budget
        budget_currency: project.budget.currency,
        objectives: project.objectives,
        scope: project.scope,
        milestones: project.milestones.map(milestone => ({
          name: milestone.name,
          status: milestone.status,
          start_date: milestone.start_date,
          end_date: milestone.end_date,
          tasks: milestone.tasks
        }))
      };
      
      // Call the API to create the project with milestones and tasks
      const response = await projectService.createProjectWithDetails(projectData);
      
      // Show success message
      setCreateSuccess(true);
      
      // If we're in a modal, close it after a short delay
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Otherwise navigate to projects after a short delay
        setTimeout(() => {
          history.push('/projects');
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setCreateError('Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add these state variables at the top with the other state variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [createError, setCreateError] = useState(null);
  
  const handleSkipTemplate = () => {
    setUseTemplate(false);
    setStep(2);
  };

  return (
    <div className={onClose ? '' : 'container my-4'}>
      {!onClose && <h2 className="fw-bold mb-4">Create New Project</h2>}
      
      {/* Modern step indicator */}
      <div className="d-flex justify-content-between mb-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="step-item" style={{ flex: 1, textAlign: 'center' }}>
            <div className="d-inline-flex justify-content-center align-items-center rounded-circle" 
              style={{ 
                width: '36px', 
                height: '36px', 
                backgroundColor: step >= stepNumber ? purpleColors.primary : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)`,
                color: step >= stepNumber ? 'white' : '#6c757d',
                transition: 'all 0.3s ease'
              }}>
              {step > stepNumber ? (
                <i className="bi bi-check-lg"></i>
              ) : (
                stepNumber
              )}
            </div>
            <div className="small mt-1" style={{ color: step >= stepNumber ? purpleColors.primary : '#6c757d' }}>
              {stepNumber === 1 ? 'Template' : stepNumber === 2 ? 'Details' : 'Review'}
            </div>
            {stepNumber < 3 && (
              <div className="progress-line" 
                style={{ 
                  height: '3px', 
                  flex: 1, 
                  backgroundColor: step > stepNumber ? purpleColors.primary : `rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)`,
                  margin: '20px 0'
                }}></div>
            )}
          </div>
        ))}
      </div>
      
      {step === 1 && (
        <div className="dashboard-card">
          <div className="card-header">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-grid-3x3-gap me-2"></i>Choose Template
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="templateOption" 
                  id="useTemplate" 
                  checked={useTemplate} 
                  onChange={() => setUseTemplate(true)}
                  style={{ borderColor: purpleColors.primary }}
                />
                <label className="form-check-label" htmlFor="useTemplate">
                  Use a template
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="templateOption" 
                  id="startEmpty" 
                  checked={!useTemplate} 
                  onChange={() => setUseTemplate(false)}
                  style={{ borderColor: purpleColors.primary }}
                />
                <label className="form-check-label" htmlFor="startEmpty">
                  Start from scratch
                </label>
              </div>
            </div>
            
            {useTemplate ? (
              <ProjectTemplates onSelectTemplate={handleTemplateSelection} purpleColors={purpleColors} />
            ) : (
              <div className="text-center my-4">
                <div className="empty-state py-4">
                  <i className="bi bi-file-earmark-plus fs-1" style={{ color: purpleColors.primary }}></i>
                  <p className="mt-3">You'll create your project structure from scratch.</p>
                  <button 
                    className="btn btn-primary rounded-pill mt-2" 
                    onClick={() => setStep(2)}
                    style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
                  >
                    <i className="bi bi-arrow-right me-1"></i> Continue
                  </button>
                </div>
              </div>
            )}
            
            {useTemplate && (
              <div className="text-center mt-3">
                <button 
                  className="btn btn-link" 
                  onClick={handleSkipTemplate}
                  style={{ color: purpleColors.secondary }}
                >
                  Skip template selection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {step === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-info-circle me-2"></i>Basic Information
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Project Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="title" 
                  name="title"
                  value={project.title} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  id="description" 
                  name="description"
                  value={project.description} 
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-calendar3"></i>
                    </span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="startDate" 
                      name="startDate"
                      value={project.startDate} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-calendar3-event"></i>
                    </span>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="endDate" 
                      name="endDate"
                      value={project.endDate} 
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-bullseye me-2"></i>Project Definition
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="objectives" className="form-label">Objectives (SMART Goals)</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: purpleColors.primary }}>
                    <i className="bi bi-check2-square"></i>
                  </span>
                  <textarea 
                    className="form-control" 
                    id="objectives" 
                    name="objectives"
                    value={project.objectives} 
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Specific, Measurable, Achievable, Relevant, Time-bound objectives"
                  ></textarea>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="scope" className="form-label">Project Scope</label>
                <div className="input-group">
                  <span className="input-group-text" style={{ color: purpleColors.primary }}>
                    <i className="bi bi-bounding-box"></i>
                  </span>
                  <textarea 
                    className="form-control" 
                    id="scope" 
                    name="scope"
                    value={project.scope} 
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Define what is in scope and out of scope for this project"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-cash-coin me-2"></i>Budget Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="budgetEstimated" className="form-label">Estimated Budget</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-currency-dollar"></i>
                    </span>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="budgetEstimated" 
                      name="budget.estimated"
                      value={project.budget.estimated} 
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="budgetCurrency" className="form-label">Currency</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ color: purpleColors.primary }}>
                      <i className="bi bi-cash"></i>
                    </span>
                    <select 
                      className="form-select" 
                      id="budgetCurrency" 
                      name="budget.currency"
                      value={project.budget.currency} 
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="JPY">JPY</option>
                      <option value="BHD">BHD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary rounded-pill me-2" 
              onClick={() => setStep(1)}
            >
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
            <button 
              type="submit" 
              className="btn btn-primary rounded-pill"
              style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
            >
              Continue <i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </form>
      )}
      
      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-people me-2"></i>Team Members & Stakeholders
              </h5>
            </div>
            <div className="card-body">
              <div className="empty-state py-3 text-center mb-2">
                <i className="bi bi-person-plus fs-2" style={{ color: purpleColors.primary }}></i>
                <p className="mt-2">You'll be able to add team members and stakeholders after creating the project.</p>
              </div>
              
              <div className="mt-3 p-3" style={{ backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.05)`, borderRadius: '8px' }}>
                <h6 className="fw-bold mb-3">Default Project Roles:</h6>
                <div className="row">
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                        color: purpleColors.primary,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                      }}>
                        PM
                      </div>
                      <span>Project Manager</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(purpleColors.secondary)}, 0.1)`,
                        color: purpleColors.secondary,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                      }}>
                        TM
                      </div>
                      <span>Team Member</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
                        color: purpleColors.tertiary,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                      }}>
                        SH
                      </div>
                      <span>Stakeholder</span>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-2">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`,
                        color: purpleColors.quaternary,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                      }}>
                        CL
                      </div>
                      <span>Client</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-flag me-2"></i>Review Milestones
              </h5>
            </div>
            <div className="card-body">
              {project.milestones.length > 0 ? (
                <div className="table-responsive">
                  <table className="table dashboard-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.milestones.map((milestone, index) => (
                        <tr key={index}>
                          <td style={{ width: '40px' }}>
                            <div className="badge rounded-pill" style={{ backgroundColor: purpleColors.primary }}>
                              {index + 1}
                            </div>
                          </td>
                          <td>{milestone.name}</td>
                          <td>{milestone.startDate || 'Not set'}</td>
                          <td>{milestone.endDate || 'Not set'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state py-3 text-center">
                  <i className="bi bi-flag fs-2" style={{ color: purpleColors.primary }}></i>
                  <p className="mt-2">No milestones defined yet. You can add them after creating the project.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="dashboard-card mb-4">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-file-earmark-text me-2"></i>Project Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label fw-bold">Title:</label>
                <div className="col-sm-9">
                  <p className="form-control-plaintext">{project.title || 'Not specified'}</p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label fw-bold">Description:</label>
                <div className="col-sm-9">
                  <p className="form-control-plaintext">{project.description || 'Not specified'}</p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label fw-bold">Dates:</label>
                <div className="col-sm-9">
                  <p className="form-control-plaintext">
                    {project.startDate ? (
                      <><i className="bi bi-calendar3 me-2" style={{ color: purpleColors.primary }}></i>{project.startDate} to {project.endDate || 'TBD'}</>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label fw-bold">Budget:</label>
                <div className="col-sm-9">
                  <p className="form-control-plaintext">
                    {project.budget.estimated > 0 ? (
                      <><i className="bi bi-cash-coin me-2" style={{ color: purpleColors.primary }}></i>{project.budget.currency} {project.budget.estimated.toLocaleString()}</>
                    ) : (
                      'Not specified'
                    )}
                  </p>
                </div>
              </div>
              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label fw-bold">Milestones:</label>
                <div className="col-sm-9">
                  <p className="form-control-plaintext">
                    <i className="bi bi-flag me-2" style={{ color: purpleColors.primary }}></i>
                    {project.milestones.length} milestones planned
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-end">
            <button 
              type="button" 
              className="btn btn-outline-secondary rounded-pill me-2" 
              onClick={() => setStep(2)}
              disabled={isSubmitting}
            >
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>
            <button 
              type="submit" 
              className="btn btn-success rounded-pill"
              style={{ backgroundColor: purpleColors.accent1, borderColor: purpleColors.accent1 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1"></i> Create Project
                </>
              )}
            </button>
          </div>
        </form>
      )}
      
      {createSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          Project created successfully!
        </div>
      )}
      
      {createError && (
        <div className="alert alert-danger mt-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {createError}
        </div>
      )}
    </div>
  );
}

export default CreateProject;
