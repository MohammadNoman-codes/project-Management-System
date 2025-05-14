import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import projectService from '../services/projectService';

function Projects() {
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
    planned: '#9575cd',      // Medium purple for planned status
  };
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();
  
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
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const handleCreateProject = () => {
    history.push('/projects/new');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return purpleColors.completed;
      case 'In Progress': return purpleColors.inProgress;
      case 'Planned': return purpleColors.planned;
      default: return purpleColors.quaternary;
    }
  };
  
  const getCompletionColor = (completion) => {
    if (completion >= 100) return purpleColors.completed;
    if (completion >= 50) return purpleColors.inProgress;
    return purpleColors.planned;
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

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
        <button 
          className="btn btn-outline-danger mt-3"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Projects</h2>
        <div>
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-filter me-1"></i> Filter
          </button>
          <button 
            className="btn btn-primary rounded-pill" 
            onClick={handleCreateProject}
            style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
          >
            <i className="bi bi-plus-circle me-1"></i> New Project
          </button>
        </div>
      </div>
      
      <div className="row g-4">
        {projects.length > 0 ? (
          projects.map(project => (
            <div className="col-md-4 mb-3" key={project.id}>
              <div className="dashboard-card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">
                      <Link to={`/projects/${project.id}`} className="text-decoration-none" style={{ color: purpleColors.primary }}>
                        {project.title}
                      </Link>
                    </h5>
                    <span className="badge" style={{ 
                      backgroundColor: getStatusColor(project.status),
                      fontSize: '0.75rem',
                      padding: '0.35em 0.65em',
                    }}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-muted small mb-3" style={{ height: '3em', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">Completion</small>
                      <small style={{ color: getCompletionColor(project.completion) }}>
                        {project.completion}%
                      </small>
                    </div>
                    <div className="progress progress-thin">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ 
                          width: `${project.completion}%`,
                          backgroundColor: getCompletionColor(project.completion)
                        }} 
                        aria-valuenow={project.completion} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center small text-muted mb-4">
                    <div>
                      <i className="bi bi-calendar3 me-1"></i>
                      {project.start_date || project.startDate}
                    </div>
                    <div>
                      <i className="bi bi-calendar-check me-1"></i>
                      {project.end_date || project.endDate}
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-auto">
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
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}>
                        {project.manager?.name?.charAt(0) || 'M'}
                      </div>
                      <small>{project.manager?.name || 'Project Manager'}</small>
                    </div>
                    <Link 
                      to={`/projects/${project.id}`} 
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      style={{ 
                        borderColor: purpleColors.primary,
                        color: purpleColors.primary,
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem'
                      }}
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="bi bi-folder-x" style={{ fontSize: '3rem', color: purpleColors.quaternary }}></i>
            <h5 className="mt-3">No projects found</h5>
            <p className="text-muted">Create a new project to get started</p>
            <button 
              className="btn btn-primary mt-2 rounded-pill" 
              onClick={handleCreateProject}
              style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
            >
              <i className="bi bi-plus-circle me-1"></i> New Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
