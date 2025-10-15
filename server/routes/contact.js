/**
 * Contact form route handler
 * Handles POST requests to /api/contact
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { Resend } = require('resend');
const router = express.Router();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation middleware
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
    .escape()
];

/**
 * POST /api/contact
 * Handle contact form submission
 */
router.post('/contact', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please correct the following errors:',
        errors: errors.array().map(err => err.msg)
      });
    }

    const { name, email, message } = req.body;
    const timestamp = new Date().toLocaleString();

    // Prepare email content
    const emailContent = `
New Contact Form Submission from Portfolio Website

From: ${name}
Email: ${email}
Date: ${timestamp}

Message:
${message}

---
This message was sent from the contact form on James Kuria's portfolio website.
    `.trim();

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>', // Using Resend's default domain
      to: [process.env.RECIPIENT_EMAIL],
      subject: `New Contact Form Submission from ${name}`,
      text: emailContent,
      replyTo: email,
      headers: {
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      }
    });

    // Log successful email send (without sensitive data)
    console.log(`✅ Contact form submitted successfully from ${email} at ${timestamp}`);
    console.log(`📧 Email ID: ${emailData.data?.id}`);

    // Send success response
    res.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.',
      timestamp: timestamp
    });

  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    
    // Handle specific Resend errors
    if (error.name === 'ResendError') {
      return res.status(500).json({
        success: false,
        message: 'Sorry, there was an issue sending your message. Please try again later or contact me directly at tmarn2004@gmail.com'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'Sorry, something went wrong on our end. Please try again later or contact me directly at tmarn2004@gmail.com'
    });
  }
});

/**
 * GET /api/contact
 * Health check for contact endpoint
 */
router.get('/contact', (req, res) => {
  res.json({
    success: true,
    message: 'Contact endpoint is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
