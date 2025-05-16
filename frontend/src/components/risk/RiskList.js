import React from 'react';

function RiskList({ risks, onEdit, onDelete, filter, onFilterChange, projects = [] }) {
  // Purple-themed color palette for charts to match Dashboard
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

  // Apply filters
  const filteredRisks = risks.filter(risk => {
    // Category filter
    if (filter.category !== 'all' && risk.category !== filter.category) {
      return false;
    }
    
    // Status filter
    if (filter.status !== 'all' && risk.status !== filter.status) {
      return false;
    }
    
    // Severity filter
    if (filter.severity !== 'all') {
      const score = risk.risk_score || risk.riskScore;
      if (filter.severity === 'critical' && score < 16) return false;
      if (filter.severity === 'high' && (score < 11 || score >= 16)) return false;
      if (filter.severity === 'medium' && (score < 6 || score >= 11)) return false;
      if (filter.severity === 'low' && score > 5) return false;
    }
    
    // Project filter
    if (filter.project !== 'all' && risk.project_id !== filter.project) {
      return false;
    }
    
    return true;
  });

  // Get unique risk categories for filter dropdown
  const categories = ['all', ...new Set(risks.map(risk => risk.category))];
  
  // Get unique risk statuses for filter dropdown
  const statuses = ['all', ...new Set(risks.map(risk => risk.status))];
  
  // Get unique project IDs for filter dropdown
  const projectIds = ['all', ...new Set(risks.map(risk => risk.project_id))];
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filter, [name]: value });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge style with custom colors
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Mitigated':
        return { backgroundColor: chartColors.completed };
      case 'Accepted': 
        return { backgroundColor: chartColors.primary };
      case 'Closed':
        return { backgroundColor: chartColors.tertiary };
      default:
        return { backgroundColor: chartColors.accent2 };
    }
  };
  
  // Get severity badge style with custom colors
  const getSeverityBadgeStyle = (score) => {
    if (score >= 16) {
      return { backgroundColor: chartColors.critical };
    } else if (score >= 11) {
      return { backgroundColor: chartColors.high };
    } else if (score >= 6) {
      return { backgroundColor: chartColors.medium };
    } else {
      return { backgroundColor: chartColors.low };
    }
  };
  
  return (
    <div className="risk-list">
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-shield-exclamation me-2"></i>Risk Register
          </h5>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2 rounded-pill">
              <i className="bi bi-download me-1"></i> Export
            </button>
            <button className="btn btn-primary rounded-pill" onClick={() => onEdit({})}>
              <i className="bi bi-plus-lg me-1"></i> Add Risk
            </button>
          </div>
        </div>
        
        <div className="card-body pb-0">
          <div className="row mb-3">
            {/* Add project filter dropdown */}
            {projects && projects.length > 0 && (
              <div className="col-md-3 mb-2">
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <i className="bi bi-briefcase" style={{ color: chartColors.primary }}></i>
                  </span>
                  <select 
                    className="form-select form-select-sm rounded-end"
                    name="project"
                    value={filter.project}
                    onChange={handleFilterChange}
                    style={{ borderLeft: 0 }}
                  >
                    <option value="all">All Projects</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-tag" style={{ color: chartColors.primary }}></i>
                </span>
                <select 
                  className="form-select form-select-sm rounded-end"
                  name="category"
                  value={filter.category}
                  onChange={handleFilterChange}
                  style={{ borderLeft: 0 }}
                >
                  <option value="all">All Categories</option>
                  {categories.filter(c => c !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-flag" style={{ color: chartColors.secondary }}></i>
                </span>
                <select 
                  className="form-select form-select-sm rounded-end"
                  name="status"
                  value={filter.status}
                  onChange={handleFilterChange}
                  style={{ borderLeft: 0 }}
                >
                  <option value="all">All Statuses</option>
                  {statuses.filter(s => s !== 'all').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-exclamation-diamond" style={{ color: chartColors.tertiary }}></i>
                </span>
                <select 
                  className="form-select form-select-sm rounded-end"
                  name="severity"
                  value={filter.severity}
                  onChange={handleFilterChange}
                  style={{ borderLeft: 0 }}
                >
                  <option value="all">All Severities</option>
                  <option value="low">Low (1-5)</option>
                  <option value="medium">Medium (6-10)</option>
                  <option value="high">High (11-15)</option>
                  <option value="critical">Critical (16+)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="small mb-3">
            <span className="badge rounded-pill me-2" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)`,
              color: chartColors.critical,
              border: `1px solid rgba(${safeHexToRgb(chartColors.critical)}, 0.2)`
            }}>
              <i className="bi bi-exclamation-diamond-fill me-1"></i>
              Critical: {risks.filter(r => (r.risk_score || r.riskScore) >= 16).length}
            </span>
            
            <span className="badge rounded-pill me-2" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.1)`,
              color: chartColors.high,
              border: `1px solid rgba(${safeHexToRgb(chartColors.high)}, 0.2)`
            }}>
              <i className="bi bi-exclamation-circle-fill me-1"></i>
              High: {risks.filter(r => {
                const score = r.risk_score || r.riskScore;
                return score >= 11 && score <= 15;
              }).length}
            </span>
            
            <span className="badge rounded-pill me-2" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.medium)}, 0.1)`,
              color: chartColors.medium,
              border: `1px solid rgba(${safeHexToRgb(chartColors.medium)}, 0.2)`
            }}>
              <i className="bi bi-exclamation me-1"></i>
              Medium: {risks.filter(r => {
                const score = r.risk_score || r.riskScore;
                return score >= 6 && score <= 10;
              }).length}
            </span>
            
            <span className="badge rounded-pill me-2" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.low)}, 0.1)`,
              color: chartColors.low,
              border: `1px solid rgba(${safeHexToRgb(chartColors.low)}, 0.2)`
            }}>
              <i className="bi bi-info-circle-fill me-1"></i>
              Low: {risks.filter(r => (r.risk_score || r.riskScore) <= 5).length}
            </span>
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="table dashboard-table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Risk</th>
                <th>Project</th> {/* Add Project column */}
                <th>Category</th>
                <th style={{ width: '100px' }} title="Risk Score = Probability × Impact">
                  P × I <i className="bi bi-info-circle-fill text-muted ms-1 small"></i>
                </th>
                <th>Status</th>
                <th>Owner</th>
                <th>Identified</th>
                <th>Review Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRisks.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    <i className="bi bi-search me-2" style={{ fontSize: '1.5rem', color: chartColors.quaternary }}></i>
                    <p className="text-muted mb-0">No risks found matching filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredRisks.map(risk => (
                  <tr key={risk.id}>
                    <td>{risk.id}</td>
                    <td>
                      <div className="fw-bold">{risk.title}</div>
                      <div className="text-muted small">{risk.description && risk.description.substring(0, 60)}...</div>
                    </td>
                    <td>
                      {/* Display project name */}
                      <span className="badge rounded-pill" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(chartColors.accent3)}, 0.1)`,
                        color: chartColors.accent3
                      }}>
                        <i className="bi bi-briefcase me-1"></i>
                        {projects.find(p => p.id == risk.project_id)?.title || `Project #${risk.project_id}`}
                      </span>
                    </td>
                    <td>
                      <span className="badge rounded-pill" style={{ 
                        backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.1)`,
                        color: chartColors.primary
                      }}>
                        <i className="bi bi-tag-fill me-1"></i>
                        {risk.category}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="badge" style={getSeverityBadgeStyle(risk.risk_score || risk.riskScore)} 
                             title={`Risk Score: ${risk.risk_score || risk.riskScore} (${risk.probability} × ${risk.impact})`}>
                          {risk.risk_score || risk.riskScore}
                        </div>
                        <small className="text-muted ms-2">
                          ({risk.probability}×{risk.impact})
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={getStatusBadgeStyle(risk.status)}>
                        {risk.status}
                      </span>
                    </td>
                    <td>
                      {risk.owner_name ? (
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle me-2" style={{ 
                            backgroundColor: `rgba(${safeHexToRgb(chartColors.tertiary)}, 0.2)`,
                            color: chartColors.tertiary,
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem'
                          }}>
                            {risk.owner_name.charAt(0)}
                          </div>
                          <span>{risk.owner_name}</span>
                        </div>
                      ) : (
                        <span className="text-muted">Unassigned</span>
                      )}
                    </td>
                    <td>{formatDate(risk.identified_date)}</td>
                    <td>
                      {risk.review_date && (
                        <>
                          {new Date(risk.review_date) <= new Date() ? (
                            <span className="badge bg-danger-subtle text-danger">
                              <i className="bi bi-clock-history me-1"></i>
                              {formatDate(risk.review_date)}
                            </span>
                          ) : (
                            <span>{formatDate(risk.review_date)}</span>
                          )}
                        </>
                      )}
                    </td>
                    <td>
                      <div className="d-flex">
                        <button 
                          className="btn btn-sm btn-outline-primary rounded-pill me-1" 
                          onClick={() => onEdit(risk)}
                          title="Edit risk"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger rounded-pill" 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this risk?')) {
                              onDelete(risk.id);
                            }
                          }}
                          title="Delete risk"
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
        
        {filteredRisks.length > 0 && (
          <div className="card-footer bg-white d-flex justify-content-between align-items-center py-2">
            <div className="small text-muted">
              Showing {filteredRisks.length} {filteredRisks.length === 1 ? 'risk' : 'risks'}
            </div>
            <div className="d-flex">
              <button className="btn btn-sm btn-outline-primary rounded-pill disabled me-2">
                <i className="bi bi-chevron-left"></i> Previous
              </button>
              <button className="btn btn-sm btn-outline-primary rounded-pill">
                Next <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RiskList;
