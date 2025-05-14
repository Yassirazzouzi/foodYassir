import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRoutes from './routes/foodRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound, rateLimiter, requestLogger } from './middleware/middlware.js';
import dotenv from 'dotenv';
import UserRouter from './routes/userRoute.js';

// Environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define allowed origins
const allowedOrigins = [
  
];

// More specific CORS configuration
app.use(cors({
  origin: 'http://localhost:4000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Rate limiter
app.use(rateLimiter(100, 15 * 60 * 1000));

// Routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', UserRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));

// Export the Express app for Vercel
export default app;