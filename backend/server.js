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

// Job routes (IMPORTANT: must be above app.listen)
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// MongoDB Connection: prefer MONGO_URI, fallback to in-memory server for dev
const connectMongo = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected (MONGO_URI)');
    } else {
      // Use in-memory mongo for local dev to avoid blocking when no DB is provided
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB connected (in-memory)');
      // keep mongod reference to prevent GC
      process._mongod = mongod;
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // do not exit - keep server running so frontend can show friendly errors
  }
};

connectMongo();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));