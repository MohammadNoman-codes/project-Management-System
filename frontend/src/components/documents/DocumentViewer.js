import React, { useState } from 'react';

function DocumentViewer({ document, onClose }) {
  const [activeTab, setActiveTab] = useState('details');
  const [editMode, setEditMode] = useState(false);
  const [documentData, setDocumentData] = useState({ ...document });
  const [newTag, setNewTag] = useState('');
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  // Handle input changes when in edit mode
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDocumentData(prev => ({ ...prev, [name]: value }));
  };
  
  // Add a new tag
  const handleAddTag = () => {
    if (newTag.trim() && !documentData.tags.includes(newTag.trim())) {
      setDocumentData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  // Remove a tag
  const handleRemoveTag = (tagToRemove) => {
    setDocumentData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  // Save document changes
  const handleSaveChanges = () => {
    // In a real app, this would call an API endpoint to update the document
    console.log('Saving document changes:', documentData);
    setEditMode(false);
    // onSave(documentData); // This would update the parent component's state
  };
  
  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return 'bi-file-earmark-pdf';
    if (fileType.includes('word')) return 'bi-file-earmark-word';
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'bi-file-earmark-excel';
    if (fileType.includes('presentation') || fileType.includes('powerpoint')) return 'bi-file-earmark-ppt';
    if (fileType.includes('image')) return 'bi-file-earmark-image';
    if (fileType.includes('zip') || fileType.includes('compressed')) return 'bi-file-earmark-zip';
    if (fileType.includes('text')) return 'bi-file-earmark-text';
    return 'bi-file-earmark';
  };
  
  // Determine if we can preview this file type
  const canPreview = (fileType) => {
    return fileType.includes('pdf') || 
           fileType.includes('image') ||
           fileType.includes('text');
  };
  
  return (
    <div className="document-viewer">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <i className="bi bi-info-circle"></i> Details
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
            disabled={!canPreview(document.fileType)}
          >
            <i className="bi bi-eye"></i> Preview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'versions' ? 'active' : ''}`}
            onClick={() => setActiveTab('versions')}
          >
            <i className="bi bi-clock-history"></i> Versions
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="bi bi-activity"></i> Activity
          </button>
        </li>
      </ul>
      
      {activeTab === 'details' && (
        <div className="document-details">
          <div className="d-flex justify-content-end mb-3">
            {editMode ? (
              <>
                <button className="btn btn-outline-secondary me-2" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </>
            ) : (
              <button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>
                <i className="bi bi-pencil"></i> Edit
              </button>
            )}
          </div>
          
          <div className="row">
            <div className="col-md-8">
              {editMode ? (
                <>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Document Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      id="name"
                      name="name"
                      value={documentData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={documentData.description}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={documentData.category}
                      onChange={handleInputChange}
                    >
                      <option value="Contract">Contract</option>
                      <option value="Specification">Specification</option>
                      <option value="Design">Design</option>
                      <option value="Meeting Notes">Meeting Notes</option>
                      <option value="Report">Report</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={documentData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <button type="button" className="btn btn-outline-primary" onClick={handleAddTag}>
                        Add
                      </button>
                    </div>
                    <div>
                      {documentData.tags.map(tag => (
                        <span key={tag} className="badge bg-info me-2 mb-2">
                          {tag}
                          <button 
                            type="button" 
                            className="btn-close btn-close-white ms-2" 
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => handleRemoveTag(tag)}
                            aria-label="Remove tag"
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="d-flex align-items-center">
                      <i className={`bi ${getFileIcon(document.fileType)} text-primary me-3`} style={{ fontSize: '2.5rem' }}></i>
                      <div>
                        <h4 className="mb-0">{document.name}</h4>
                        <div className="text-muted">
                          {formatFileSize(document.fileSize)} &bull; v{document.version} &bull; {document.fileType.split('/')[1]?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Description</h6>
                    <p>{document.description || 'No description provided.'}</p>
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <h6>Category</h6>
                      <p>{document.category}</p>
                    </div>
                    <div className="col-md-6">
                      <h6>Status</h6>
                      <span className={`badge ${document.status === 'Approved' ? 'bg-success' : 
                                     document.status === 'Under Review' ? 'bg-warning' : 
                                     document.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                        {document.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h6>Tags</h6>
                    {document.tags.length > 0 ? (
                      <div>
                        {document.tags.map(tag => (
                          <span key={tag} className="badge bg-info me-2 mb-2">{tag}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No tags assigned</p>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Document Info</h6>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Uploaded By</span>
                      <span>{document.uploadedBy?.name || 'Unknown'}</span>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Upload Date</span>
                      <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Last Modified</span>
                      <span>{new Date(document.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </li>
                  {document.approvedBy && (
                    <>
                      <li className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Approved By</span>
                          <span>{document.approvedBy.name}</span>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Approval Date</span>
                          <span>{new Date(document.approvalDate).toLocaleDateString()}</span>
                        </div>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="d-grid gap-2 mt-3">
                <button className="btn btn-primary">
                  <i className="bi bi-download me-2"></i> Download
                </button>
                <button className="btn btn-outline-primary">
                  <i className="bi bi-upload me-2"></i> Upload New Version
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-share me-2"></i> Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'preview' && (
        <div className="document-preview" style={{ minHeight: '600px' }}>
          {canPreview(document.fileType) ? (
            document.fileType.includes('pdf') ? (
              <div className="embed-responsive" style={{ height: '600px' }}>
                <iframe 
                  className="embed-responsive-item w-100 h-100"
                  src="about:blank" // In a real app, this would be the document URL
                  title={document.name}
                ></iframe>
              </div>
            ) : document.fileType.includes('image') ? (
              <div className="text-center">
                <img 
                  src="https://via.placeholder.com/800x600" // In a real app, this would be the document URL
                  alt={document.name}
                  className="img-fluid"
                  style={{ maxHeight: '600px' }}
                />
              </div>
            ) : (
              <div className="card">
                <div className="card-body">
                  <p className="text-muted">Text preview would be shown here in a real application.</p>
                </div>
              </div>
            )
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-file-earmark-x text-muted" style={{ fontSize: '5rem' }}></i>
              <p className="mt-3">Preview not available for this file type. Please download the file to view its contents.</p>
              <button className="btn btn-primary mt-2">
                <i className="bi bi-download me-2"></i> Download File
              </button>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'versions' && (
        <div className="document-versions">
          <table className="table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-primary">
                <td>v{document.version} (Current)</td>
                <td>{document.uploadedBy?.name || 'Unknown'}</td>
                <td>{new Date(document.uploadDate).toLocaleDateString()}</td>
                <td>{formatFileSize(document.fileSize)}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-download"></i> Download
                  </button>
                </td>
              </tr>
              {/* Previous versions would be listed here */}
              <tr>
                <td>v1.1</td>
                <td>Jane Smith</td>
                <td>3/10/2023</td>
                <td>1.2 MB</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-download"></i> Download
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-arrow-clockwise"></i> Restore
                  </button>
                </td>
              </tr>
              <tr>
                <td>v1.0</td>
                <td>John Doe</td>
                <td>3/5/2023</td>
                <td>1.1 MB</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-download"></i> Download
                  </button>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-arrow-clockwise"></i> Restore
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'activity' && (
        <div className="document-activity">
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-badge bg-primary">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="timeline-content">
                <h6 className="mb-1">Document Approved</h6>
                <div className="text-muted mb-2">Jane Smith approved this document.</div>
                <div className="small text-muted">March 20, 2023 at 2:45 PM</div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-badge bg-info">
                <i className="bi bi-pencil"></i>
              </div>
              <div className="timeline-content">
                <h6 className="mb-1">Document Updated</h6>
                <div className="text-muted mb-2">John Doe updated the document and uploaded version 1.2.</div>
                <div className="small text-muted">March 18, 2023 at 10:15 AM</div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-badge bg-warning">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="timeline-content">
                <h6 className="mb-1">Document Submitted for Review</h6>
                <div className="text-muted mb-2">John Doe submitted this document for review.</div>
                <div className="small text-muted">March 16, 2023 at 4:30 PM</div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-badge bg-success">
                <i className="bi bi-upload"></i>
              </div>
              <div className="timeline-content">
                <h6 className="mb-1">Document Created</h6>
                <div className="text-muted mb-2">John Doe uploaded this document for the first time.</div>
                <div className="small text-muted">March 15, 2023 at 9:00 AM</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentViewer;
