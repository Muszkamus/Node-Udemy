const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must be under 40 characters'],
      minLength: [10, 'A tour name must be over 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], // Only text
    },

    slug: String,
    duration: {
      type: Number,
      required: [true, 'A your must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a groups size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, `Rating must be equal or above 1.0`],
      max: [5, 'Rating must be equal or less than 5'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Only works when creating, not updating
          return val < this.price; // returns true as discounted price should always be more than actual price
        },
        message:
          'Discount price ({VALUE}) should always be below the regular price ({VALUE})',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have cover image'],
    },
    image: [String],
    createdAt: { type: Date, default: Date.now, select: false },
    startDates: [Date],
    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middlewawe: Rund before save() command and create()....
tourSchema.pre(`save`, function () {
  this.slug = slugify(this.name, { lower: true });
});

// tourSchema.pre(`save`, function () {
//   console.log('Will save document...');
// });

// tourSchema.post(`save`, function (doc) {
//   console.log(doc);
// });

// Query middleware

tourSchema.pre(/^find/, function () {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
});

tourSchema.post(/^find/, function (docs) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
});

// Aggregation Middleware

tourSchema.pre(`aggregate`, function () {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this);
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
