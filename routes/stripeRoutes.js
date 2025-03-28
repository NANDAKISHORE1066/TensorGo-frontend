const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createCheckoutSession, 
  handleWebhook 
} = require('../controllers/stripeController');

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', handleWebhook);

module.exports = router;