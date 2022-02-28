const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, reValueToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

// Create a new user
router.post('/new', [
    check('name', 'the name is required').not().isEmpty(),
    check('email', 'the email is required').isEmail(),
    check('password', 'the password is required').isLength({ min:6 }),
    validateFields
], createUser);

// user Login
router.post('/', [
    check('email', 'the email is required').isEmail(),
    check('password', 'the password is required').isLength({ min:6 }),
    validateFields
], loginUser);

// validate and Revalidate token
router.get('/renew',[validateJWT], reValueToken);

module.exports = router;