/**
 * Main Express server for James Kuria's Portfolio Website
 * Handles contact form submissions via Resend email service
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

// Import routes
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - required for platforms like Vercel/Cloudflare to get real client IPs
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skip: (req) => process.env.NODE_ENV === "development",
});

// Apply rate limiting to contact form
app.use("/api/contact", limiter);

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, "..")));

// API routes
app.use("/api", contactRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running perfectly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Catch-all handler for SPA routing (serve index.html for any non-API routes)
app.get("*", (req, res) => {
  // Only serve index.html for routes that don't start with /api
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "..", "index.html"));
  } else {
    res.status(404).json({
      success: false,
      message: "API endpoint not found",
    });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Don't leak error details in production
  const message =
    process.env.NODE_ENV === "production"
      ? "Something went wrong on our end"
      : err.message;

  res.status(err.status || 500).json({
    success: false,
    message: message,
  });
});

// Only start the server when running as a standalone server (not in Vercel serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(
      `📧 Email configured: ${process.env.EMAIL_USER ? "Yes" : "No"}`
    );
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, "..")}`);
  });
}

module.exports = app;
