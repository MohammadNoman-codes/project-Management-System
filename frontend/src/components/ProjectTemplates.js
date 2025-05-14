import React, { useState } from 'react';

function ProjectTemplates({ onSelectTemplate }) {
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

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const templates = [
    {
      id: 1,
      name: 'Basic',
      description: 'Comprehensive project template covering all stages from initial studies through execution to project closure.',
      milestones: [
        {
          name: 'Stage 1 - Studies', 
          duration: '4 weeks',
          processes: [
            'Creation of Project Charter',
            'Preparations for Conceptual Design'
          ]
        },
        {
          name: 'Stage 2 - Initial Design', 
          duration: '6 weeks',
          processes: [
            'Producing Conceptual Design Layout',
            'Wayleave Permits Follow-up',
            'Producing the Full Initial Design',
            'External Stakeholders\' Approval'
          ]
        },
        {
          name: 'Stage 3 - Detailed Design', 
          duration: '8 weeks',
          processes: [
            'Preparation of Detailed Drawings',
            'Preparation of Cost Estimate',
            'Value Engineering',
            'Obtaining Approvals'
          ]
        },
        {
          name: 'Stage 4 - Tender Document', 
          duration: '4 weeks',
          processes: [
            'Preparation of Tender Documents',
            'Application for Financial Approval to Tender'
          ]
        },
        {
          name: 'Stage 5 - Tendering & Award', 
          duration: '6 weeks',
          processes: [
            'Apply for Tender Board Approval',
            'Tendering',
            'Tender Evaluation',
            'Financial Approval for Tender Award',
            'Tender Award'
          ]
        },
        {
          name: 'Stage 6 - Execution', 
          duration: '16 weeks',
          processes: [
            'Contract Commencement',
            'Contract General Submittals',
            'Progress Meetings',
            'Requests',
            'Variation Orders',
            'Payments',
            'Progress Reports',
            'Defects Liability Period (DLP)'
          ]
        },
        {
          name: 'Stage 7 - Maintenance & Defects Liability', 
          duration: '52 weeks',
          processes: [
            'Closing Submittals',
            'Handover to Municipal Entity',
            'DLP Performance Record'
          ]
        },
        {
          name: 'Stage 8 - Contract Adjustments', 
          duration: '4 weeks',
          processes: [
            'Extension of Time',
            'Additional Funding'
          ]
        },
        {
          name: 'Stage 9 - Closing', 
          duration: '4 weeks',
          processes: [
            'Cost Adjustment',
            'Releasing the Performance Bond',
            'Lessons Learned'
          ]
        }
      ]
    }
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleConfirmSelection = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  // Function to get milestone stage color
  const getMilestoneColor = (index) => {
    const colors = [
      purpleColors.primary,
      purpleColors.secondary,
      purpleColors.tertiary,
      purpleColors.quaternary,
      purpleColors.accent1,
      purpleColors.accent2,
      purpleColors.accent3,
      purpleColors.tertiary,
      purpleColors.quaternary
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="project-templates">
      <h4 className="fw-bold mb-3">
        <i className="bi bi-file-earmark-text me-2"></i>Select a Project Template
      </h4>
      
      <div className="row">
        {templates.map(template => (
          <div className="col-md-12 mb-3" key={template.id}>
            <div 
              className={`dashboard-card h-100 ${selectedTemplate?.id === template.id ? 'selected-template' : ''}`}
              onClick={() => handleSelectTemplate(template)}
              style={{ 
                cursor: 'pointer',
                borderColor: selectedTemplate?.id === template.id ? purpleColors.primary : 'inherit',
                borderWidth: selectedTemplate?.id === template.id ? '2px' : '1px',
                boxShadow: selectedTemplate?.id === template.id ? 
                  `0 0 0 0.2rem rgba(${safeHexToRgb(purpleColors.primary)}, 0.25)` : 'none'
              }}
            >
              <div className="card-header d-flex justify-content-between align-items-center" 
                style={{ 
                  backgroundColor: selectedTemplate?.id === template.id ? 
                    `rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)` : 'white',
                  borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.1)`
                }}
              >
                <h5 className="mb-0 dashboard-section-title" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-diagram-3 me-2"></i>{template.name}
                </h5>
                {selectedTemplate?.id === template.id && (
                  <span className="badge rounded-pill" style={{ backgroundColor: purpleColors.primary }}>
                    <i className="bi bi-check-lg me-1"></i>Selected
                  </span>
                )}
              </div>
              <div className="card-body">
                <p className="text-muted mb-4">{template.description}</p>
                <h6 className="fw-bold mb-3" style={{ color: purpleColors.primary }}>
                  <i className="bi bi-kanban me-2"></i>Project Stages:
                </h6>
                
                <div className="timeline-container mb-4">
                  <div className="d-flex flex-wrap justify-content-between mb-3">
                    {template.milestones.map((milestone, index) => (
                      <div key={index} className="milestone-marker" style={{ width: '11%' }}>
                        <div className="d-flex flex-column align-items-center">
                          <div className="milestone-dot" style={{ 
                            backgroundColor: getMilestoneColor(index),
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}>
                            {index + 1}
                          </div>
                          <div className="milestone-label text-center mt-1" style={{ fontSize: '0.7rem', color: getMilestoneColor(index) }}>
                            Stage {index + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="progress progress-thin mb-3" style={{ height: '4px' }}>
                    {template.milestones.map((milestone, index) => {
                      const width = 100 / template.milestones.length;
                      return (
                        <div 
                          key={index}
                          className="progress-bar" 
                          style={{ 
                            width: `${width}%`, 
                            backgroundColor: getMilestoneColor(index)
                          }}
                        ></div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="row g-3">
                  {template.milestones.map((milestone, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                      <div className="dashboard-card h-100" style={{ 
                        borderLeft: `3px solid ${getMilestoneColor(index)}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}>
                        <div className="card-header py-2" style={{ 
                          backgroundColor: `rgba(${safeHexToRgb(getMilestoneColor(index))}, 0.1)`,
                          borderBottom: `1px solid rgba(${safeHexToRgb(getMilestoneColor(index))}, 0.1)`
                        }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0" style={{ color: getMilestoneColor(index) }}>
                              <i className="bi bi-flag me-2"></i>{milestone.name}
                            </h6>
                            <span className="badge rounded-pill" style={{ 
                              backgroundColor: `rgba(${safeHexToRgb(getMilestoneColor(index))}, 0.2)`,
                              color: getMilestoneColor(index)
                            }}>
                              <i className="bi bi-clock me-1"></i>{milestone.duration}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-2">
                          <strong className="small">Processes:</strong>
                          <ol className="ps-3 mb-0 small">
                            {milestone.processes.map((process, pidx) => (
                              <li key={pidx} className="mb-1">{process}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-end mt-4">
        <button 
          className="btn btn-outline-secondary rounded-pill me-2">
          <i className="bi bi-x-circle me-1"></i>Cancel
        </button>
        <button 
          className="btn btn-primary rounded-pill" 
          onClick={handleConfirmSelection}
          disabled={!selectedTemplate}
          style={{ 
            backgroundColor: purpleColors.primary, 
            borderColor: purpleColors.primary,
            opacity: !selectedTemplate ? 0.65 : 1
          }}
        >
          <i className="bi bi-check-circle me-1"></i>Use Selected Template
        </button>
      </div>
    </div>
  );
}

export default ProjectTemplates;
