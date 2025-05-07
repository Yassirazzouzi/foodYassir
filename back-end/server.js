import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';  // Changed from named import to default import
import foodRoutes from './routes/foodRoute.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound, rateLimiter } from './middleware/middlware.js';
import dotenv from 'dotenv';

import UserRouter from './routes/userRoute.js'; // Add this import
// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Ajoutez tous vos ports frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour les headers additionnels
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Appliquer le rate limiter - 100 requêtes par 15 minutes
app.use(rateLimiter(100, 15 * 60 * 1000));

// Move all static file serving to one place, before routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Créer le dossier uploads s'il n'existe pas
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Add this before your routes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Add this before your routes
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

// Debug middleware
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// API routes
app.use('/api/foods', foodRoutes);
app.use('/api/users', UserRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Middleware de gestion des erreurs
app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Update your port configuration
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app; // Add this line for Vercel