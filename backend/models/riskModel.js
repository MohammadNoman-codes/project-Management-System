const db = require('../config/dbConfig');

class Risk {
  // Get all risks with optional project filter
  static getAll(projectId, callback) {
    let query = `
      SELECT r.*, u.name as owner_name, u.avatar as owner_avatar 
      FROM risks r
      LEFT JOIN users u ON r.owner_id = u.id
    `;
    
    const params = [];
    
    if (projectId) {
      query += ` WHERE r.project_id = ?`;
      params.push(projectId);
    }
    
    query += ` ORDER BY r.risk_score DESC, r.id`;
    
    db.all(query, params, (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      
      // Parse JSON triggers if they exist
      const risks = rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        probability: row.probability,
        impact: row.impact,
        risk_score: row.risk_score,
        status: row.status,
        mitigation_plan: row.mitigation_plan,
        contingency_plan: row.contingency_plan,
        owner_id: row.owner_id,
        owner_name: row.owner_name,
        owner_avatar: row.owner_avatar,
        triggers: JSON.parse(row.triggers || '[]'),
        identified_date: row.identified_date,
        review_date: row.review_date,
        project_id: row.project_id
      }));
      
      callback(null, risks);
    });
  }
  
  // Get a single risk by ID
  static getById(id, callback) {
    const query = `
      SELECT r.*, u.name as owner_name, u.avatar as owner_avatar 
      FROM risks r
      LEFT JOIN users u ON r.owner_id = u.id
      WHERE r.id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!row) {
        return callback(null, null);
      }
      
      // Parse JSON triggers if they exist
      const risk = {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        probability: row.probability,
        impact: row.impact,
        risk_score: row.risk_score,
        status: row.status,
        mitigation_plan: row.mitigation_plan,
        contingency_plan: row.contingency_plan,
        owner_id: row.owner_id,
        owner_name: row.owner_name,
        owner_avatar: row.owner_avatar,
        triggers: JSON.parse(row.triggers || '[]'),
        identified_date: row.identified_date,
        review_date: row.review_date,
        project_id: row.project_id
      };
      
      callback(null, risk);
    });
  }
  
  // Create a new risk
  static create(riskData, callback) {
    const {
      title,
      description,
      category,
      probability,
      impact,
      risk_score,
      status,
      mitigation_plan,
      contingency_plan,
      owner_id,
      triggers,
      identified_date,
      review_date,
      project_id
    } = riskData;
    
    const query = `
      INSERT INTO risks (
        title,
        description,
        category,
        probability,
        impact,
        risk_score,
        status,
        mitigation_plan,
        contingency_plan,
        owner_id,
        triggers,
        identified_date,
        review_date,
        project_id,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    // Convert triggers array to JSON string if it's not already a string
    const triggersJson = typeof triggers === 'string' ? 
      triggers : 
      JSON.stringify(triggers || []);
    
    db.run(
      query,
      [
        title,
        description,
        category,
        probability,
        impact,
        risk_score,
        status || 'Identified',
        mitigation_plan,
        contingency_plan,
        owner_id,
        triggersJson,
        identified_date || new Date().toISOString().split('T')[0],
        review_date,
        project_id
      ],
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        // Get the created risk with owner details
        Risk.getById(this.lastID, callback);
      }
    );
  }
  
  // Update an existing risk
  static update(id, riskData, callback) {
    // Build SET clause and parameters array dynamically based on provided data
    const updateFields = [];
    const params = [];
    
    // Helper to add field if it exists in riskData
    const addFieldIfExists = (fieldName, dbFieldName = fieldName) => {
      if (riskData[fieldName] !== undefined) {
        updateFields.push(`${dbFieldName} = ?`);
        params.push(riskData[fieldName]);
      }
    };
    
    // Add all possible fields
    addFieldIfExists('title');
    addFieldIfExists('description');
    addFieldIfExists('category');
    addFieldIfExists('probability');
    addFieldIfExists('impact');
    addFieldIfExists('risk_score');
    addFieldIfExists('status');
    addFieldIfExists('owner_id');
    addFieldIfExists('owner_name');
    addFieldIfExists('identified_date');
    addFieldIfExists('mitigation_plan');
    addFieldIfExists('contingency_plan');
    addFieldIfExists('triggers');
    addFieldIfExists('review_date');
    
    // Add updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // If no fields to update, return error
    if (updateFields.length === 0) {
      return callback(new Error('No fields to update'), null);
    }
    
    const query = `
      UPDATE risks
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    // Add id to params
    params.push(id);
    
    db.run(query, params, function(err) {
      if (err) {
        return callback(err, null);
      }
      
      if (this.changes === 0) {
        // No rows were updated (risk not found)
        return callback(null, null);
      }
      
      // Parse triggers back to array for response
      const responseData = {
        id,
        ...riskData,
        triggers: riskData.triggers ? JSON.parse(riskData.triggers) : undefined
      };
      
      callback(null, responseData);
    });
  }
  
  // Delete risk
  static delete(id, callback) {
    const query = `DELETE FROM risks WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      callback(null, { id, deleted: this.changes > 0 });
    });
  }
}

module.exports = Risk;
