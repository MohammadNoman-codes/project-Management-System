import React from 'react';

function StakeholderList({ stakeholders, filter, onFilterChange, onEdit, onDelete, onSelect }) {
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
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
    underBudget: '#7986cb',  // Blue-purple
    onBudget: '#9575cd',     // Medium purple
    overBudget: '#8559da',   // Bright purple
    
    // Stakeholder-specific colors
    critical: '#8559da',     // Bright purple for critical
    high: '#9575cd',         // Medium purple for high
    medium: '#b39ddb',       // Lavender for medium
    low: '#d1c4e9',          // Very light purple for low
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

  // Get unique stakeholder categories for filter dropdown
  const categories = ['all', ...new Set(stakeholders.map(s => s.category))];
  
  // Get unique stakeholder priorities for filter dropdown
  const priorities = ['all', ...new Set(stakeholders.map(s => s.priority))];
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filter, [name]: value });
  };
  
  // Handle search input
  const handleSearchChange = (e) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  // Get badge color based on stakeholder category
  const getCategoryColor = (category) => {
    return purpleColors.primary;
  };
  
  // Get badge color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return purpleColors.critical;
      case 'High': return purpleColors.high;
      case 'Medium': return purpleColors.medium;
      default: return purpleColors.low;
    }
  };
  
  // Get badge color based on support level
  const getSupportColor = (supportLevel) => {
    switch (supportLevel) {
      case 'Supporter': return purpleColors.supporter;
      case 'Neutral': return purpleColors.neutral;
      case 'Critic': return purpleColors.critic;
      default: return purpleColors.quaternary;
    }
  };
  
  return (
    <div className="stakeholder-list">
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-people me-2"></i>Stakeholder Register
          </h5>
          <div className="d-flex">
            <div className="input-group me-2" style={{ width: '250px' }}>
              <input 
                type="text"
                className="form-control form-control-sm rounded-pill"
                placeholder="Search stakeholders..."
                value={filter.search || ''}
                onChange={handleSearchChange}
                style={{ 
                  borderTopRightRadius: 0, 
                  borderBottomRightRadius: 0,
                  borderColor: purpleColors.primary
                }}
              />
              <button 
                className="btn btn-sm rounded-pill" 
                type="button" 
                style={{ 
                  borderTopLeftRadius: 0, 
                  borderBottomLeftRadius: 0,
                  backgroundColor: purpleColors.primary, 
                  borderColor: purpleColors.primary,
                  color: 'white'
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
            <div className="me-2" style={{ width: '150px' }}>
              <select 
                className="form-select form-select-sm rounded-pill"
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                style={{ borderColor: purpleColors.primary }}
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div style={{ width: '150px' }}>
              <select 
                className="form-select form-select-sm rounded-pill"
                name="priority"
                value={filter.priority}
                onChange={handleFilterChange}
                style={{ borderColor: purpleColors.primary }}
              >
                <option value="all">All Priorities</option>
                {priorities.filter(p => p !== 'all').map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover dashboard-table mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Influence</th>
                  <th>Interest</th>
                  <th>Support Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stakeholders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <i className="bi bi-people fs-4 mb-2" style={{ color: purpleColors.quaternary }}></i>
                      <p className="text-muted mb-0">No stakeholders found matching filter criteria</p>
                    </td>
                  </tr>
                ) : (
                  stakeholders.map(stakeholder => (
                    <tr key={stakeholder.id} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSelect(stakeholder)}
                    >
                      <td>
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
                            {stakeholder.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="fw-bold">{stakeholder.name}</div>
                            <div className="small text-muted">
                              <a href={`mailto:${stakeholder.contactInfo.email}`} style={{ color: purpleColors.tertiary }}>
                                {stakeholder.contactInfo.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{stakeholder.organization}</td>
                      <td>{stakeholder.role}</td>
                      <td>
                        <span className="badge" style={{ 
                          backgroundColor: getCategoryColor(stakeholder.category),
                          fontSize: '0.75rem',
                          padding: '0.35em 0.65em'
                        }}>
                          {stakeholder.category}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{ 
                          backgroundColor: getPriorityColor(stakeholder.priority),
                          fontSize: '0.75rem',
                          padding: '0.35em 0.65em'
                        }}>
                          {stakeholder.priority}
                        </span>
                      </td>
                      <td>
                        <div className="progress progress-thin" style={{ width: '60px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                              width: `${stakeholder.influence * 20}%`,
                              backgroundColor: purpleColors.primary
                            }}
                            aria-valuenow={stakeholder.influence}
                            aria-valuemin="1" 
                            aria-valuemax="5"
                          ></div>
                        </div>
                        <small className="text-muted">{stakeholder.influence}/5</small>
                      </td>
                      <td>
                        <div className="progress progress-thin" style={{ width: '60px' }}>
                          <div 
                            className="progress-bar" 
                            role="progressbar" 
                            style={{ 
                              width: `${stakeholder.interest * 20}%`,
                              backgroundColor: purpleColors.tertiary
                            }}
                            aria-valuenow={stakeholder.interest}
                            aria-valuemin="1" 
                            aria-valuemax="5"
                          ></div>
                        </div>
                        <small className="text-muted">{stakeholder.interest}/5</small>
                      </td>
                      <td>
                        <span className="badge" style={{ 
                          backgroundColor: getSupportColor(stakeholder.supportLevel),
                          fontSize: '0.75rem',
                          padding: '0.35em 0.65em'
                        }}>
                          {stakeholder.supportLevel}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex">
                          <button 
                            className="btn btn-sm btn-outline-primary rounded-pill me-1" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(stakeholder);
                            }}
                            title="Edit stakeholder"
                            style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill" 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Are you sure you want to delete this stakeholder?')) {
                                onDelete(stakeholder.id);
                              }
                            }}
                            title="Delete stakeholder"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakeholderList;
