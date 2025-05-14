import React from 'react';

function RiskMatrix({ risks = [], onRiskClick }) {
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

  // Create a 5x5 matrix (impact x probability)
  const matrix = Array(5).fill().map(() => Array(5).fill([]));
  
  // Ensure risks is an array
  const riskArray = Array.isArray(risks) ? risks : [];
  
  // Populate the matrix with risks
  riskArray.forEach(risk => {
    const probIndex = risk.probability - 1; // Convert 1-5 to 0-4
    const impactIndex = risk.impact - 1; // Convert 1-5 to 0-4
    
    if (matrix[impactIndex] && matrix[impactIndex][probIndex]) {
      matrix[impactIndex][probIndex] = [...matrix[impactIndex][probIndex], risk];
    }
  });
  
  // Get cell color based on position in matrix with purple theme
  const getCellColor = (probIndex, impactIndex) => {
    const score = (probIndex + 1) * (impactIndex + 1); // Convert back to 1-5 scale
    
    if (score >= 16) {
      return { 
        backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.2)`,
        color: chartColors.critical,
        borderColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.5)`
      };
    }
    if (score >= 9) {
      return { 
        backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.2)`,
        color: chartColors.high,
        borderColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.5)`
      };
    }
    if (score >= 4) {
      return { 
        backgroundColor: `rgba(${safeHexToRgb(chartColors.medium)}, 0.2)`,
        color: chartColors.medium,
        borderColor: `rgba(${safeHexToRgb(chartColors.medium)}, 0.5)`
      };
    }
    return { 
      backgroundColor: `rgba(${safeHexToRgb(chartColors.low)}, 0.2)`,
      color: chartColors.low,
      borderColor: `rgba(${safeHexToRgb(chartColors.low)}, 0.5)`
    };
  };
  
  // Row and column labels with icons
  const impactLabels = [
    { value: 'Minimal (1)', icon: 'bi-arrow-down-circle' },
    { value: 'Minor (2)', icon: 'bi-arrow-down-left-circle' },
    { value: 'Moderate (3)', icon: 'bi-dash-circle' },
    { value: 'Major (4)', icon: 'bi-arrow-up-right-circle' },
    { value: 'Severe (5)', icon: 'bi-arrow-up-circle' }
  ];
  
  const probabilityLabels = [
    { value: 'Very Low (1)', icon: 'bi-graph-down' },
    { value: 'Low (2)', icon: 'bi-graph-down-arrow' },
    { value: 'Medium (3)', icon: 'bi-bar-chart' },
    { value: 'High (4)', icon: 'bi-graph-up-arrow' },
    { value: 'Very High (5)', icon: 'bi-graph-up' }
  ];
  
  if (riskArray.length === 0) {
    return (
      <div className="alert m-4 rounded-3" style={{ 
        backgroundColor: `rgba(${safeHexToRgb(chartColors.quaternary)}, 0.1)`,
        color: chartColors.primary,
        border: `1px solid rgba(${safeHexToRgb(chartColors.primary)}, 0.1)`
      }}>
        <i className="bi bi-info-circle-fill me-2"></i>
        No risk data available. Please add risks to view the matrix.
      </div>
    );
  }
  
  return (
    <div className="risk-matrix">
      <div className="dashboard-card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-grid-3x3 me-2"></i>Risk Assessment Matrix
          </h5>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2 rounded-pill btn-sm">
              <i className="bi bi-download me-1"></i> Export
            </button>
            <button className="btn btn-primary rounded-pill btn-sm">
              <i className="bi bi-plus-lg me-1"></i> Add Risk
            </button>
          </div>
        </div>
        
        <div className="card-body">
          <div className="mb-3 small">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-1" style={{ color: chartColors.primary }}>
                  <i className="bi bi-info-circle me-1"></i>
                  This matrix visualizes risks based on their probability and impact.
                </p>
                <p className="mb-0 text-muted">
                  Click on any risk to view or edit details.
                </p>
              </div>
              <div className="col-md-6">
                <div className="d-flex flex-wrap justify-content-md-end mt-2 mt-md-0">
                  <div className="mx-2 mb-2 d-flex align-items-center">
                    <span className="badge rounded-pill me-1" style={{ 
                      backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)`,
                      color: chartColors.critical
                    }}>
                      <i className="bi bi-exclamation-diamond-fill me-1"></i>
                      Critical
                    </span>
                    <span className="badge" style={{ backgroundColor: chartColors.critical }}>{riskArray.filter(r => r.riskScore >= 16).length}</span>
                  </div>
                  <div className="mx-2 mb-2 d-flex align-items-center">
                    <span className="badge rounded-pill me-1" style={{ 
                      backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.1)`,
                      color: chartColors.high
                    }}>
                      <i className="bi bi-exclamation-circle-fill me-1"></i>
                      High
                    </span>
                    <span className="badge" style={{ backgroundColor: chartColors.high }}>{riskArray.filter(r => r.riskScore >= 9 && r.riskScore < 16).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-bordered risk-matrix-table">
              <thead>
                <tr>
                  <th className="text-center" style={{ 
                    width: '15%', 
                    minWidth: '120px',
                    backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.1)`,
                  }}>
                    <div style={{ color: chartColors.primary }}>
                      Impact ↓ / Probability →
                    </div>
                  </th>
                  {probabilityLabels.map((label, index) => (
                    <th key={index} className="text-center" style={{ 
                      width: '17%', 
                      minWidth: '130px',
                      backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.05)`,
                    }}>
                      <div>
                        <i className={`bi ${label.icon} me-1`} style={{ color: chartColors.primary }}></i>
                        <span style={{ color: chartColors.primary }}>{label.value}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, impactIndex) => (
                  <tr key={impactIndex}>
                    <th className="text-center align-middle" style={{
                      backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.05)`,
                    }}>
                      <div>
                        <i className={`bi ${impactLabels[impactIndex].icon} me-1`} style={{ color: chartColors.primary }}></i>
                        <span style={{ color: chartColors.primary }}>{impactLabels[impactIndex].value}</span>
                      </div>
                    </th>
                    {row.map((cell, probIndex) => {
                      const cellStyle = getCellColor(probIndex, impactIndex);
                      const score = (probIndex + 1) * (impactIndex + 1);
                      
                      return (
                        <td 
                          key={probIndex} 
                          style={{ 
                            backgroundColor: cellStyle.backgroundColor,
                            borderColor: cellStyle.borderColor,
                            minHeight: '100px',
                          }}
                        >
                          <div className="p-2">
                            <div 
                              className="text-center mb-1 fw-bold" 
                              style={{ 
                                color: cellStyle.color,
                                fontSize: '0.9rem'
                              }}
                            >
                              Score: {score}
                              {score >= 16 && <i className="bi bi-exclamation-diamond ms-1"></i>}
                              {score >= 9 && score < 16 && <i className="bi bi-exclamation-circle ms-1"></i>}
                            </div>
                            
                            {cell.length > 0 ? (
                              <div className="risk-items">
                                {cell.map(risk => (
                                  <div 
                                    key={risk.id} 
                                    className="card risk-card mb-1 shadow-sm" 
                                    onClick={() => onRiskClick(risk)}
                                    style={{ 
                                      cursor: 'pointer', 
                                      borderLeft: `3px solid ${cellStyle.color}`,
                                      transition: 'transform 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                  >
                                    <div className="card-body p-1">
                                      <small className="fw-bold d-block">{risk.title}</small>
                                      <div className="d-flex justify-content-between align-items-center mt-1">
                                        <span className="badge rounded-pill" style={{ 
                                          backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.1)`,
                                          color: chartColors.primary,
                                          fontSize: '0.7rem'
                                        }}>
                                          <i className="bi bi-tag-fill me-1"></i>
                                          {risk.category}
                                        </span>
                                        
                                        <span className="badge" style={{ 
                                          backgroundColor: cellStyle.color,
                                          fontSize: '0.7rem'
                                        }}>
                                          {risk.status}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-2">
                                <small style={{ color: cellStyle.color, opacity: 0.7 }}>No risks</small>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 mb-2">
            <h6 className="fw-bold mb-3" style={{ color: chartColors.primary }}>
              <i className="bi bi-info-square me-2"></i>Risk Severity Legend
            </h6>
            <div className="d-flex flex-wrap">
              <div className="me-4 mb-3 d-flex align-items-center">
                <div className="p-2 me-2 rounded-2" style={{ 
                  width: '30px', 
                  height: '20px', 
                  backgroundColor: `rgba(${safeHexToRgb(chartColors.low)}, 0.2)`,
                  border: `1px solid rgba(${safeHexToRgb(chartColors.low)}, 0.5)`
                }}></div>
                <span style={{ color: chartColors.low }}>Low Risk (1-3)</span>
              </div>
              <div className="me-4 mb-3 d-flex align-items-center">
                <div className="p-2 me-2 rounded-2" style={{ 
                  width: '30px', 
                  height: '20px', 
                  backgroundColor: `rgba(${safeHexToRgb(chartColors.medium)}, 0.2)`,
                  border: `1px solid rgba(${safeHexToRgb(chartColors.medium)}, 0.5)`
                }}></div>
                <span style={{ color: chartColors.medium }}>Moderate Risk (4-8)</span>
              </div>
              <div className="me-4 mb-3 d-flex align-items-center">
                <div className="p-2 me-2 rounded-2" style={{ 
                  width: '30px', 
                  height: '20px', 
                  backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.2)`,
                  border: `1px solid rgba(${safeHexToRgb(chartColors.high)}, 0.5)`
                }}></div>
                <span style={{ color: chartColors.high }}>High Risk (9-15)</span>
              </div>
              <div className="mb-3 d-flex align-items-center">
                <div className="p-2 me-2 rounded-2" style={{ 
                  width: '30px', 
                  height: '20px', 
                  backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.2)`,
                  border: `1px solid rgba(${safeHexToRgb(chartColors.critical)}, 0.5)`
                }}></div>
                <span style={{ color: chartColors.critical }}>Extreme Risk (16-25)</span>
              </div>
            </div>
            
            <div className="alert mt-3" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.primary)}, 0.05)`,
              border: `1px solid rgba(${safeHexToRgb(chartColors.primary)}, 0.1)`,
              color: chartColors.primary
            }}>
              <div className="d-flex">
                <i className="bi bi-lightbulb-fill me-2 fs-5"></i>
                <div>
                  <strong>Risk Management Tips</strong>
                  <ul className="mb-0 mt-1">
                    <li>Address critical and high risks immediately</li>
                    <li>Regularly review risk mitigation strategies</li>
                    <li>Consider both probability and impact when prioritizing risks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RiskMatrix;
