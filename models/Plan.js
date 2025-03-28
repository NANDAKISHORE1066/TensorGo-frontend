const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: String, 
    enum: ['14-days', 'annual'], 
    required: true 
  },
  maxUsers: { 
    type: Number, 
    required: true 
  },
  description: String,
  stripePriceId: String,
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Plan', planSchema);