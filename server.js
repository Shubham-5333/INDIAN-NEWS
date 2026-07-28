const app = require('./app');
const connectDB = require('./config/db');
const { seedInitialData } = require('./seed/seedData');

const PORT = process.env.PORT || 5001;

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedInitialData();

    app.listen(PORT, () => {
      console.log(`==================================================`);
      console.log(`🚀 Indian News Express Server running on Port ${PORT}`);
      console.log(`🌐 Public API: http://localhost:${PORT}/api/news`);
      console.log(`🔐 Admin Auth: http://localhost:${PORT}/api/auth/login`);
      console.log(`==================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
