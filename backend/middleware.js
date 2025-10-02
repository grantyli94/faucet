const express = require('express');
const cors = require('cors');

// Rate limiting storage
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to check rate limiting
function isRateLimited(address) {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(address.toLowerCase());
  
  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW) {
    return true;
  }
  
  return false;
}

// Helper function to update rate limiting
function updateRateLimit(address) {
  rateLimitMap.set(address.toLowerCase(), Date.now());
}

// CORS middleware
const corsMiddleware = cors();

// JSON parsing middleware
const jsonMiddleware = express.json();

// Rate limiting middleware for faucet requests
const rateLimitMiddleware = (req, res, next) => {
  // Only apply rate limiting to POST requests to /api/faucet
  if (req.method === 'POST' && req.path === '/api/faucet') {
    const { address } = req.body;
    
    if (address && isRateLimited(address)) {
      return res.status(429).json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again in 24 hours.' 
      });
    }
  }
  
  next();
};

// Error handling middleware
const errorHandlerMiddleware = (err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
};

// 404 handler middleware
const notFoundMiddleware = (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
};

// Function to apply all middleware to an Express app
const applyMiddleware = (app) => {
  // Basic middleware
  app.use(corsMiddleware);
  app.use(jsonMiddleware);
  
  // Rate limiting middleware
  app.use(rateLimitMiddleware);
};

// Function to apply error handling middleware (should be called after routes)
const applyErrorHandling = (app) => {
  // Error handling middleware
  app.use(errorHandlerMiddleware);
  
  // 404 handler (should be last)
  app.use(notFoundMiddleware);
};

module.exports = {
  corsMiddleware,
  jsonMiddleware,
  rateLimitMiddleware,
  errorHandlerMiddleware,
  notFoundMiddleware,
  applyMiddleware,
  applyErrorHandling,
  isRateLimited,
  updateRateLimit,
  RATE_LIMIT_WINDOW
};
