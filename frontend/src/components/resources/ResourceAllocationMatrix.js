import React, { useState, useEffect } from 'react';

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

function ResourceAllocationMatrix() {
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [view, setView] = useState('resource'); // 'project' or 'resource'
  const [timeframe, setTimeframe] = useState('current');
  const [overallocationThreshold, setOverallocationThreshold] = useState(100);
  const [filterResourceType, setFilterResourceType] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterProject, setFilterProject] = useState('all');

  // Fetch data (in a real app, this would be API calls)
  useEffect(() => {
    // Mock data for resources
    const resourceData = [
      { id: 1, name: 'Mohammad', type: 'Human', department: 'Development', role: 'Senior Developer', avatar: 'https://via.placeholder.com/40' },
      { id: 2, name: 'Ali', type: 'Human', department: 'Design', role: 'UI/UX Designer', avatar: 'https://via.placeholder.com/40' },
      { id: 3, name: 'Ahmed', type: 'Human', department: 'Development', role: 'Backend Developer', avatar: 'https://via.placeholder.com/40' },
      { id: 4, name: 'Abdulla', type: 'Human', department: 'QA', role: 'Test Engineer', avatar: 'https://via.placeholder.com/40' },
      { id: 5, name: 'Mohammad', type: 'Human', department: 'Development', role: 'Frontend Developer', avatar: 'https://via.placeholder.com/40' },
      { id: 6, name: 'Server Cluster A', type: 'Equipment', department: 'IT', role: 'Server', avatar: 'https://via.placeholder.com/40' },
      { id: 7, name: 'Design Licenses', type: 'Software', department: 'Design', role: 'Software License', avatar: 'https://via.placeholder.com/40' }
    ];
    
    // Mock data for projects
    const projectData = [
      { id: 101, name: 'Project Alpha', startDate: '2023-01-01', endDate: '2023-06-30', status: 'In Progress' },
      { id: 102, name: 'Project Beta', startDate: '2023-02-15', endDate: '2023-08-31', status: 'In Progress' },
      { id: 103, name: 'Project Gamma', startDate: '2023-03-01', endDate: '2023-09-15', status: 'In Progress' },
      { id: 104, name: 'Project Delta', startDate: '2023-05-01', endDate: '2023-12-31', status: 'Not Started' }
    ];
    
    // Mock data for allocations
    const allocationData = [
      { id: 1, resourceId: 1, projectId: 101, percentage: 50, startDate: '2023-01-01', endDate: '2023-03-31' },
      { id: 2, resourceId: 1, projectId: 102, percentage: 50, startDate: '2023-02-15', endDate: '2023-04-30' },
      { id: 3, resourceId: 2, projectId: 101, percentage: 100, startDate: '2023-01-15', endDate: '2023-02-28' },
      { id: 4, resourceId: 2, projectId: 103, percentage: 80, startDate: '2023-03-01', endDate: '2023-05-31' },
      { id: 5, resourceId: 3, projectId: 102, percentage: 70, startDate: '2023-02-15', endDate: '2023-08-31' },
      { id: 6, resourceId: 4, projectId: 101, percentage: 60, startDate: '2023-04-01', endDate: '2023-06-30' },
      { id: 7, resourceId: 5, projectId: 102, percentage: 100, startDate: '2023-02-15', endDate: '2023-05-31' },
      { id: 8, resourceId: 5, projectId: 103, percentage: 50, startDate: '2023-06-01', endDate: '2023-09-15' },
      { id: 9, resourceId: 3, projectId: 103, percentage: 30, startDate: '2023-03-01', endDate: '2023-06-30' },
      { id: 10, resourceId: 6, projectId: 102, percentage: 80, startDate: '2023-02-15', endDate: '2023-08-31' },
      { id: 11, resourceId: 7, projectId: 103, percentage: 60, startDate: '2023-03-01', endDate: '2023-09-15' }
    ];
    
    setResources(resourceData);
    setProjects(projectData);
    setAllocations(allocationData);
  }, []);
  
  // Get unique departments from resources
  const departments = [...new Set(resources.filter(r => r.department).map(r => r.department))];
  
  // Get unique resource types
  const resourceTypes = [...new Set(resources.filter(r => r.type).map(r => r.type))];
  
  // Filter resources based on selected filters
  const filteredResources = resources.filter(resource => {
    if (filterResourceType !== 'all' && resource.type !== filterResourceType) {
      return false;
    }
    
    if (filterDepartment !== 'all' && resource.department !== filterDepartment) {
      return false;
    }
    
    return true;
  });
  
  // Filter projects based on selected filters
  const filteredProjects = projects.filter(project => {
    if (filterProject !== 'all' && project.id.toString() !== filterProject) {
      return false;
    }
    
    return true;
  });
  
  // Get allocations for a specific resource and project
  const getResourceProjectAllocation = (resourceId, projectId) => {
    return allocations.find(
      a => a.resourceId === resourceId && a.projectId === projectId
    );
  };
  
  // Calculate total allocation percentage for a resource
  const getResourceTotalAllocation = (resourceId) => {
    const currentDate = new Date();
    const resourceAllocations = allocations.filter(a => {
      const startDate = new Date(a.startDate);
      const endDate = new Date(a.endDate);
      
      if (timeframe === 'current') {
        return a.resourceId === resourceId && 
               startDate <= currentDate && 
               endDate >= currentDate;
      }
      
      return a.resourceId === resourceId;
    });
    
    return resourceAllocations.reduce((total, alloc) => total + alloc.percentage, 0);
  };
  
  // Check if a resource is overallocated
  const isResourceOverallocated = (resourceId) => {
    return getResourceTotalAllocation(resourceId) > overallocationThreshold;
  };
  
  // Get cell background and text colors based on allocation percentage
  const getCellStyles = (percentage) => {
    if (!percentage) return { bg: '', text: '' };
    
    if (percentage <= 50) {
      return { 
        bg: `rgba(${safeHexToRgb(purpleColors.completed)}, 0.2)`, 
        text: purpleColors.completed 
      };
    }
    if (percentage <= 80) {
      return { 
        bg: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.3)`, 
        text: purpleColors.tertiary 
      };
    }
    if (percentage <= 100) {
      return { 
        bg: `rgba(${safeHexToRgb(purpleColors.secondary)}, 0.4)`, 
        text: purpleColors.secondary 
      };
    }
    return { 
      bg: `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.3)`, 
      text: purpleColors.accent2 
    };
  };

  // Get initials from name
  const getInitials = (name) => {
    return name.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Render the matrix by resource view
  const renderResourceView = () => {
    return (
      <div className="table-responsive">
        <table className="table table-hover dashboard-table">
          <thead>
            <tr>
              <th style={{ minWidth: '200px' }}>Resource</th>
              {filteredProjects.map(project => (
                <th key={project.id}>{project.name}</th>
              ))}
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map(resource => {
              const totalAllocation = getResourceTotalAllocation(resource.id);
              const isOverallocated = isResourceOverallocated(resource.id);
              
              return (
                <tr key={resource.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-2" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                        color: purpleColors.primary,
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        {getInitials(resource.name)}
                      </div>
                      <div>
                        <div className="fw-medium">{resource.name}</div>
                        <div className="text-muted small">{resource.role}</div>
                      </div>
                    </div>
                  </td>
                  {filteredProjects.map(project => {
                    const allocation = getResourceProjectAllocation(resource.id, project.id);
                    const cellStyles = allocation ? getCellStyles(allocation.percentage) : { bg: '', text: '' };
                    return (
                      <td 
                        key={project.id} 
                        style={{ 
                          backgroundColor: cellStyles.bg,
                          color: cellStyles.text,
                          fontWeight: allocation && allocation.percentage > 80 ? '500' : 'normal'
                        }}
                        className="text-center"
                      >
                        {allocation ? `${allocation.percentage}%` : '-'}
                      </td>
                    );
                  })}
                  <td 
                    className="text-center fw-bold" 
                    style={{ 
                      backgroundColor: isOverallocated ? `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.1)` : '',
                      color: isOverallocated ? purpleColors.accent2 : purpleColors.primary 
                    }}
                  >
                    {totalAllocation}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };
  
  // Render the matrix by project view
  const renderProjectView = () => {
    return (
      <div className="table-responsive">
        <table className="table table-hover dashboard-table">
          <thead>
            <tr>
              <th style={{ minWidth: '200px' }}>Project</th>
              {filteredResources.map(resource => (
                <th key={resource.id} className="text-center">
                  <div className="d-flex flex-column align-items-center">
                    <div className="avatar-circle mb-1" style={{ 
                      backgroundColor: `rgba(${safeHexToRgb(isResourceOverallocated(resource.id) ? purpleColors.accent2 : purpleColors.primary)}, 0.1)`,
                      color: isResourceOverallocated(resource.id) ? purpleColors.accent2 : purpleColors.primary,
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}>
                      {getInitials(resource.name)}
                    </div>
                    <div className="small text-truncate" style={{ maxWidth: '80px' }}>
                      {resource.name}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project.id}>
                <td>
                  <div className="fw-medium">{project.name}</div>
                  <div className="text-muted small">{project.startDate} - {project.endDate}</div>
                  <span className="badge" style={{ backgroundColor: purpleColors.primary, fontSize: '0.7rem' }}>
                    {project.status}
                  </span>
                </td>
                {filteredResources.map(resource => {
                  const allocation = getResourceProjectAllocation(resource.id, project.id);
                  const cellStyles = allocation ? getCellStyles(allocation.percentage) : { bg: '', text: '' };
                  return (
                    <td 
                      key={resource.id} 
                      style={{ 
                        backgroundColor: cellStyles.bg,
                        color: cellStyles.text,
                        fontWeight: allocation && allocation.percentage > 80 ? '500' : 'normal'
                      }}
                      className="text-center"
                    >
                      {allocation ? `${allocation.percentage}%` : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="resource-allocation-matrix">
      <div className="dashboard-card mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-grid-3x3-gap me-2"></i>Resource Allocation Matrix
            </h5>
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${view === 'resource' ? 'btn-primary' : 'btn-outline-primary'} rounded-start`}
                onClick={() => setView('resource')}
                style={view === 'resource' ? {
                  backgroundColor: purpleColors.primary,
                  borderColor: purpleColors.primary
                } : {
                  borderColor: purpleColors.primary,
                  color: purpleColors.primary
                }}
              >
                <i className="bi bi-people me-1"></i> By Resource
              </button>
              <button 
                className={`btn btn-sm ${view === 'project' ? 'btn-primary' : 'btn-outline-primary'} rounded-end`}
                onClick={() => setView('project')}
                style={view === 'project' ? {
                  backgroundColor: purpleColors.primary,
                  borderColor: purpleColors.primary
                } : {
                  borderColor: purpleColors.primary,
                  color: purpleColors.primary
                }}
              >
                <i className="bi bi-briefcase me-1"></i> By Project
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-calendar-range"></i>
                </span>
                <select 
                  className="form-select"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="current">Current Allocations</option>
                  <option value="all">All Time Allocations</option>
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-tags"></i>
                </span>
                <select 
                  className="form-select"
                  value={filterResourceType}
                  onChange={(e) => setFilterResourceType(e.target.value)}
                >
                  <option value="all">All Resource Types</option>
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-building"></i>
                </span>
                <select 
                  className="form-select"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-briefcase"></i>
                </span>
                <select 
                  className="form-select"
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id.toString()}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <div className="input-group">
                <span className="input-group-text" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-exclamation-triangle"></i>
                </span>
                <span className="input-group-text">Overallocation Threshold</span>
                <input 
                  type="number" 
                  className="form-control" 
                  value={overallocationThreshold}
                  onChange={(e) => setOverallocationThreshold(Number(e.target.value))}
                  min="1"
                  max="200"
                />
                <span className="input-group-text">%</span>
              </div>
              <div className="form-text">
                Resources allocated above this percentage will be highlighted.
              </div>
            </div>
            
            <div className="col-md-6 text-end mb-2">
              <button className="btn btn-outline-primary rounded-pill me-2" style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}>
                <i className="bi bi-download me-1"></i> Export
              </button>
              <button className="btn btn-outline-primary rounded-pill" style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}>
                <i className="bi bi-printer me-1"></i> Print
              </button>
            </div>
          </div>
          
          <div className="allocation-matrix">
            {view === 'resource' ? renderResourceView() : renderProjectView()}
          </div>
        </div>
      </div>
      
      <div className="dashboard-card">
        <div className="card-header bg-white">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-info-circle me-2"></i>Legend
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap">
            <div className="me-4 mb-2 d-flex align-items-center">
              <div className="p-2 me-2" style={{ 
                width: '30px', 
                height: '20px', 
                backgroundColor: `rgba(${safeHexToRgb(purpleColors.completed)}, 0.2)`,
                borderRadius: '4px'
              }}></div>
              <span>Low Allocation (≤50%)</span>
            </div>
            <div className="me-4 mb-2 d-flex align-items-center">
              <div className="p-2 me-2" style={{ 
                width: '30px', 
                height: '20px', 
                backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.3)`,
                borderRadius: '4px'
              }}></div>
              <span>Medium Allocation (51-80%)</span>
            </div>
            <div className="me-4 mb-2 d-flex align-items-center">
              <div className="p-2 me-2" style={{ 
                width: '30px', 
                height: '20px', 
                backgroundColor: `rgba(${safeHexToRgb(purpleColors.secondary)}, 0.4)`,
                borderRadius: '4px'
              }}></div>
              <span>High Allocation (81-100%)</span>
            </div>
            <div className="me-4 mb-2 d-flex align-items-center">
              <div className="p-2 me-2" style={{ 
                width: '30px', 
                height: '20px', 
                backgroundColor: `rgba(${safeHexToRgb(purpleColors.accent2)}, 0.3)`,
                borderRadius: '4px'
              }}></div>
              <span>Overallocated ({'>'}100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceAllocationMatrix;
