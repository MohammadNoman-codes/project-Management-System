import React from 'react';
import AnalyticsDashboard from './AnalyticsDashboard';

function AnalyticsPage({ projectId }) {
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
    underBudget: '#7986cb',  // Blue-purple
    onBudget: '#9575cd',     // Medium purple
    overBudget: '#8559da',   // Bright purple
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

  return (
    <div className="analytics-page">
      {/* Header section with style matching the dashboard */}
      {!projectId && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold">Analytics</h1>
            <p className="text-muted">Explore project data, trends and forecasts</p>
          </div>
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2 rounded-pill" style={{ borderColor: purpleColors.primary, color: purpleColors.primary }}>
              <i className="bi bi-download me-1"></i> Export
            </button>
            <button className="btn btn-primary rounded-pill" style={{ backgroundColor: purpleColors.primary, borderColor: purpleColors.primary }}>
              <i className="bi bi-sliders me-1"></i> Configure
            </button>
          </div>
        </div>
      )}
      
      {/* Pass the colors to the dashboard component */}
      <AnalyticsDashboard projectId={projectId || ''} colors={purpleColors} hexToRgb={safeHexToRgb} />
    </div>
  );
}

export default AnalyticsPage;
