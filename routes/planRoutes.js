const express = require('express');
const router = express.Router();
const { protect, superAdmin } = require('../middleware/authMiddleware');
const {
  getPlans,
  createPlan,  // <-- MUST BE IMPORTED
  updatePlan,
  deletePlan
} = require('../controllers/planController');

router.route('/')
  .get(getPlans)
  .post(protect, superAdmin, createPlan);  // <-- CORRECT MIDDLEWARE

router.route('/:id')
  .put(protect, superAdmin, updatePlan)
  .delete(protect, superAdmin, deletePlan);

module.exports = router;