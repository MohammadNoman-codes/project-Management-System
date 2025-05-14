const db = require('../config/dbConfig');

class Risk {
  // Get all risks for a project
  static getAll(projectId, callback) {
    const query = `
      SELECT * FROM risks
      WHERE project_id = ?
      ORDER BY risk_score DESC
    `;
    
    db.all(query, [projectId], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      
      // Parse JSON strings to arrays
      const risks = rows.map(risk => ({
        ...risk,
        triggers: JSON.parse(risk.triggers || '[]')
      }));
      
      callback(null, risks);
    });
  }
  
  // Get risk by ID
  static getById(id, callback) {
    const query = `
      SELECT * FROM risks
      WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!row) {
        return callback(null, null);
      }
      
      // Parse JSON strings to arrays
      const risk = {
        ...row,
        triggers: JSON.parse(row.triggers || '[]')
      };
      
      callback(null, risk);
    });
  }
  
  // Create new risk
  static create(riskData, callback) {
    const {
      project_id,
      title,
      description,
      category,
      probability,
      impact,
      risk_score,
      status,
      owner_id,
      owner_name,
      identified_date,
      mitigation_plan,
      contingency_plan,
      triggers,
      review_date
    } = riskData;
    
    const query = `
      INSERT INTO risks (
        project_id,
        title,
        description,
        category,
        probability,
        impact,
        risk_score,
        status,
        owner_id,
        owner_name,
        identified_date,
        mitigation_plan,
        contingency_plan,
        triggers,
        review_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      query,
      [
        project_id,
        title,
        description,
        category,
        probability,
        impact,
        risk_score,
        status,
        owner_id,
        owner_name,
        identified_date,
        mitigation_plan,
        contingency_plan,
        triggers,
        review_date
      ],
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        // Parse triggers back to array for response
        const responseData = {
          ...riskData,
          id: this.lastID,
          triggers: JSON.parse(triggers || '[]')
        };
        
        callback(null, responseData);
      }
    );
  }
  
  // Update risk
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
