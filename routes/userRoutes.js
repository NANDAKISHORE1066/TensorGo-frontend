const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createUser,  // MUST MATCH CONTROLLER EXPORT NAME
  getUsers     // MUST MATCH CONTROLLER EXPORT NAME
} = require('../controllers/userController');

router.route('/')
  .post(protect, createUser)
  .get(protect, getUsers);

module.exports = router;