const express = require('express');
const router = express.Router();
const { expressjwt: jwt } = require('express-jwt'); // ver 6.x 이후부터 알고리즘 지정해야 함
const auth = jwt({ 
  secret:  process.env.JWT_SECRET, 
  algorithms: ['HS256'],  // default algorithm
  // userProperty: 'payload'
  userProperty: 'req.auth'
});

const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlAuth = require('../controllers/authentication');

// locations
router
  .route('/locations')
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route('/locations/:locationid')
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);

// reviews
router
  .route('/locations/:locationid/reviews')
  .post(auth, ctrlReviews.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(ctrlReviews.reviewsReadOne)
  .put(auth, ctrlReviews.reviewsUpdateOne)
  .delete(auth, ctrlReviews.reviewsDeleteOne);

router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

module.exports = router;