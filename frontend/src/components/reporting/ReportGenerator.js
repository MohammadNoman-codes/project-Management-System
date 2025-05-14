import React, { useState } from 'react';

function ReportGenerator({ onClose }) {
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: 'summary',
    dateRange: 'month',
    customStartDate: '',
    customEndDate: '',
    includedMetrics: {
      taskCompletion: true,
      resourceUtilization: true,
      budgetVariance: true,
      riskStatus: true,
      milestoneStatus: true
    },
    groupBy: 'project',
    sortBy: 'date',
    fileFormat: 'pdf'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name.startsWith('includedMetrics.')) {
      const metricName = name.split('.')[1];
      setFormData({
        ...formData,
        includedMetrics: {
          ...formData.includedMetrics,
          [metricName]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Report "${formData.reportName}" would be generated in a real application.`);
      onClose();
    }, 2000);
  };
  
  return (
    <div className="report-generator">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="reportName" className="form-label">Report Name *</label>
          <input
            type="text"
            className="form-control"
            id="reportName"
            name="reportName"
            value={formData.reportName}
            onChange={handleInputChange}
            required
            placeholder="e.g., Monthly Project Status Report"
          />
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="reportType" className="form-label">Report Type</label>
            <select
              className="form-select"
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="financial">Financial Report</option>
              <option value="resource">Resource Report</option>
              <option value="risk">Risk Assessment Report</option>
              <option value="milestone">Milestone Report</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="dateRange" className="form-label">Date Range</label>
            <select
              className="form-select"
              id="dateRange"
              name="dateRange"
              value={formData.dateRange}
              onChange={handleInputChange}
            >
              <option value="week">Current Week</option>
              <option value="month">Current Month</option>
              <option value="quarter">Current Quarter</option>
              <option value="year">Current Year</option>
              <option value="all">All Time</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        
        {formData.dateRange === 'custom' && (
          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="customStartDate" className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                id="customStartDate"
                name="customStartDate"
                value={formData.customStartDate}
                onChange={handleInputChange}
                required={formData.dateRange === 'custom'}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="customEndDate" className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                id="customEndDate"
                name="customEndDate"
                value={formData.customEndDate}
                onChange={handleInputChange}
                required={formData.dateRange === 'custom'}
              />
            </div>
          </div>
        )}
        
        <div className="mb-3">
          <label className="form-label">Include Metrics</label>
          <div className="row">
            <div className="col-md-6">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="includedMetrics.taskCompletion"
                  name="includedMetrics.taskCompletion"
                  checked={formData.includedMetrics.taskCompletion}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="includedMetrics.taskCompletion">
                  Task Completion
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="includedMetrics.resourceUtilization"
                  name="includedMetrics.resourceUtilization"
                  checked={formData.includedMetrics.resourceUtilization}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="includedMetrics.resourceUtilization">
                  Resource Utilization
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="includedMetrics.budgetVariance"
                  name="includedMetrics.budgetVariance"
                  checked={formData.includedMetrics.budgetVariance}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="includedMetrics.budgetVariance">
                  Budget Variance
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="includedMetrics.riskStatus"
                  name="includedMetrics.riskStatus"
                  checked={formData.includedMetrics.riskStatus}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="includedMetrics.riskStatus">
                  Risk Status
                </label>
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="includedMetrics.milestoneStatus"
                  name="includedMetrics.milestoneStatus"
                  checked={formData.includedMetrics.milestoneStatus}
                  onChange={handleInputChange}
                />
                <label className="form-check-label" htmlFor="includedMetrics.milestoneStatus">
                  Milestone Status
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="groupBy" className="form-label">Group By</label>
            <select
              className="form-select"
              id="groupBy"
              name="groupBy"
              value={formData.groupBy}
              onChange={handleInputChange}
            >
              <option value="project">Project</option>
              <option value="department">Department</option>
              <option value="resource">Resource</option>
              <option value="category">Category</option>
              <option value="none">No Grouping</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="sortBy" className="form-label">Sort By</label>
            <select
              className="form-select"
              id="sortBy"
              name="sortBy"
              value={formData.sortBy}
              onChange={handleInputChange}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="fileFormat" className="form-label">File Format</label>
          <select
            className="form-select"
            id="fileFormat"
            name="fileFormat"
            value={formData.fileFormat}
            onChange={handleInputChange}
          >
            <option value="pdf">PDF</option>
            <option value="xlsx">Excel</option>
            <option value="csv">CSV</option>
            <option value="docx">Word</option>
          </select>
        </div>
        
        <div className="d-flex justify-content-end mt-4">
          <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose} disabled={isGenerating}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Generating...
              </>
            ) : (
              <>Generate Report</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportGenerator;
