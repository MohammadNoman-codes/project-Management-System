import React, { useState } from 'react';

function DocumentUploadForm({ onUpload, onCancel, projectId, categories = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: projectId || '',
    category: categories.length > 0 ? categories[0] : 'Other',
    tags: '',
    file: null
  });
  
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setSelectedFileName(file.name);
      
      // If no name is entered, use the file name
      if (!formData.name) {
        setFormData(prev => ({ ...prev, name: file.name }));
      }
    } else {
      setFormData(prev => ({ ...prev, file: null }));
      setSelectedFileName('');
    }
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Document name is required';
    if (!formData.file) newErrors.file = 'File is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate file upload
    setIsUploading(true);
    
    // In a real app, this would be an API call to upload the file
    setTimeout(() => {
      // Create document data object with file details
      const documentData = {
        ...formData,
        fileSize: formData.file.size,
        fileType: formData.file.type,
        uploadedBy: { id: 1, name: 'Current User' }, // This would come from auth context in a real app
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      onUpload(documentData);
      setIsUploading(false);
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="file" className="form-label">File *</label>
        <div className="input-group">
          <input 
            type="file" 
            className={`form-control ${errors.file ? 'is-invalid' : ''}`}
            id="file"
            onChange={handleFileChange}
            required
          />
          {errors.file && <div className="invalid-feedback">{errors.file}</div>}
        </div>
        {selectedFileName && (
          <div className="form-text">Selected file: {selectedFileName}</div>
        )}
      </div>
      
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Document Name *</label>
        <input 
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="3"
        ></textarea>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          >
            {categories.length > 0 ? (
              categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))
            ) : (
              <>
                <option value="Contract">Contract</option>
                <option value="Specification">Specification</option>
                <option value="Design">Design</option>
                <option value="Meeting Notes">Meeting Notes</option>
                <option value="Report">Report</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>
        
        <div className="col-md-6 mb-3">
          <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="e.g., design, report, final"
          />
        </div>
      </div>
      
      <div className="d-flex justify-content-end mt-4">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel} disabled={isUploading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isUploading}>
          {isUploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Uploading...
            </>
          ) : (
            <>Upload Document</>
          )}
        </button>
      </div>
    </form>
  );
}

export default DocumentUploadForm;
