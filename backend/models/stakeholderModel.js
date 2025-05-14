const db = require('../config/dbConfig');

class Stakeholder {
  // Get all stakeholders for a project
  static getAll(projectId, callback) {
    const query = `
      SELECT * FROM stakeholders
      WHERE project_id = ?
      ORDER BY name
    `;
    
    db.all(query, [projectId], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  
  // Get stakeholder by ID
  static getById(id, callback) {
    const query = `
      SELECT * FROM stakeholders
      WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      
      if (!row) {
        return callback(null, null);
      }
      
      callback(null, row);
    });
  }
  
  // Create stakeholder
  static create(stakeholderData, callback) {
    const {
      project_id,
      name,
      role,
      organization,
      contactInfo,
      category,
      priority,
      influence,
      interest,
      supportLevel,
      expectations,
      requirements,
      communicationPreference,
      communicationFrequency,
      engagementStrategy,
      notes,
      lastContactDate
    } = stakeholderData;
    
    // Handle JSON fields
    const contactInfoJson = JSON.stringify(contactInfo || {});
    const expectationsJson = JSON.stringify(expectations || []);
    const requirementsJson = JSON.stringify(requirements || []);
    
    const query = `
      INSERT INTO stakeholders (
        project_id,
        name,
        role,
        organization,
        contact_info,
        category,
        priority,
        influence,
        interest,
        support_level,
        expectations,
        requirements,
        communication_preference,
        communication_frequency,
        engagement_strategy,
        notes,
        last_contact_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(
      query,
      [
        project_id,
        name,
        role,
        organization,
        contactInfoJson,
        category,
        priority,
        influence,
        interest,
        supportLevel,
        expectationsJson,
        requirementsJson,
        communicationPreference,
        communicationFrequency,
        engagementStrategy,
        notes,
        lastContactDate
      ],
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        callback(null, { id: this.lastID, ...stakeholderData });
      }
    );
  }
  
  // Update stakeholder
  static update(id, stakeholderData, callback) {
    // Prepare fields similar to create method
    const {
      name,
      role,
      organization,
      contactInfo,
      category,
      priority,
      influence,
      interest,
      supportLevel,
      expectations,
      requirements,
      communicationPreference,
      communicationFrequency,
      engagementStrategy,
      notes,
      lastContactDate
    } = stakeholderData;
    
    // Handle JSON fields
    const contactInfoJson = JSON.stringify(contactInfo || {});
    const expectationsJson = JSON.stringify(expectations || []);
    const requirementsJson = JSON.stringify(requirements || []);
    
    const query = `
      UPDATE stakeholders
      SET name = ?,
          role = ?,
          organization = ?,
          contact_info = ?,
          category = ?,
          priority = ?,
          influence = ?,
          interest = ?,
          support_level = ?,
          expectations = ?,
          requirements = ?,
          communication_preference = ?,
          communication_frequency = ?,
          engagement_strategy = ?,
          notes = ?,
          last_contact_date = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(
      query,
      [
        name,
        role,
        organization,
        contactInfoJson,
        category,
        priority,
        influence,
        interest,
        supportLevel,
        expectationsJson,
        requirementsJson,
        communicationPreference,
        communicationFrequency,
        engagementStrategy,
        notes,
        lastContactDate,
        id
      ],
      function(err) {
        if (err) {
          return callback(err, null);
        }
        
        if (this.changes === 0) {
          return callback(null, null); // No stakeholder found with this ID
        }
        
        callback(null, { id, ...stakeholderData });
      }
    );
  }
  
  // Delete stakeholder
  static delete(id, callback) {
    const query = `DELETE FROM stakeholders WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      callback(null, { id, deleted: this.changes > 0 });
    });
  }
}

module.exports = Stakeholder;
