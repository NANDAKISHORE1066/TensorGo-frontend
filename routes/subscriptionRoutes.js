const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createSubscription, getUserSubscriptions } = require('../controllers/subscriptionController');

router.route('/').post(protect, createSubscription);
router.route('/user').get(protect, getUserSubscriptions);

module.exports = router;
