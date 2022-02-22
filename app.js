const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

////////////////////////////////////////////////////////////////
// Global Middlewares

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

////////////////////////////////////////////////////////////////
// Routes

// Products

// Users

// Reviews

////////////////////////////////////////////////////////////////
// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

////////////////////////////////////////////////////////////////
// Errors handling Middleware
app.use(globalErrorHandler);

module.exports = app;
