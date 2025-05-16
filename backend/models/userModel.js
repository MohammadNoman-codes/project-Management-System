const db = require('../config/dbConfig');

class User {
  // Get all users
  static getAll(callback) {
    const query = `
      SELECT * FROM users
      ORDER BY name ASC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, rows);
    });
  }
  
  // Get user by ID
  static getById(id, callback) {
    const query = `
      SELECT * FROM users WHERE id = ?
    `;
    
    db.get(query, [id], (err, row) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, row);
    });
  }
  
  // Create new user
  static create(userData, callback) {
    const {
      name,
      email,
      password,
      role,
      department,
      avatar
    } = userData;
    
    const query = `
      INSERT INTO users (
        name, 
        email, 
        password, 
        role, 
        department, 
        avatar,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    db.run(
      query, 
      [
        name, 
        email, 
        password, 
        role || 'User', 
        department, 
        avatar || 'https://via.placeholder.com/40'
      ], 
      function(err) {
        if (err) {
          return callback(err, null);
        }
        callback(null, { id: this.lastID, ...userData });
      }
    );
  }
  
  // Update user
  static update(id, userData, callback) {
    const updateFields = [];
    const params = [];
    
    // Helper to add field if it exists in userData
    const addFieldIfExists = (fieldName, dbFieldName = fieldName) => {
      if (userData[fieldName] !== undefined) {
        updateFields.push(`${dbFieldName} = ?`);
        params.push(userData[fieldName]);
      }
    };
    
    // Add all possible fields
    addFieldIfExists('name');
    addFieldIfExists('email');
    addFieldIfExists('password');
    addFieldIfExists('role');
    addFieldIfExists('department');
    addFieldIfExists('avatar');
    
    // Add updated_at timestamp
    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    
    // If no fields to update, return error
    if (updateFields.length === 0) {
      return callback(new Error('No fields to update'), null);
    }
    
    const query = `
      UPDATE users
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
        // No rows were updated (user not found)
        return callback(null, null);
      }
      
      User.getById(id, callback);
    });
  }
  
  // Delete user
  static delete(id, callback) {
    const query = `DELETE FROM users WHERE id = ?`;
    
    db.run(query, [id], function(err) {
      if (err) {
        return callback(err, null);
      }
      
      callback(null, { id, deleted: this.changes > 0 });
    });
  }
}

module.exports = User;
