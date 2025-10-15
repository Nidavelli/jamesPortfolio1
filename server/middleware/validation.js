/**
 * Validation middleware for input sanitization and security
 */

const { body, validationResult } = require('express-validator');

/**
 * Sanitize and validate contact form input
 */
const sanitizeContactForm = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-'\.]+$/)
    .withMessage('Name contains invalid characters'),
  
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 254 })
    .withMessage('Email address is too long'),
  
  body('message')
    .trim()
    .escape()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .matches(/^[a-zA-Z0-9\s\.,!?\-@#$%^&*()_+=\[\]{}|\\:";'<>\/\n\r\t]*$/)
    .withMessage('Message contains invalid characters')
];

/**
 * Check for validation errors and return formatted response
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Please correct the following errors:',
      errors: formattedErrors
    });
  }
  
  next();
};

/**
 * Rate limiting configuration for different endpoints
 */
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs: windowMs,
    max: max,
    message: {
      success: false,
      message: message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message,
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

module.exports = {
  sanitizeContactForm,
  handleValidationErrors,
  createRateLimit
};
