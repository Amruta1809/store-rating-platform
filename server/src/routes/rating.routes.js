const router = require('express').Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { submitRatingValidator } = require('../validators/rating.validator');
const { upsertRating } = require('../controllers/rating.controller');

// Only normal users submit/modify ratings
router.put('/:storeId', authenticate, authorize('NORMAL'), submitRatingValidator, validate, upsertRating);

module.exports = router;
