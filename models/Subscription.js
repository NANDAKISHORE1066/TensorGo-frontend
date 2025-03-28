const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true }, // e.g., "Basic", "Standard", "Plus"
  stripeSubscriptionId: { type: String },
  status: { type: String, enum: ['active', 'canceled', 'pending'], default: 'pending' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
