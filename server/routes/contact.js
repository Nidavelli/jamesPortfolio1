/**
 * Contact form route handler
 * Handles POST requests to /api/contact
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const router = express.Router();

// Initialize Nodemailer using Gmail with App Password (or generic SMTP via env)
const mailTransporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  : nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

// Verify transporter configuration on startup
mailTransporter.verify(function (error) {
  if (error) {
    console.error('❌ Email transporter verification failed:', error);
    console.error('Please check your email credentials in environment variables');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

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

    // Send email using Nodemailer
    const emailData = await mailTransporter.sendMail({
      from: `Portfolio Contact Form <${process.env.EMAIL_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
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
    console.log(`📧 Message ID: ${emailData.messageId}`);

    // Send success response
    res.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.',
      timestamp: timestamp
    });

  } catch (error) {
    console.error('❌ Error sending contact form email:', error);

    let errorMessage = 'Failed to send message. Please try again later.';
    if (error && error.code === 'EAUTH') {
      console.error('Authentication failed - check EMAIL_USER and EMAIL_APP_PASSWORD or SMTP credentials');
      errorMessage = 'Email service configuration error. Please contact the site administrator.';
    } else if (error && error.code === 'ESOCKET') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }

    res.status(500).json({
      success: false,
      message: errorMessage
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
