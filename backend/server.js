const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
// HTTP request logger – dev format prints method, URL, status, response time
app.use(morgan('dev'));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running...');
});

// Job routes (IMPORTANT: must be above app.listen)
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Health-check endpoint – returns server uptime + DB state
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    db: dbState[mongoose.connection.readyState] ?? 'unknown',
  });
});

// Centralized error handling middlewares
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

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
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully shutting down...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await mongoose.connection.close(false);
      console.log('MongoDB connection closed.');
      if (process._mongod) {
        await process._mongod.stop();
        console.log('In-memory MongoDB stopped.');
      }
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown cleanup:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
