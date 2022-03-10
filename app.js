const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const productRoutes = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');

const app = express();

////////////////////////////////////////////////////////////////
// Global Middlewares

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Express middleware: body parser, reading data from body into rq.body
app.use(express.json());

////////////////////////////////////////////////////////////////
// Routes

// Products
app.use('/api/v1/products', productRoutes);

// Users
app.use('/api/v1/users', userRouter);

// Reviews
app.use('/api/v1/reviews', reviewRouter);

// Cart
app.use('/api/v1/cart', cartRouter);

////////////////////////////////////////////////////////////////
// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

////////////////////////////////////////////////////////////////
// Errors handling Middleware
app.use(globalErrorHandler);

module.exports = app;
