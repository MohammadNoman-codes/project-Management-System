import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StakeholderMatrix from './StakeholderMatrix';
import StakeholderList from './StakeholderList';
import StakeholderForm from './StakeholderForm';
import CommunicationPlan from './CommunicationPlan';
import EngagementHistory from './EngagementHistory';
import stakeholderService from '../../services/stakeholderService';

function StakeholderManagement() {
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
    accent3: '#5e35b1',     // Deeper violet
    
    // Functional colors for status
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

  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('list');
  const [stakeholders, setStakeholders] = useState([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState(null);
  const [showStakeholderModal, setShowStakeholderModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: 'all',
    priority: 'all',
    search: ''
  });

  // Load stakeholders 
  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        setLoading(true);
        
        if (projectId) {
          const stakeholdersData = await stakeholderService.getAllStakeholders(projectId);
          setStakeholders(stakeholdersData);
        } else {
          // If no projectId, could load all stakeholders or use mock data for demo
          // Mock data can remain as a fallback
          const mockStakeholders = [
            {
              id: 1,
              name: 'John Smith',
              organization: 'ABC Corporation',
              role: 'Project Sponsor',
              projectId: projectId || 1,
              contactInfo: {
                email: 'john.smith@abc.com',
                phone: '555-123-4567'
              },
              influence: 5,
              interest: 5,
              category: 'Internal',
              priority: 'Critical',
              supportLevel: 'Supporter',
              expectations: ['Regular updates', 'Budget adherence'],
              requirements: ['Weekly status reports', 'Monthly steering committee meetings'],
              communicationPreference: 'Email',
              communicationFrequency: 'Weekly',
              engagementStrategy: 'Keep closely involved in all major decisions',
              notes: 'Key decision maker with budget authority'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              organization: 'DEF Inc.',
              role: 'End User Representative',
              projectId: projectId || 1,
              contactInfo: {
                email: 'sarah.johnson@def.com',
                phone: '555-234-5678'
              },
              influence: 3,
              interest: 5,
              category: 'Customer',
              priority: 'High',
              supportLevel: 'Neutral',
              expectations: ['User-friendly interface', 'Minimal training required'],
              requirements: ['User testing participation', 'Training materials'],
              communicationPreference: 'Meeting',
              communicationFrequency: 'Biweekly',
              engagementStrategy: 'Involve in all user experience decisions',
              notes: 'Represents the largest user group'
            },
            {
              id: 3,
              name: 'Michael Brown',
              organization: 'GHI Services',
              role: 'Technical Consultant',
              projectId: projectId || 1,
              contactInfo: {
                email: 'michael.brown@ghi.com',
                phone: '555-345-6789'
              },
              influence: 4,
              interest: 3,
              category: 'Vendor',
              priority: 'Medium',
              supportLevel: 'Supporter',
              expectations: ['Clear technical requirements', 'Timely feedback'],
              requirements: ['Technical specifications', 'API documentation'],
              communicationPreference: 'Email',
              communicationFrequency: 'As Needed',
              engagementStrategy: 'Consult on technical decisions',
              notes: 'Expert in system integration'
            },
            {
              id: 4,
              name: 'Emily Davis',
              organization: 'JKL Regulatory Agency',
              role: 'Compliance Officer',
              projectId: projectId || 1,
              contactInfo: {
                email: 'emily.davis@jkl.gov',
                phone: '555-456-7890'
              },
              influence: 4,
              interest: 2,
              category: 'Regulatory',
              priority: 'High',
              supportLevel: 'Neutral',
              expectations: ['Compliance with regulations', 'Documentation'],
              requirements: ['Compliance reports', 'Audit support'],
              communicationPreference: 'Report',
              communicationFrequency: 'Quarterly',
              engagementStrategy: 'Keep informed of compliance-related aspects',
              notes: 'Has authority to block project if regulations are not met'
            },
            {
              id: 5,
              name: 'Robert Wilson',
              organization: 'MNO Partners',
              role: 'External Stakeholder',
              projectId: projectId || 1,
              contactInfo: {
                email: 'robert.wilson@mno.com',
                phone: '555-567-8901'
              },
              influence: 2,
              interest: 4,
              category: 'External',
              priority: 'Medium',
              supportLevel: 'Critic',
              expectations: ['Minimal disruption to existing systems', 'Clear communications'],
              requirements: ['Impact assessments', 'Change notifications'],
              communicationPreference: 'Email',
              communicationFrequency: 'Monthly',
              engagementStrategy: 'Address concerns proactively',
              notes: 'Has expressed concerns about project scope'
            }
          ];
          
          setStakeholders(mockStakeholders);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading stakeholders:", error);
        setLoading(false);
      }
    };
    
    fetchStakeholders();
  }, [projectId]);

  // Create a new stakeholder
  const handleCreateStakeholder = async (stakeholderData) => {
    try {
      if (projectId) {
        const newStakeholder = await stakeholderService.createStakeholder(projectId, stakeholderData);
        setStakeholders([...stakeholders, newStakeholder]);
      } else {
        // Fallback to mock data logic
        const newStakeholder = {
          id: Date.now(),
          ...stakeholderData,
          projectId: projectId || 1
        };
        setStakeholders([...stakeholders, newStakeholder]);
      }
      
      setShowStakeholderModal(false);
    } catch (error) {
      console.error("Error creating stakeholder:", error);
      alert("Failed to create stakeholder. Please try again.");
    }
  };

  // Update an existing stakeholder
  const handleUpdateStakeholder = async (updatedStakeholder) => {
    try {
      if (projectId) {
        await stakeholderService.updateStakeholder(updatedStakeholder.id, updatedStakeholder);
      }
      
      setStakeholders(stakeholders.map(s => s.id === updatedStakeholder.id ? updatedStakeholder : s));
      setShowStakeholderModal(false);
      setSelectedStakeholder(null);
    } catch (error) {
      console.error("Error updating stakeholder:", error);
      alert("Failed to update stakeholder. Please try again.");
    }
  };

  // Delete a stakeholder
  const handleDeleteStakeholder = async (stakeholderId) => {
    try {
      if (projectId) {
        await stakeholderService.deleteStakeholder(stakeholderId);
      }
      
      setStakeholders(stakeholders.filter(s => s.id !== stakeholderId));
      
      if (selectedStakeholder && selectedStakeholder.id === stakeholderId) {
        setSelectedStakeholder(null);
      }
    } catch (error) {
      console.error("Error deleting stakeholder:", error);
      alert("Failed to delete stakeholder. Please try again.");
    }
  };

  // Open modal to edit a stakeholder
  const handleEditStakeholder = (stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setModalMode('edit');
    setShowStakeholderModal(true);
  };

  // Open modal to create a stakeholder
  const handleNewStakeholder = () => {
    setSelectedStakeholder(null);
    setModalMode('create');
    setShowStakeholderModal(true);
  };

  // Select a stakeholder for detailed view
  const handleSelectStakeholder = (stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setActiveTab('details');
  };

  // Apply filters to stakeholders
  const getFilteredStakeholders = () => {
    return stakeholders.filter(stakeholder => {
      if (filter.category !== 'all' && stakeholder.category !== filter.category) return false;
      if (filter.priority !== 'all' && stakeholder.priority !== filter.priority) return false;
      
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return stakeholder.name.toLowerCase().includes(searchLower) || 
               stakeholder.organization.toLowerCase().includes(searchLower) ||
               stakeholder.role.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  };

  const filteredStakeholders = getFilteredStakeholders();

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Critical': return purpleColors.critical;
      case 'High': return purpleColors.high;
      case 'Medium': return purpleColors.medium;
      default: return purpleColors.low;
    }
  };
  
  // Get support level badge color
  const getSupportLevelColor = (supportLevel) => {
    switch(supportLevel) {
      case 'Supporter': return purpleColors.supporter;
      case 'Neutral': return purpleColors.neutral;
      case 'Critic': return purpleColors.critic;
      default: return purpleColors.quaternary;
    }
  };

  return (
    <div className="stakeholder-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold">{projectId ? 'Project Stakeholders' : 'Stakeholder Management'}</h1>
        <button 
          className="btn btn-primary rounded-pill" 
          onClick={handleNewStakeholder}
          style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}
        >
          <i className="bi bi-plus-circle me-1"></i> New Stakeholder
        </button>
      </div>
      
      <ul className="nav nav-tabs custom-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
            style={activeTab === 'list' ? { color: purpleColors.primary, borderBottomColor: purpleColors.primary } : {}}
          >
            <i className="bi bi-list me-1"></i> Stakeholder Register
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveTab('matrix')}
            style={activeTab === 'matrix' ? { color: purpleColors.primary, borderBottomColor: purpleColors.primary } : {}}
          >
            <i className="bi bi-grid-3x3 me-1"></i> Influence/Interest Matrix
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'communication' ? 'active' : ''}`}
            onClick={() => setActiveTab('communication')}
            style={activeTab === 'communication' ? { color: purpleColors.primary, borderBottomColor: purpleColors.primary } : {}}
          >
            <i className="bi bi-chat-dots me-1"></i> Communication Plan
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'engagement' ? 'active' : ''}`}
            onClick={() => setActiveTab('engagement')}
            style={activeTab === 'engagement' ? { color: purpleColors.primary, borderBottomColor: purpleColors.primary } : {}}
          >
            <i className="bi bi-calendar-check me-1"></i> Engagement History
          </button>
        </li>
        {selectedStakeholder && (
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
              style={activeTab === 'details' ? 
                { color: purpleColors.primary, borderBottomColor: purpleColors.primary } : 
                {}
              }
            >
              <i className="bi bi-person-badge me-1"></i> {selectedStakeholder.name}
              <button 
                className="btn-close ms-2"
                style={{ fontSize: '0.5rem' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStakeholder(null);
                  setActiveTab('list');
                }}
              ></button>
            </button>
          </li>
        )}
      </ul>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" style={{ color: purpleColors.primary }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'list' && (
            <StakeholderList 
              stakeholders={filteredStakeholders}
              filter={filter}
              onFilterChange={setFilter}
              onEdit={handleEditStakeholder}
              onDelete={handleDeleteStakeholder}
              onSelect={handleSelectStakeholder}
            />
          )}
          
          {activeTab === 'matrix' && (
            <StakeholderMatrix 
              stakeholders={stakeholders}
              onStakeholderClick={handleSelectStakeholder}
            />
          )}
          
          {activeTab === 'communication' && (
            <CommunicationPlan 
              stakeholders={stakeholders}
              projectId={projectId}
            />
          )}
          
          {activeTab === 'engagement' && (
            <EngagementHistory 
              stakeholders={stakeholders}
              projectId={projectId}
            />
          )}
          
          {activeTab === 'details' && selectedStakeholder && (
            <div className="stakeholder-details">
              <div className="dashboard-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="dashboard-section-title mb-0">
                    <i className="bi bi-person-lines-fill me-2"></i> Stakeholder Details
                  </h5>
                  <div>
                    <button 
                      className="btn btn-outline-primary rounded-pill me-2"
                      onClick={() => handleEditStakeholder(selectedStakeholder)}
                      style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger rounded-pill"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this stakeholder?')) {
                          handleDeleteStakeholder(selectedStakeholder.id);
                          setActiveTab('list');
                        }
                      }}
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar-circle me-3" style={{ 
                          backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.15)`,
                          color: purpleColors.primary,
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem',
                          fontWeight: '500'
                        }}>
                          {selectedStakeholder.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="mb-1">{selectedStakeholder.name}</h4>
                          <p className="text-muted mb-0">{selectedStakeholder.role} at {selectedStakeholder.organization}</p>
                        </div>
                      </div>
                      
                      <h6 className="section-subtitle mb-2">
                        <i className="bi bi-info-circle me-2" style={{ color: purpleColors.primary }}></i>
                        Basic Information
                      </h6>
                      <table className="table table-bordered dashboard-table">
                        <tbody>
                          <tr>
                            <th style={{ width: '35%' }}>Category</th>
                            <td>
                              <span className="badge" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(purpleColors.primary)}, 0.15)`,
                                color: purpleColors.primary,
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>{selectedStakeholder.category}</span>
                            </td>
                          </tr>
                          <tr>
                            <th>Priority</th>
                            <td>
                              <span className="badge" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(getPriorityColor(selectedStakeholder.priority))}, 0.15)`,
                                color: getPriorityColor(selectedStakeholder.priority),
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>{selectedStakeholder.priority}</span>
                            </td>
                          </tr>
                          <tr>
                            <th>Support Level</th>
                            <td>
                              <span className="badge" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(getSupportLevelColor(selectedStakeholder.supportLevel))}, 0.15)`,
                                color: getSupportLevelColor(selectedStakeholder.supportLevel),
                                borderRadius: '12px',
                                padding: '6px 12px'
                              }}>{selectedStakeholder.supportLevel}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <h6 className="section-subtitle mt-4 mb-2">
                        <i className="bi bi-envelope me-2" style={{ color: purpleColors.primary }}></i>
                        Contact Information
                      </h6>
                      <table className="table table-bordered dashboard-table">
                        <tbody>
                          <tr>
                            <th style={{ width: '35%' }}>Email</th>
                            <td>
                              <a href={`mailto:${selectedStakeholder.contactInfo.email}`} style={{ color: purpleColors.primary }}>
                                {selectedStakeholder.contactInfo.email}
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <th>Phone</th>
                            <td>
                              <a href={`tel:${selectedStakeholder.contactInfo.phone}`} style={{ color: purpleColors.primary }}>
                                {selectedStakeholder.contactInfo.phone}
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <h6 className="section-subtitle mt-4 mb-3">
                        <i className="bi bi-graph-up me-2" style={{ color: purpleColors.primary }}></i>
                        Influence & Interest
                      </h6>
                      <div className="card mb-3" style={{ 
                        borderColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.3)`,
                        boxShadow: 'none',
                        borderRadius: '0.75rem'
                      }}>
                        <div className="card-body p-3">
                          <div className="row">
                            <div className="col-6">
                              <label className="form-label mb-1">Influence Level</label>
                              <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ 
                                    width: `${selectedStakeholder.influence * 20}%`,
                                    backgroundColor: purpleColors.primary 
                                  }}
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Low</small>
                                <small style={{ color: purpleColors.primary }}><strong>{selectedStakeholder.influence}/5</strong></small>
                                <small className="text-muted">High</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label mb-1">Interest Level</label>
                              <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                                <div 
                                  className="progress-bar" 
                                  role="progressbar" 
                                  style={{ 
                                    width: `${selectedStakeholder.interest * 20}%`,
                                    backgroundColor: purpleColors.tertiary 
                                  }}
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted">Low</small>
                                <small style={{ color: purpleColors.tertiary }}><strong>{selectedStakeholder.interest}/5</strong></small>
                                <small className="text-muted">High</small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <h6 className="section-subtitle mb-2">
                        <i className="bi bi-stars me-2" style={{ color: purpleColors.primary }}></i>
                        Expectations
                      </h6>
                      {selectedStakeholder.expectations.length > 0 ? (
                        <ul className="list-group mb-4" style={{ borderRadius: '0.75rem' }}>
                          {selectedStakeholder.expectations.map((expectation, index) => (
                            <li key={index} className="list-group-item d-flex align-items-center" style={{ 
                              borderColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.3)` 
                            }}>
                              <i className="bi bi-check-circle-fill me-2" style={{ color: purpleColors.tertiary }}></i>
                              {expectation}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No expectations recorded</p>
                      )}
                      
                      <h6 className="section-subtitle mb-2">
                        <i className="bi bi-list-check me-2" style={{ color: purpleColors.primary }}></i>
                        Requirements
                      </h6>
                      {selectedStakeholder.requirements.length > 0 ? (
                        <ul className="list-group mb-4" style={{ borderRadius: '0.75rem' }}>
                          {selectedStakeholder.requirements.map((requirement, index) => (
                            <li key={index} className="list-group-item d-flex align-items-center" style={{ 
                              borderColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.3)` 
                            }}>
                              <i className="bi bi-check-square me-2" style={{ color: purpleColors.tertiary }}></i>
                              {requirement}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted">No requirements recorded</p>
                      )}
                      
                      <h6 className="section-subtitle mb-2">
                        <i className="bi bi-chat-square-text me-2" style={{ color: purpleColors.primary }}></i>
                        Communication Preferences
                      </h6>
                      <table className="table table-bordered dashboard-table mb-4">
                        <tbody>
                          <tr>
                            <th style={{ width: '40%' }}>Preferred Method</th>
                            <td>
                              <span className="badge" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.15)`,
                                color: purpleColors.tertiary
                              }}>
                                <i className={`bi ${
                                  selectedStakeholder.communicationPreference === 'Email' ? 'bi-envelope' : 
                                  selectedStakeholder.communicationPreference === 'Meeting' ? 'bi-people' : 
                                  selectedStakeholder.communicationPreference === 'Report' ? 'bi-file-text' :
                                  'bi-chat-square'
                                } me-1`}></i>
                                {selectedStakeholder.communicationPreference}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Frequency</th>
                            <td>
                              <span className="badge" style={{ 
                                backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.15)`,
                                color: purpleColors.tertiary
                              }}>
                                <i className="bi bi-calendar-check me-1"></i>
                                {selectedStakeholder.communicationFrequency}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <h6 className="section-subtitle mb-2">
                        <i className="bi bi-diagram-3 me-2" style={{ color: purpleColors.primary }}></i>
                        Engagement Strategy
                      </h6>
                      <div className="card mb-4" style={{ 
                        borderColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.3)`,
                        boxShadow: 'none',
                        borderRadius: '0.75rem',
                        backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.05)`
                      }}>
                        <div className="card-body p-3">
                          <p className="mb-0">{selectedStakeholder.engagementStrategy}</p>
                        </div>
                      </div>
                      
                      {selectedStakeholder.notes && (
                        <>
                          <h6 className="section-subtitle mb-2">
                            <i className="bi bi-journal-text me-2" style={{ color: purpleColors.primary }}></i>
                            Notes
                          </h6>
                          <div className="card" style={{ 
                            borderColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.3)`,
                            boxShadow: 'none',
                            borderRadius: '0.75rem',
                            backgroundColor: `rgba(${safeHexToRgb(purpleColors.quaternary)}, 0.05)`
                          }}>
                            <div className="card-body p-3">
                              <p className="mb-0 text-muted">{selectedStakeholder.notes}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Stakeholder Form Modal */}
      {showStakeholderModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(purpleColors.primary)}, 0.2)` }}>
                <h5 className="modal-title">
                  <i className={`bi ${modalMode === 'create' ? 'bi-plus-circle' : 'bi-pencil-square'} me-2`} style={{ color: purpleColors.primary }}></i>
                  {modalMode === 'create' ? 'Add New Stakeholder' : 'Edit Stakeholder'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowStakeholderModal(false)}></button>
              </div>
              <div className="modal-body">
                <StakeholderForm 
                  stakeholder={selectedStakeholder}
                  onSubmit={modalMode === 'create' ? handleCreateStakeholder : handleUpdateStakeholder}
                  onCancel={() => setShowStakeholderModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StakeholderManagement;
