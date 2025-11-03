require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const shareRoutes = require('./routes/shareRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Izinkan semua origin
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files dari folder uploads
// Di cPanel: /home/username/public_html/uploads
const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../public_html/uploads');
app.use('/uploads', express.static(uploadDir));

// Routes
// PENTING: Semua routes sudah menggunakan prefix /api
app.use('/api/auth', authRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/share', shareRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'UMKM Marketplace API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Root endpoint - untuk testing apakah server berjalan
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UMKM Marketplace API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      buyer: '/api/buyer',
      seller: '/api/seller',
      products: '/api/products',
      categories: '/api/categories',
      share: '/api/share'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedPath: req.originalUrl
  });
});

// Error handler (harus di paling bawah)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

// Listen - di cPanel shared hosting, gunakan 127.0.0.1 atau localhost
app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🌐 API accessible at:`);
  console.log(`   - http://${HOST}:${PORT}/api`);
  console.log(`   - Health check: http://${HOST}:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
