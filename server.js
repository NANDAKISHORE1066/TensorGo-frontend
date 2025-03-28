require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 1. Connect Database
connectDB();

// 2. Middleware
app.use(express.json());


app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
  }));

// 3. Routes
app.use('/api/users', require('./routes/userRoutes'));


app.use('/webhook', express.raw({ type: 'application/json' }));

// 4. Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5001;  // Change from 5000 to 5001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));