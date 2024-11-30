const express = require('express');
const { signup, login, profile } = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', auth, profile);

module.exports = router;
