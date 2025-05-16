import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import RiskList from './RiskList';
import RiskForm from './RiskForm';
import riskService from '../../services/riskService';
import projectService from '../../services/projectService';
import userService from '../../services/userService'; // Import userService

function RiskManagementPage() {
  const { projectId } = useParams();
  const [risks, setRisks] = useState([]);
  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // Add state for users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    severity: 'all',
    project: 'all'
  });
  
  // Fetch risks, projects, and users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all projects for dropdown filter and risk creation
        try {
          const allProjects = await projectService.getAllProjects();
          setProjects(allProjects);
        } catch (err) {
          console.error('Error fetching projects:', err);
        }
        
        // Fetch all users for risk owner dropdown
        try {
          const allUsers = await userService.getAllUsers();
          setUsers(allUsers);
        } catch (err) {
          console.error('Error fetching users:', err);
        }
        
        // Fetch specific project details if projectId is provided
        if (projectId) {
          try {
            const projectData = await projectService.getProjectById(projectId);
            setProject(projectData);
            // Set project filter when a specific project is selected
            setFilter(prev => ({ ...prev, project: projectId }));
          } catch(err) {
            console.error(`Error fetching project ${projectId}:`, err);
          }
        }
        
        // Fetch all risks or project-specific risks
        try {
          // If projectId is provided, get risks for that project, otherwise get all risks
          const risksData = projectId ? 
            await riskService.getAllRisks(projectId) : 
            await riskService.getAllRisks();
          
          setRisks(risksData);
        } catch(err) {
          console.error('Error fetching risks:', err);
          setError('Failed to load risk data. Please try again.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [projectId]);
  
  // Handle risk editing (open form with existing risk data)
  const handleEditRisk = (risk) => {
    setSelectedRisk(risk);
    setShowRiskForm(true);
  };
  
  // Handle opening the form for new risk creation
  const handleAddRisk = () => {
    setSelectedRisk(null);
    setShowRiskForm(true);
  };
  
  // Handle risk deletion
  const handleDeleteRisk = async (riskId) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        await riskService.deleteRisk(riskId);
        // Update risks list by removing the deleted risk
        setRisks(prevRisks => prevRisks.filter(risk => risk.id !== riskId));
      } catch (error) {
        console.error('Error deleting risk:', error);
        alert('Failed to delete risk. Please try again.');
      }
    }
  };
  
  // Handle risk form submission (create/update)
  const handleRiskSubmit = async (formData) => {
    try {
      let updatedRisk;
      
      console.log("Received form data:", formData);
      
      if (selectedRisk) {
        // Update existing risk
        updatedRisk = await riskService.updateRisk(selectedRisk.id, formData);
        // Update risks array with the updated risk
        setRisks(prevRisks => 
          prevRisks.map(risk => risk.id === updatedRisk.id ? updatedRisk : risk)
        );
      } else {
        // Make sure we have a project_id, either from form or route
        const projectToUse = formData.project_id || (projectId ? Number(projectId) : null);
        console.log("Using project ID:", projectToUse, "Form project_id:", formData.project_id, "URL projectId:", projectId);
        
        if (!projectToUse) {
          throw new Error('A project must be selected to create a risk');
        }
        
        // Create new risk with explicit project_id
        const riskDataWithProject = {
          ...formData,
          project_id: projectToUse
        };
        
        console.log("Creating risk with data:", riskDataWithProject);
        
        // Pass the projectToUse separately to ensure it's used in the API call
        updatedRisk = await riskService.createRisk(riskDataWithProject);
        
        // Add new risk to risks array
        setRisks(prevRisks => [...prevRisks, updatedRisk]);
      }
      
      // Close the form
      setShowRiskForm(false);
      return true;
    } catch (error) {
      console.error('Error saving risk:', error);
      alert(`Failed to ${selectedRisk ? 'update' : 'create'} risk: ${error.message}`);
      return false;
    }
  };
  
  // Handle risk filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  // Apply project filter if needed
  const filteredRisks = filter.project === 'all' ? 
    risks : 
    risks.filter(risk => risk.project_id == filter.project);
  
  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-purple" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error}</p>
      </div>
    );
  }
  
  return (
    <div className="risk-management-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Risk Management</h2>
          {project ? (
            <p className="text-muted">{project.title} - {project.description}</p>
          ) : (
            <p className="text-muted">Showing risks across all projects</p>
          )}
        </div>
        
        <div className="d-flex">
          {projectId && (
            <Link 
              to="/risks" 
              className="btn btn-outline-primary rounded-pill me-2"
            >
              <i className="bi bi-grid me-1"></i> View All Risks
            </Link>
          )}
          <button 
            className="btn btn-primary rounded-pill" 
            onClick={handleAddRisk}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Risk
          </button>
        </div>
      </div>
      
      {showRiskForm ? (
        <RiskForm 
          risk={selectedRisk}
          projectId={projectId}
          projects={projects}
          users={users} // Pass users array to RiskForm
          onSubmit={handleRiskSubmit}
          onCancel={() => setShowRiskForm(false)}
        />
      ) : (
        <RiskList 
          risks={filteredRisks}
          onEdit={handleEditRisk}
          onDelete={handleDeleteRisk}
          filter={filter}
          onFilterChange={handleFilterChange}
          projects={projects}  
        />
      )}
    </div>
  );
}

export default RiskManagementPage;
