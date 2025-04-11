/**
 * Utility functions for working with database models
 */

/**
 * Get student's formatted status for display
 * @param {String} status - The status value from the database
 * @returns {Object} Formatted status with label, color and description
 */
export const getStudentStatusDetails = (status) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending Approval',
        color: 'warning',
        description: 'Your account is waiting for administrator approval.'
      };
    case 'active':
      return {
        label: 'Active',
        color: 'success',
        description: 'Your account is active and in good standing.'
      };
    case 'inactive':
      return {
        label: 'Inactive',
        color: 'error',
        description: 'Your account has been deactivated. Please contact administration.'
      };
    default:
      return {
        label: 'Unknown',
        color: 'default',
        description: 'Unable to determine account status.'
      };
  }
};

/**
 * Update a model document with validation
 * @param {Object} model - Mongoose model instance to update
 * @param {Object} updates - Object containing fields to update
 * @param {Array} allowedFields - Array of field names that are allowed to be updated
 * @returns {Object} Updated model instance
 */
export const safeUpdateModel = async (model, updates, allowedFields) => {
  // Only apply updates for fields that are allowed
  Object.keys(updates).forEach((update) => {
    if (allowedFields.includes(update)) {
      model[update] = updates[update];
    }
  });
  
  // Always update the timestamp
  model.updatedAt = Date.now();
  
  // Save and return the updated model
  return await model.save();
};

/**
 * Generate a random secure password 
 * @param {Number} length - Length of password to generate
 * @returns {String} Random password
 */
export const generateSecurePassword = (length = 10) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  
  // Ensure at least one of each character type
  password += charset.slice(0, 26).charAt(Math.floor(Math.random() * 26)); // lowercase
  password += charset.slice(26, 52).charAt(Math.floor(Math.random() * 26)); // uppercase
  password += charset.slice(52, 62).charAt(Math.floor(Math.random() * 10)); // number 
  password += charset.slice(62).charAt(Math.floor(Math.random() * (charset.length - 62))); // special
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}; 