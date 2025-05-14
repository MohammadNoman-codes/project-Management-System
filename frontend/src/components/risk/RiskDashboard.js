import React from 'react';

function RiskDashboard({ risks = [] }) {
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

  // Ensure risks is an array even if undefined is passed
  const riskArray = Array.isArray(risks) ? risks : [];
  
  // Count risks by status
  const statusCounts = riskArray.reduce((acc, risk) => {
    acc[risk.status] = (acc[risk.status] || 0) + 1;
    return acc;
  }, {});
  
  // Count risks by category
  const categoryCounts = riskArray.reduce((acc, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1;
    return acc;
  }, {});
  
  // Calculate severity distribution
  const severityCounts = {
    low: riskArray.filter(risk => risk.riskScore <= 5).length,
    medium: riskArray.filter(risk => risk.riskScore > 5 && risk.riskScore <= 10).length,
    high: riskArray.filter(risk => risk.riskScore > 10 && risk.riskScore <= 15).length,
    critical: riskArray.filter(risk => risk.riskScore > 15).length
  };
  
  // Find top risks (highest risk score)
  const topRisks = [...riskArray]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5);
  
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
  
  if (riskArray.length === 0) {
    return (
      <div className="alert alert-info m-4 rounded-3" role="alert">
        <i className="bi bi-info-circle-fill me-2"></i>
        No risk data available. Please add risks to view the dashboard.
      </div>
    );
  }
  
  return (
    <div className="risk-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Risk Management Dashboard</h4>
        <div className="d-flex">
          <button className="btn btn-outline-primary me-2 rounded-pill">
            <i className="bi bi-download me-1"></i> Export
          </button>
          <button className="btn btn-primary rounded-pill">
            <i className="bi bi-plus-lg me-1"></i> Add Risk
          </button>
        </div>
      </div>
      
      {/* Summary KPI Cards with modern styling */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Total Risks</h6>
                <h2 className="kpi-value">{riskArray.length}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.1)` }}>
                <i className="bi bi-shield-exclamation fs-3" style={{ color: chartColors.primary }}></i>
              </div>
            </div>
            <p className="text-muted mt-2 mb-0 small">Across all categories</p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ width: '100%', backgroundColor: chartColors.primary }}></div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">High/Critical Risks</h6>
                <h2 className="kpi-value">{severityCounts.high + severityCounts.critical}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)` }}>
                <i className="bi bi-exclamation-triangle fs-3" style={{ color: chartColors.critical }}></i>
              </div>
            </div>
            <p className="text-danger mt-2 mb-0 small">
              <i className="bi bi-arrow-right"></i> Requiring immediate attention
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${((severityCounts.high + severityCounts.critical) / riskArray.length) * 100}%`, 
                backgroundColor: chartColors.critical 
              }}></div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Mitigated Risks</h6>
                <h2 className="kpi-value">{statusCounts['Mitigated'] || 0}</h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.completed)}, 0.1)` }}>
                <i className="bi bi-shield-check fs-3" style={{ color: chartColors.completed }}></i>
              </div>
            </div>
            <p className="text-success mt-2 mb-0 small">
              <i className="bi bi-check-circle"></i> Successfully addressed
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${((statusCounts['Mitigated'] || 0) / riskArray.length) * 100}%`, 
                backgroundColor: chartColors.completed 
              }}></div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-3">
          <div className="kpi-card">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="kpi-title">Pending Review</h6>
                <h2 className="kpi-value">
                  {riskArray.filter(risk => new Date(risk.reviewDate) <= new Date()).length}
                </h2>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.accent2)}, 0.1)` }}>
                <i className="bi bi-clock-history fs-3" style={{ color: chartColors.accent2 }}></i>
              </div>
            </div>
            <p className="mt-2 mb-0 small" style={{ color: chartColors.accent2 }}>
              <i className="bi bi-calendar-check"></i> Review date has passed
            </p>
            <div className="progress progress-thin mt-3">
              <div className="progress-bar" style={{ 
                width: `${(riskArray.filter(risk => new Date(risk.reviewDate) <= new Date()).length / riskArray.length) * 100}%`, 
                backgroundColor: chartColors.accent2 
              }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-7 mb-4">
          <div className="dashboard-card h-100">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-shield-exclamation me-2"></i>Top Risks by Severity
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Risk</th>
                      <th>Category</th>
                      <th>Score</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRisks.map(risk => (
                      <tr key={risk.id}>
                        <td>
                          <div className="fw-bold">{risk.title}</div>
                          <div className="small text-muted">{risk.description.substring(0, 60)}...</div>
                        </td>
                        <td>
                          <span className="badge rounded-pill" style={{ 
                            backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.1)`,
                            color: chartColors.primary
                          }}>
                            {risk.category}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={getSeverityBadgeStyle(risk.riskScore)}>
                            {risk.riskScore}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={getStatusBadgeStyle(risk.status)}>
                            {risk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {topRisks.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-3">
                          <p className="text-muted mb-0">No risks found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-5 mb-4">
          <div className="dashboard-card h-100">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-graph-up me-2"></i>Risk Severity Distribution
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span><i className="bi bi-exclamation-diamond-fill me-1"></i>Critical (16-25)</span>
                  <span className="badge" style={{ backgroundColor: chartColors.critical }}>{severityCounts.critical}</span>
                </div>
                <div className="progress" style={{ height: '25px', backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)` }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(severityCounts.critical / riskArray.length) * 100}%`,
                      backgroundColor: chartColors.critical 
                    }}
                    aria-valuenow={severityCounts.critical} 
                    aria-valuemin="0" 
                    aria-valuemax={riskArray.length}
                  >
                    {severityCounts.critical > 0 ? `${Math.round((severityCounts.critical / riskArray.length) * 100)}%` : ''}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span><i className="bi bi-exclamation-circle me-1"></i>High (11-15)</span>
                  <span className="badge" style={{ backgroundColor: chartColors.high }}>{severityCounts.high}</span>
                </div>
                <div className="progress" style={{ height: '25px', backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.1)` }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(severityCounts.high / riskArray.length) * 100}%`,
                      backgroundColor: chartColors.high 
                    }}
                    aria-valuenow={severityCounts.high} 
                    aria-valuemin="0" 
                    aria-valuemax={riskArray.length}
                  >
                    {severityCounts.high > 0 ? `${Math.round((severityCounts.high / riskArray.length) * 100)}%` : ''}
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span><i className="bi bi-exclamation me-1"></i>Medium (6-10)</span>
                  <span className="badge" style={{ backgroundColor: chartColors.medium }}>{severityCounts.medium}</span>
                </div>
                <div className="progress" style={{ height: '25px', backgroundColor: `rgba(${safeHexToRgb(chartColors.medium)}, 0.1)` }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(severityCounts.medium / riskArray.length) * 100}%`,
                      backgroundColor: chartColors.medium 
                    }}
                    aria-valuenow={severityCounts.medium} 
                    aria-valuemin="0" 
                    aria-valuemax={riskArray.length}
                  >
                    {severityCounts.medium > 0 ? `${Math.round((severityCounts.medium / riskArray.length) * 100)}%` : ''}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span><i className="bi bi-info-circle me-1"></i>Low (1-5)</span>
                  <span className="badge" style={{ backgroundColor: chartColors.low }}>{severityCounts.low}</span>
                </div>
                <div className="progress" style={{ height: '25px', backgroundColor: `rgba(${safeHexToRgb(chartColors.low)}, 0.1)` }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ 
                      width: `${(severityCounts.low / riskArray.length) * 100}%`,
                      backgroundColor: chartColors.low 
                    }}
                    aria-valuenow={severityCounts.low} 
                    aria-valuemin="0" 
                    aria-valuemax={riskArray.length}
                  >
                    {severityCounts.low > 0 ? `${Math.round((severityCounts.low / riskArray.length) * 100)}%` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-flag me-2"></i>Risk Status Distribution
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Count</th>
                      <th>Percentage</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(statusCounts).map(([status, count]) => (
                      <tr key={status}>
                        <td>
                          <span className="badge" style={getStatusBadgeStyle(status)}>
                            {status}
                          </span>
                        </td>
                        <td>{count}</td>
                        <td>{Math.round((count / riskArray.length) * 100)}%</td>
                        <td>
                          <div className="progress progress-thin" style={{ minWidth: '100px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${(count / riskArray.length) * 100}%`,
                                backgroundColor: getStatusBadgeStyle(status).backgroundColor 
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="dashboard-section-title mb-0">
                <i className="bi bi-tags me-2"></i>Risk Category Distribution
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table dashboard-table mb-0">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Count</th>
                      <th>Percentage</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(categoryCounts).map(([category, count], index) => {
                      // Cycle through the purple palette for different categories
                      const colorKeys = Object.keys(chartColors);
                      const colorIndex = index % colorKeys.length;
                      const color = chartColors[colorKeys[colorIndex]];
                      
                      return (
                        <tr key={category}>
                          <td>
                            <span className="badge rounded-pill" style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(color)}, 0.1)`,
                              color: color
                            }}>
                              {category}
                            </span>
                          </td>
                          <td>{count}</td>
                          <td>{Math.round((count / riskArray.length) * 100)}%</td>
                          <td>
                            <div className="progress progress-thin" style={{ minWidth: '100px' }}>
                              <div 
                                className="progress-bar" 
                                style={{ 
                                  width: `${(count / riskArray.length) * 100}%`,
                                  backgroundColor: color
                                }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Actions Section */}
      <div className="dashboard-card mb-4">
        <div className="card-header">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-list-check me-2"></i>Recommended Risk Actions
          </h5>
        </div>
        <div className="card-body">
          <div className="alert" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)`, color: chartColors.critical, border: 'none' }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>{severityCounts.critical} Critical Risks</strong> - Immediate attention required. Consider emergency mitigation measures.
          </div>
          
          <div className="alert" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.1)`, color: chartColors.high, border: 'none' }}>
            <i className="bi bi-exclamation-circle me-2"></i>
            <strong>{severityCounts.high} High Risks</strong> - Schedule mitigation planning within the next 48 hours.
          </div>
          
          <div className="alert" style={{ backgroundColor: `rgba(${safeHexToRgb(chartColors.tertiary)}, 0.1)`, color: chartColors.tertiary, border: 'none' }}>
            <i className="bi bi-arrow-right-circle me-2"></i>
            <strong>{riskArray.filter(risk => new Date(risk.reviewDate) <= new Date()).length} Reviews Pending</strong> - Update risk assessments to reflect current project status.
          </div>
          
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-outline-primary me-2 rounded-pill">
              <i className="bi bi-file-earmark-text me-1"></i> Generate Risk Report
            </button>
            <button className="btn btn-primary rounded-pill">
              <i className="bi bi-check2-all me-1"></i> Schedule Risk Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskDashboard;
