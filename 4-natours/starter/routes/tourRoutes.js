const express = require('express');
const fs = require('fs');

const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkID);

// Create a checkBody middleware
// Check if body contains the name and price property
// return 400 if invalid
// Add it to the post handler stack

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.checkBody, tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
