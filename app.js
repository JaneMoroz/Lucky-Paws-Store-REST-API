const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const productRoutes = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// Setting PUG view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

////////////////////////////////////////////////////////////////
// Global Middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Express middleware: body parser, reading data from body into rq.body
app.use(express.json());

// Express middleware: body parser, reading data from body into rq.body
app.use(express.json({ limit: '10kb' }));

// To get data from the body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// To parse data from cookies
app.use(cookieParser());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

////////////////////////////////////////////////////////////////
// Routes

// Views
app.use('/', viewRouter);

// Products
app.use('/api/v1/products', productRoutes);

// Users
app.use('/api/v1/users', userRouter);

// Reviews
app.use('/api/v1/reviews', reviewRouter);

// Cart
app.use('/api/v1/cart', cartRouter);

// Order
app.use('/api/v1/order', orderRouter);

////////////////////////////////////////////////////////////////
// Handling Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

////////////////////////////////////////////////////////////////
// Errors handling Middleware
app.use(globalErrorHandler);

module.exports = app;
