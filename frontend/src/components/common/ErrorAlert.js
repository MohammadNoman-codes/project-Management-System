import React from 'react';

function ErrorAlert({ message, onRetry }) {
  return (
    <div className="alert alert-danger" role="alert">
      <div className="d-flex align-items-center">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <div>
          <p className="mb-0">{message || 'An error occurred. Please try again.'}</p>
          {onRetry && (
            <button 
              onClick={onRetry} 
              className="btn btn-sm btn-outline-danger mt-2"
            >
              <i className="bi bi-arrow-clockwise me-1"></i> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorAlert;
