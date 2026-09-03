const router = require('express').Router();
const authenticate = require('../middlewares/auth.middleware');
const { listStoresForUser } = require('../controllers/store.controller');

router.get('/', authenticate, listStoresForUser);

module.exports = router;
