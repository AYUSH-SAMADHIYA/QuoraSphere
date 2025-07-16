const express = require('express');
const router = express.Router();
const { getMyQuestions } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/me/questions', authMiddleware, getMyQuestions);

module.exports = router;
