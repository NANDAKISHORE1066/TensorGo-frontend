const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');
const Plan = require('../models/Plan');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { planId, users = 1 } = req.body;
    const user = await User.findById(req.user.id);
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    // Calculate price based on plan
    let unitAmount;
    if (plan.name === 'Standard') unitAmount = 499900; // ₹4999.00
    if (plan.name === 'Plus') unitAmount = 399900;     // ₹3999.00

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: plan.name },
          unit_amount: unitAmount,
          recurring: { interval: 'year' }
        },
        quantity: users,
      }],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        users: users
      }
    });

    await Order.create({
      user: user.id,
      plan: plan.id,
      amount: (unitAmount * users) / 100,
      stripeSessionId: session.id,
      status: 'pending'
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const order = await Order.findOne({ stripeSessionId: session.id });
      if (order) {
        order.status = 'paid';
        await order.save();

        await User.findByIdAndUpdate(session.metadata.userId, {
          plan: session.metadata.planId
        });
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
    }
  }

  res.json({ received: true });
};