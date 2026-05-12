require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/connect");
const logger = require("./utils/logger");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`🚀 PredictiX Backend running on http://localhost:${PORT}`);
    logger.info(`📊 Metrics available at http://localhost:${PORT}/metrics`);
    logger.info(`❤️  Health check at http://localhost:${PORT}/health`);
  });
};

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
