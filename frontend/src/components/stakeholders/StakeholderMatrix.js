import React from 'react';

function StakeholderMatrix({ stakeholders, onStakeholderClick }) {
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
    
    // Priority colors
    critical: '#8559da',     // Bright purple for critical
    high: '#9575cd',         // Medium purple for high
    medium: '#b39ddb',       // Lavender for medium
    low: '#d1c4e9',          // Very light purple for low
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

  // Create a 5x5 matrix (interest x influence)
  const matrix = Array(5).fill().map(() => Array(5).fill([]));
  
  // Populate the matrix with stakeholders
  stakeholders.forEach(stakeholder => {
    const interestIndex = stakeholder.interest - 1; // Convert 1-5 to 0-4
    const influenceIndex = stakeholder.influence - 1; // Convert 1-5 to 0-4
    
    if (matrix[interestIndex] && matrix[interestIndex][influenceIndex]) {
      matrix[interestIndex][influenceIndex] = [...matrix[interestIndex][influenceIndex], stakeholder];
    }
  });
  
  // Get cell color based on position in matrix using purple theme
  const getCellColor = (influenceIndex, interestIndex) => {
    // High influence, high interest (top right) - primary purple
    if (influenceIndex >= 3 && interestIndex >= 3) 
      return { bg: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.15)`, border: purpleColors.primary };
    
    // High influence, low interest (top left) - secondary purple
    if (influenceIndex >= 3 && interestIndex < 3) 
      return { bg: `rgba(${safeHexToRgb(purpleColors.secondary)}, 0.15)`, border: purpleColors.secondary };
    
    // Low influence, high interest (bottom right) - tertiary purple
    if (influenceIndex < 3 && interestIndex >= 3) 
      return { bg: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.15)`, border: purpleColors.tertiary };
    
    // Low influence, low interest (bottom left) - very light purple
    return { bg: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.08)`, border: purpleColors.quaternary };
  };
  
  // Get engagement strategy based on quadrant
  const getEngagementStrategy = (influenceIndex, interestIndex) => {
    // High influence, high interest (top right)
    if (influenceIndex >= 3 && interestIndex >= 3) return { 
      name: 'Manage Closely',
      icon: 'bi-star-fill',
      color: purpleColors.primary
    };
    
    // High influence, low interest (top left)
    if (influenceIndex >= 3 && interestIndex < 3) return {
      name: 'Keep Satisfied',
      icon: 'bi-hand-thumbs-up',
      color: purpleColors.secondary
    };
    
    // Low influence, high interest (bottom right)
    if (influenceIndex < 3 && interestIndex >= 3) return {
      name: 'Keep Informed',
      icon: 'bi-info-circle',
      color: purpleColors.tertiary
    };
    
    // Low influence, low interest (bottom left)
    return {
      name: 'Monitor',
      icon: 'bi-eye',
      color: purpleColors.quaternary
    };
  };
  
  // Get priority badge color using purple theme
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return purpleColors.critical;
      case 'High': return purpleColors.high;
      case 'Medium': return purpleColors.medium;
      default: return purpleColors.low;
    }
  };
  
  // Row and column labels
  const influenceLabels = ['1 - Minimal', '2 - Low', '3 - Moderate', '4 - Significant', '5 - Decisive'];
  const interestLabels = ['1 - Minimal', '2 - Low', '3 - Moderate', '4 - Significant', '5 - High'];
  
  return (
    <div className="stakeholder-matrix">
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-grid-3x3 me-2"></i>Stakeholder Influence-Interest Matrix
          </h5>
          <span className="badge" style={{ backgroundColor: purpleColors.primary }}>
            <i className="bi bi-people-fill me-1"></i> {stakeholders.length} Stakeholders
          </span>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <p className="text-muted">
              <i className="bi bi-info-circle me-1" style={{ color: purpleColors.primary }}></i>
              This matrix maps stakeholders based on their level of influence and interest in the project.
              The position determines the most effective engagement strategy.
            </p>
          </div>
          
          <div className="table-responsive">
            <table className="table table-bordered dashboard-table">
              <thead>
                <tr>
                  <th className="text-center align-middle" rowSpan="2" style={{ minWidth: '120px' }}>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      <span className="me-2">Interest</span>
                      <i className="bi bi-arrow-up" style={{ color: purpleColors.primary }}></i>
                    </div>
                  </th>
                  <th className="text-center" colSpan="5">
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="me-2">Influence</span>
                      <i className="bi bi-arrow-right" style={{ color: purpleColors.primary }}></i>
                    </div>
                  </th>
                </tr>
                <tr>
                  {influenceLabels.map((label, index) => (
                    <th key={index} className="text-center" style={{ minWidth: '120px' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Render matrix from bottom to top for correct orientation */}
                {[...matrix].reverse().map((row, reversedInterestIndex) => {
                  const interestIndex = 4 - reversedInterestIndex; // Convert back to 0-4 scale
                  
                  return (
                    <tr key={interestIndex}>
                      <th className="text-center align-middle">{interestLabels[interestIndex]}</th>
                      {row.map((cell, influenceIndex) => {
                        const cellStyle = getCellColor(influenceIndex, interestIndex);
                        const strategy = getEngagementStrategy(influenceIndex, interestIndex);
                        
                        return (
                          <td 
                            key={influenceIndex}
                            style={{ 
                              height: '120px',
                              position: 'relative',
                              padding: '10px',
                              backgroundColor: cellStyle.bg,
                              borderColor: `rgba(${safeHexToRgb(cellStyle.border)}, 0.2)`
                            }}
                          >
                            <div className="text-center mb-2 small fw-bold" style={{ color: strategy.color }}>
                              <i className={`bi ${strategy.icon} me-1`}></i>
                              {strategy.name}
                            </div>
                            
                            <div className="stakeholder-items custom-scrollbar" style={{ 
                              overflowY: 'auto', 
                              maxHeight: '80px',
                              scrollbarWidth: 'thin'
                            }}>
                              {cell.length > 0 ? (
                                cell.map(stakeholder => (
                                  <div 
                                    key={stakeholder.id} 
                                    className="stakeholder-card mb-1" 
                                    onClick={() => onStakeholderClick(stakeholder)}
                                    style={{ 
                                      cursor: 'pointer',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      backgroundColor: 'white',
                                      border: `1px solid rgba(${safeHexToRgb(getPriorityColor(stakeholder.priority))}, 0.5)`,
                                      boxShadow: `0 1px 3px rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`
                                    }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className="avatar-circle me-1" style={{ 
                                        backgroundColor: `rgba(${safeHexToRgb(getPriorityColor(stakeholder.priority))}, 0.2)`,
                                        color: getPriorityColor(stakeholder.priority),
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.6rem',
                                        fontWeight: '500'
                                      }}>
                                        {stakeholder.name.charAt(0)}
                                      </div>
                                      <small className="fw-bold" style={{ fontSize: '0.75rem' }}>{stakeholder.name}</small>
                                    </div>
                                    <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>{stakeholder.organization}</small>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center small text-muted">
                                  <i className="bi bi-person-dash"></i> No stakeholders
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 engagement-legend">
            <h6 className="mb-3"><i className="bi bi-diagram-3 me-1" style={{ color: purpleColors.primary }}></i> Engagement Strategy Legend</h6>
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="p-2" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`,
                  borderRadius: '8px',
                  borderLeft: `3px solid ${purpleColors.primary}`
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill me-2 fs-5" style={{ color: purpleColors.primary }}></i>
                    <div>
                      <strong>Manage Closely</strong>
                      <div className="small text-muted">High influence, high interest</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="p-2" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(purpleColors.secondary)}, 0.1)`,
                  borderRadius: '8px',
                  borderLeft: `3px solid ${purpleColors.secondary}`
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-hand-thumbs-up me-2 fs-5" style={{ color: purpleColors.secondary }}></i>
                    <div>
                      <strong>Keep Satisfied</strong>
                      <div className="small text-muted">High influence, low interest</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="p-2" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(purpleColors.tertiary)}, 0.1)`,
                  borderRadius: '8px',
                  borderLeft: `3px solid ${purpleColors.tertiary}`
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-info-circle me-2 fs-5" style={{ color: purpleColors.tertiary }}></i>
                    <div>
                      <strong>Keep Informed</strong>
                      <div className="small text-muted">Low influence, high interest</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="p-2" style={{ 
                  backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.1)`,
                  borderRadius: '8px',
                  borderLeft: `3px solid ${purpleColors.quaternary}`
                }}>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-eye me-2 fs-5" style={{ color: purpleColors.quaternary }}></i>
                    <div>
                      <strong>Monitor</strong>
                      <div className="small text-muted">Low influence, low interest</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakeholderMatrix;
