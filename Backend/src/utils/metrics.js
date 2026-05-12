const client = require("prom-client");

// Enable default metrics (CPU, memory, event loop, etc.)
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics
const predictionCounter = new client.Counter({
  name: "predictix_predictions_total",
  help: "Total number of predictions made",
  labelNames: ["disease", "result"],
  registers: [register],
});

const predictionDuration = new client.Histogram({
  name: "predictix_prediction_duration_seconds",
  help: "Time taken for ML prediction in seconds",
  labelNames: ["disease"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const predictionConfidence = new client.Gauge({
  name: "predictix_prediction_confidence",
  help: "Latest prediction confidence score",
  labelNames: ["disease"],
  registers: [register],
});

const activeUsers = new client.Gauge({
  name: "predictix_active_users",
  help: "Number of currently active users",
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "predictix_http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register],
});

module.exports = {
  register,
  predictionCounter,
  predictionDuration,
  predictionConfidence,
  activeUsers,
  httpRequestDuration,
};
