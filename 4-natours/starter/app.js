const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const globalErrorHandler = require('./controllers/errorController');

// 1) GLOBAL MIDDLEWARES

app.use(express.static(path.join(__dirname, 'public')));
// set Security HTTP headers
app.use(helmet());

// Limit requests from the same API

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in 1 hour',
});
// dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // Middleware to parse everything to JSON

// Data sanitisation against noSQL query injection
app.use(mongoSanitize());

// Data sanitisation against XSS

app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('/{*splat}', (req, res, next) => {
  // Just * in newer versions

  next(new AppError(`Can't find ${req.originalUrl} on this server!`));
});
app.use(globalErrorHandler);

module.exports = app;
