import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentUploadForm from './DocumentUploadForm';
import DocumentViewer from './DocumentViewer';

function DocumentRepository() {
  const { projectId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [filter, setFilter] = useState({
    category: 'all',
    status: 'all',
    search: ''
  });
  const [activeFolder, setActiveFolder] = useState('all');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  // Load documents (simulated)
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock documents data
      const mockDocuments = [
        {
          id: 1,
          name: 'Project Charter.pdf',
          description: 'Official project charter document',
          projectId: projectId || 1,
          category: 'Contract',
          status: 'Approved',
          version: '1.2',
          fileSize: 1250000, // in bytes
          fileType: 'application/pdf',
          uploadedBy: { id: 1, name: 'John Doe' },
          uploadDate: '2023-03-15',
          lastUpdated: '2023-03-20',
          approvedBy: { id: 2, name: 'Jane Smith' },
          approvalDate: '2023-03-20',
          tags: ['charter', 'official', 'approved']
        },
        {
          id: 2,
          name: 'Requirements Specification.docx',
          description: 'Detailed requirements document',
          projectId: projectId || 1,
          category: 'Specification',
          status: 'Draft',
          version: '0.9',
          fileSize: 3450000,
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedBy: { id: 3, name: 'Bob Johnson' },
          uploadDate: '2023-03-18',
          lastUpdated: '2023-03-18',
          tags: ['requirements', 'draft']
        },
        {
          id: 3,
          name: 'Design Mockups.zip',
          description: 'UI mockups and design assets',
          projectId: projectId || 1,
          category: 'Design',
          status: 'Under Review',
          version: '2.0',
          fileSize: 8750000,
          fileType: 'application/zip',
          uploadedBy: { id: 2, name: 'Jane Smith' },
          uploadDate: '2023-03-12',
          lastUpdated: '2023-03-14',
          tags: ['design', 'UI', 'mockups']
        },
        {
          id: 4,
          name: 'Kickoff Meeting Notes.docx',
          description: 'Notes from project kickoff meeting',
          projectId: projectId || 1,
          category: 'Meeting Notes',
          status: 'Approved',
          version: '1.0',
          fileSize: 850000,
          fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uploadedBy: { id: 1, name: 'John Doe' },
          uploadDate: '2023-03-05',
          lastUpdated: '2023-03-05',
          approvedBy: { id: 1, name: 'John Doe' },
          approvalDate: '2023-03-05',
          tags: ['meeting', 'kickoff', 'notes']
        },
        {
          id: 5,
          name: 'Budget Forecast.xlsx',
          description: 'Project budget forecast and estimates',
          projectId: projectId || 1,
          category: 'Report',
          status: 'Draft',
          version: '1.1',
          fileSize: 1550000,
          fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadedBy: { id: 1, name: 'John Doe' },
          uploadDate: '2023-03-10',
          lastUpdated: '2023-03-16',
          tags: ['budget', 'finance', 'forecast']
        }
      ];
      
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, [projectId]);

  // Handle document upload
  const handleDocumentUpload = (documentData) => {
    // In a real app, we would upload to the server
    const newDocument = {
      id: Date.now(),
      ...documentData,
      uploadDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };
    
    setDocuments([...documents, newDocument]);
    setShowUploadModal(false);
  };

  // Handle document selection
  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
    setShowViewerModal(true);
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

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  // Get unique categories
  const categories = ['all', ...new Set(documents.map(doc => doc.category))];

  // Get unique statuses
  const statuses = ['all', ...new Set(documents.map(doc => doc.status))];

  // Apply filters to documents
  const filteredDocuments = documents.filter(doc => {
    // Apply category filter
    if (filter.category !== 'all' && doc.category !== filter.category) return false;
    
    // Apply status filter
    if (filter.status !== 'all' && doc.status !== filter.status) return false;
    
    // Apply search filter
    if (filter.search && !doc.name.toLowerCase().includes(filter.search.toLowerCase()) &&
        !doc.description.toLowerCase().includes(filter.search.toLowerCase()) &&
        !doc.tags.some(tag => tag.toLowerCase().includes(filter.search.toLowerCase()))) {
      return false;
    }
    
    // Apply folder filter
    if (activeFolder !== 'all') {
      const isInFolder = doc.category === activeFolder;
      if (!isInFolder) return false;
    }
    
    return true;
  });

  // Handler for search input
  const handleSearchChange = (e) => {
    setFilter({ ...filter, search: e.target.value });
  };

  return (
    <div className="document-repository">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Document Repository {projectId ? 'for Project' : ''}</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowUploadModal(true)}
        >
          <i className="bi bi-upload"></i> Upload Document
        </button>
      </div>
      
      <div className="row">
        {/* Left sidebar for folders/filters */}
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Folders</h5>
            </div>
            <div className="list-group list-group-flush">
              <button 
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeFolder === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFolder('all')}
              >
                <div>
                  <i className="bi bi-folder me-2"></i> All Documents
                </div>
                <span className="badge bg-primary rounded-pill">{documents.length}</span>
              </button>
              
              {categories.filter(cat => cat !== 'all').map(category => (
                <button 
                  key={category}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeFolder === category ? 'active' : ''}`}
                  onClick={() => setActiveFolder(category)}
                >
                  <div>
                    <i className="bi bi-folder me-2"></i> {category}
                  </div>
                  <span className="badge bg-primary rounded-pill">
                    {documents.filter(doc => doc.category === category).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="card mt-3">
            <div className="card-header bg-light">
              <h5 className="mb-0">Filters</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select 
                  className="form-select"
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                  <option value="all">All Categories</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                  <option value="all">All Statuses</option>
                  {statuses.filter(status => status !== 'all').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => setFilter({ category: 'all', status: 'all', search: '' })}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="col-md-9">
          <div className="card mb-4">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="input-group" style={{ maxWidth: '400px' }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Search documents..."
                    value={filter.search}
                    onChange={handleSearchChange}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
                
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setView('grid')}
                  >
                    <i className="bi bi-grid"></i>
                  </button>
                  <button 
                    className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setView('list')}
                  >
                    <i className="bi bi-list"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center my-5">
                  <i className="bi bi-folder-x display-1 text-muted"></i>
                  <p className="mt-3">No documents found. Try adjusting your filters or upload a new document.</p>
                </div>
              ) : view === 'grid' ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {filteredDocuments.map(document => (
                    <div key={document.id} className="col">
                      <div className="card h-100">
                        <div className="card-body" onClick={() => handleDocumentSelect(document)} style={{ cursor: 'pointer' }}>
                          <div className="text-center mb-3">
                            <i className={`bi ${getFileIcon(document.fileType)} text-primary`} style={{ fontSize: '3rem' }}></i>
                          </div>
                          <h5 className="card-title text-truncate">{document.name}</h5>
                          <p className="card-text small text-muted">{document.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-primary">{document.category}</span>
                            <span className={`badge ${document.status === 'Approved' ? 'bg-success' : 
                                                   document.status === 'Under Review' ? 'bg-warning' : 
                                                   document.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                              {document.status}
                            </span>
                          </div>
                        </div>
                        <div className="card-footer bg-white">
                          <div className="d-flex justify-content-between align-items-center small text-muted">
                            <div>v{document.version}</div>
                            <div>{formatFileSize(document.fileSize)}</div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <div className="small text-muted">
                              Updated {new Date(document.lastUpdated).toLocaleDateString()}
                            </div>
                            <div className="dropdown">
                              <button className="btn btn-sm btn-outline-secondary" type="button" id={`dropdownMenuButton-${document.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-three-dots"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${document.id}`}>
                                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleDocumentSelect(document); }}>View Details</a></li>
                                <li><a className="dropdown-item" href="#">Download</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Share</a></li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Version</th>
                        <th>Status</th>
                        <th>Size</th>
                        <th>Updated</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map(document => (
                        <tr key={document.id} onClick={() => handleDocumentSelect(document)} style={{ cursor: 'pointer' }}>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className={`bi ${getFileIcon(document.fileType)} text-primary me-2`} style={{ fontSize: '1.5rem' }}></i>
                              <div>
                                <div className="fw-bold">{document.name}</div>
                                <div className="text-muted small">{document.description}</div>
                              </div>
                            </div>
                          </td>
                          <td>{document.category}</td>
                          <td>v{document.version}</td>
                          <td>
                            <span className={`badge ${document.status === 'Approved' ? 'bg-success' : 
                                            document.status === 'Under Review' ? 'bg-warning' : 
                                            document.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
                              {document.status}
                            </span>
                          </td>
                          <td>{formatFileSize(document.fileSize)}</td>
                          <td>{new Date(document.lastUpdated).toLocaleDateString()}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-sm btn-outline-secondary" type="button" id={`dropdownMenuButton-list-${document.id}`} data-bs-toggle="dropdown" aria-expanded="false" onClick={(e) => e.stopPropagation()}>
                                <i className="bi bi-three-dots"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-list-${document.id}`}>
                                <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleDocumentSelect(document); }}>View Details</a></li>
                                <li><a className="dropdown-item" href="#">Download</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Share</a></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Upload Document</h5>
                <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <div className="modal-body">
                <DocumentUploadForm 
                  onUpload={handleDocumentUpload}
                  onCancel={() => setShowUploadModal(false)}
                  projectId={projectId}
                  categories={categories.filter(cat => cat !== 'all')}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Viewer Modal */}
      {showViewerModal && selectedDocument && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewerModal(false)}></button>
              </div>
              <div className="modal-body">
                <DocumentViewer 
                  document={selectedDocument}
                  onClose={() => setShowViewerModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentRepository;
