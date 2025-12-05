const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// MongoDB Connection (mongoose v9 syntax)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/api/jobs', require('./routes/jobRoutes'));
