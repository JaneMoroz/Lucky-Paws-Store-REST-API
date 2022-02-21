const express = require('express');
const morgan = require('morgan');

const app = express();

////////////////////////////////////////////////////////////////
// Global Middlewares

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////////////////////////////////////////////
// Routes

// Products

// Users

// Reviews

module.exports = app;
