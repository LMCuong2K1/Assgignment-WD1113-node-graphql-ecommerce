require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Setup GraphQL
    await app.setupGraphQL();

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
      console.log(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
})
process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});

startServer();
