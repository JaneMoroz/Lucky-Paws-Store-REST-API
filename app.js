const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const productRoutes = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const viewRouter = require('./routes/viewRoutes');
const orderController = require('./controllers/orderController');

const app = express();

// Trust proxies
app.enable('trust proxy');

// Setting PUG view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

////////////////////////////////////////////////////////////////
// Global Middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:', 'blob:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: [
        "'self'",
        'https:',
        'http:',
        'blob:',
        'https://*.stripe.com',
        'data:',
        'ws:',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
      objectSrc: ["'none'"],
      workerSrc: ["'self'", 'data:', 'blob:'],
      childSrc: ["'self'", 'https:', 'blob:'],
      imgSrc: ["'self'", 'https: data:'],
      connectSrc: ["'self'", 'blob:', 'https:', 'ws:'],
    },
  })
);

// Implement Cors
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Exmple of requests limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 request from one IP in one hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Stripe Webhook
// app.post(
//   '/webhook-checkout',
//   express.raw({ type: 'application/json' }),
//   orderController.webhookCheckout
// );

// Express middleware: body parser, reading data from body into rq.body
app.use(express.json({ limit: '10kb' }));

// To get data from the body, when using submit/post on the form directly
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// To parse data from cookies
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['color', 'style', 'brand', 'animal', 'ratingsAverage', 'price'],
  })
);

app.use(compression());

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
