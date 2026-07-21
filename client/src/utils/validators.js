/**
 * Validates Email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates Password requirements (min 8 chars)
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

/**
 * Full Register form validation
 * @param {Object} formData
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateRegisterForm = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(password)) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Full Login form validation
 * @param {Object} formData
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
