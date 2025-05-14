import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RiskMatrix from './RiskMatrix';
import RiskForm from './RiskForm';
import RiskList from './RiskList';
import RiskDashboard from './RiskDashboard';

function RiskManagement() {
  // Purple-themed color palette for UI elements
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

  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('register');
  const [risks, setRisks] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    severity: 'all'
  });

  // Load risks from API (simulated)
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Mock API call
    setTimeout(() => {
      try {
        const mockRisks = [
          {
            id: 1,
            title: 'Development Delays',
            description: 'Technical challenges may delay development timeline',
            projectId: projectId || 1,
            category: 'Schedule',
            probability: 4,
            impact: 3,
            riskScore: 12,
            status: 'Mitigated',
            owner: { id: 1, name: 'John Doe' },
            identifiedDate: '2023-01-15',
            mitigationPlan: 'Add additional developers to the team',
            contingencyPlan: 'Extend timeline by 2 weeks',
            triggers: ['Backend development taking longer than 2 weeks'],
            reviewDate: '2023-02-28'
          },
          {
            id: 2,
            title: 'Budget Constraints',
            description: 'Project may exceed allocated budget',
            projectId: projectId || 1,
            category: 'Cost',
            probability: 3,
            impact: 5,
            riskScore: 15,
            status: 'Identified',
            owner: { id: 2, name: 'Jane Smith' },
            identifiedDate: '2023-01-20',
            mitigationPlan: 'Implement cost control measures',
            contingencyPlan: 'Request additional budget',
            triggers: ['Expenses exceed 75% of budget before project is 60% complete'],
            reviewDate: '2023-03-15'
          },
          {
            id: 3,
            title: 'Stakeholder Requirements Change',
            description: 'Key stakeholders may request significant changes to requirements',
            projectId: projectId || 1,
            category: 'Scope',
            probability: 5,
            impact: 4,
            riskScore: 20,
            status: 'Assessed',
            owner: { id: 3, name: 'Bob Johnson' },
            identifiedDate: '2023-02-05',
            mitigationPlan: 'Regular stakeholder meetings to align expectations',
            contingencyPlan: 'Change management process with impact assessment',
            triggers: ['More than 3 change requests in a week'],
            reviewDate: '2023-03-10'
          },
          {
            id: 4,
            title: 'Resource Unavailability',
            description: 'Key team members may become unavailable',
            projectId: projectId || 1,
            category: 'Resource',
            probability: 2,
            impact: 4,
            riskScore: 8,
            status: 'Accepted',
            owner: { id: 1, name: 'John Doe' },
            identifiedDate: '2023-02-10',
            mitigationPlan: 'Cross-train team members',
            contingencyPlan: 'Temporary contractors',
            triggers: ['Team member absence for more than a week'],
            reviewDate: '2023-04-01'
          },
          {
            id: 5,
            title: 'Technology Compatibility Issues',
            description: 'Integration between systems may face compatibility issues',
            projectId: projectId || 1,
            category: 'Technical',
            probability: 3,
            impact: 4,
            riskScore: 12,
            status: 'Identified',
            owner: { id: 3, name: 'Bob Johnson' },
            identifiedDate: '2023-02-15',
            mitigationPlan: 'Early integration testing',
            contingencyPlan: 'Develop workarounds or middleware',
            triggers: ['Failed integration test'],
            reviewDate: '2023-03-20'
          }
        ];
        
        setRisks(mockRisks);
      } catch (err) {
        console.error("Error loading risks:", err);
        setError("Failed to load risk data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }, 1000);
  }, [projectId]);

  // Create a new risk
  const handleCreateRisk = (riskData) => {
    const newRisk = {
      id: Date.now(),
      ...riskData,
      identifiedDate: new Date().toISOString().split('T')[0],
      riskScore: riskData.probability * riskData.impact
    };
    
    setRisks([...risks, newRisk]);
    setShowRiskModal(false);
  };

  // Update an existing risk
  const handleUpdateRisk = (updatedRisk) => {
    setRisks(risks.map(risk => risk.id === updatedRisk.id ? 
      {...updatedRisk, riskScore: updatedRisk.probability * updatedRisk.impact} : risk));
    setShowRiskModal(false);
    setSelectedRisk(null);
  };

  // Delete a risk
  const handleDeleteRisk = (riskId) => {
    setRisks(risks.filter(risk => risk.id !== riskId));
  };

  // Open modal to edit a risk
  const handleEditRisk = (risk) => {
    setSelectedRisk(risk);
    setModalMode('edit');
    setShowRiskModal(true);
  };

  // Open modal to create a risk
  const handleNewRisk = () => {
    setSelectedRisk(null);
    setModalMode('create');
    setShowRiskModal(true);
  };

  // Apply filters to risks
  const getFilteredRisks = () => {
    return risks.filter(risk => {
      if (filter.status !== 'all' && risk.status !== filter.status) return false;
      
      if (filter.category !== 'all' && risk.category !== filter.category) return false;
      
      if (filter.severity !== 'all') {
        if (filter.severity === 'low' && risk.riskScore > 5) return false;
        if (filter.severity === 'medium' && (risk.riskScore <= 5 || risk.riskScore > 10)) return false;
        if (filter.severity === 'high' && (risk.riskScore <= 10 || risk.riskScore > 15)) return false;
        if (filter.severity === 'critical' && risk.riskScore <= 15) return false;
      }
      
      return true;
    });
  };

  const filteredRisks = getFilteredRisks();

  // Get risk summary counts for badges
  const risksCount = {
    total: risks.length,
    critical: risks.filter(risk => risk.riskScore > 15).length,
    high: risks.filter(risk => risk.riskScore > 10 && risk.riskScore <= 15).length,
    medium: risks.filter(risk => risk.riskScore > 5 && risk.riskScore <= 10).length,
    low: risks.filter(risk => risk.riskScore <= 5).length,
    mitigated: risks.filter(risk => risk.status === 'Mitigated').length,
    identified: risks.filter(risk => risk.status === 'Identified').length,
  };

  if (error) {
    return (
      <div className="alert m-4 rounded-3" role="alert" style={{ 
        backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)`,
        color: chartColors.critical, 
        border: `1px solid rgba(${safeHexToRgb(chartColors.critical)}, 0.3)`
      }}>
        <div className="d-flex align-items-center">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
          <div>
            <h5 className="alert-heading mb-1">Error Loading Risk Data</h5>
            <p className="mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="risk-management p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Risk Management {projectId ? 'for Project' : ''}</h2>
          <p className="text-muted mb-0">
            {projectId ? `Project ID: ${projectId}` : 'All Projects'} • {risks.length} Risks
          </p>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-none d-md-flex me-3">
            <div className="badge rounded-pill me-2" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.critical)}, 0.1)`,
              color: chartColors.critical,
              border: `1px solid rgba(${safeHexToRgb(chartColors.critical)}, 0.2)`
            }}>
              <i className="bi bi-exclamation-diamond-fill me-1"></i>
              Critical: {risksCount.critical}
            </div>
            <div className="badge rounded-pill me-2" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.high)}, 0.1)`,
              color: chartColors.high,
              border: `1px solid rgba(${safeHexToRgb(chartColors.high)}, 0.2)`
            }}>
              <i className="bi bi-exclamation-circle-fill me-1"></i>
              High: {risksCount.high}
            </div>
            <div className="badge rounded-pill" style={{ 
              backgroundColor: `rgba(${safeHexToRgb(chartColors.completed)}, 0.1)`,
              color: chartColors.completed,
              border: `1px solid rgba(${safeHexToRgb(chartColors.completed)}, 0.2)`
            }}>
              <i className="bi bi-shield-check me-1"></i>
              Mitigated: {risksCount.mitigated}
            </div>
          </div>
          <button className="btn btn-primary rounded-pill" onClick={handleNewRisk}>
            <i className="bi bi-plus-lg me-1"></i> New Risk
          </button>
        </div>
      </div>
      
      {/* Modern styled tab navigation */}
      <div className="modern-tabs mb-4">
        <ul className="nav nav-pills" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(chartColors.primary)}, 0.1)` }}>
          <li className="nav-item me-2">
            <button 
              className={`nav-link ${activeTab === 'register' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('register')}
              style={{ 
                color: activeTab === 'register' ? '#fff' : chartColors.primary,
                backgroundColor: activeTab === 'register' ? chartColors.primary : 'transparent',
                borderRadius: '50rem',
                padding: '0.5rem 1.25rem'
              }}
            >
              <i className="bi bi-list-ul me-2"></i> Risk Register
            </button>
          </li>
          <li className="nav-item me-2">
            <button 
              className={`nav-link ${activeTab === 'matrix' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('matrix')}
              style={{ 
                color: activeTab === 'matrix' ? '#fff' : chartColors.primary,
                backgroundColor: activeTab === 'matrix' ? chartColors.primary : 'transparent',
                borderRadius: '50rem',
                padding: '0.5rem 1.25rem'
              }}
            >
              <i className="bi bi-grid-3x3 me-2"></i> Risk Matrix
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''} d-flex align-items-center`}
              onClick={() => setActiveTab('dashboard')}
              style={{ 
                color: activeTab === 'dashboard' ? '#fff' : chartColors.primary,
                backgroundColor: activeTab === 'dashboard' ? chartColors.primary : 'transparent',
                borderRadius: '50rem',
                padding: '0.5rem 1.25rem'
              }}
            >
              <i className="bi bi-bar-chart me-2"></i> Dashboard
            </button>
          </li>
        </ul>
      </div>
      
      {loading ? (
        <div className="dashboard-card p-5 text-center">
          <div className="spinner-border" role="status" style={{ color: chartColors.primary, width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-3 text-muted">Loading risk data...</div>
        </div>
      ) : (
        <>
          {activeTab === 'register' && (
            <RiskList 
              risks={filteredRisks} 
              onEdit={handleEditRisk} 
              onDelete={handleDeleteRisk}
              filter={filter}
              onFilterChange={setFilter}
            />
          )}
          
          {activeTab === 'matrix' && (
            <RiskMatrix 
              risks={filteredRisks} 
              onRiskClick={handleEditRisk} 
            />
          )}
          
          {activeTab === 'dashboard' && (
            <RiskDashboard risks={filteredRisks} />
          )}
        </>
      )}
      
      {/* Risk Form Modal with modern styling */}
      {showRiskModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(chartColors.primary)}, 0.1)` }}>
                <h5 className="modal-title d-flex align-items-center">
                  <i className={`bi ${modalMode === 'create' ? 'bi-plus-shield' : 'bi-pencil-square'} me-2`} 
                     style={{ color: chartColors.primary }}></i>
                  {modalMode === 'create' ? 'Create New Risk' : 'Edit Risk'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRiskModal(false)}
                  style={{ color: chartColors.primary }}
                ></button>
              </div>
              <div className="modal-body p-0">
                <RiskForm 
                  risk={selectedRisk} 
                  mode={modalMode}
                  projectId={projectId} 
                  onSubmit={modalMode === 'create' ? handleCreateRisk : handleUpdateRisk}
                  onCancel={() => setShowRiskModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating action button for mobile */}
      <div className="position-fixed bottom-0 end-0 mb-4 me-4 d-md-none">
        <button 
          className="btn btn-primary rounded-circle shadow" 
          style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
          onClick={handleNewRisk}
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
    </div>
  );
}

export default RiskManagement;
