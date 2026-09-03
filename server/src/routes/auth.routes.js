const router = require('express').Router();
const { signup, login, updatePassword, me } = require('../controllers/auth.controller');
const { signupValidator, loginValidator, updatePasswordValidator } = require('../validators/auth.validator');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.put('/password', authenticate, updatePasswordValidator, validate, updatePassword);
router.get('/me', authenticate, me);

module.exports = router;
