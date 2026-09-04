const router = require('express').Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { dashboard } = require('../controllers/storeOwner.controller');

router.get('/dashboard', authenticate, authorize('STORE_OWNER'), dashboard);

module.exports = router;
