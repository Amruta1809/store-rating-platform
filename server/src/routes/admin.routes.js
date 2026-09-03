const router = require('express').Router();
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserValidator } = require('../validators/user.validator');
const { createStoreValidator } = require('../validators/store.validator');
const {
  dashboard,
  createUser,
  listUsers,
  getUserDetail,
  listStores,
  createStore,
} = require('../controllers/admin.controller');

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', dashboard);

router.get('/users', listUsers);
router.get('/users/:id', getUserDetail);
router.post('/users', createUserValidator, validate, createUser);

router.get('/stores', listStores);
router.post('/stores', createStoreValidator, validate, createStore);

module.exports = router;
