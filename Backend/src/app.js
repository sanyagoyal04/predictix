require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { register, httpRequestDuration } = require("./utils/metrics");
const authRoutes = require("./routes/auth");
const predictionRoutes = require("./routes/predictions");
const logger = require("./utils/logger");

const app = express();

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:80',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, mobile apps)
    if (!origin) return callback(null, true);
    // Allow any *.vercel.app domain + configured origins
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── HTTP Request Duration Tracking ──────────────────────────────────────────
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({ method: req.method, route: req.route?.path || req.path, status: res.statusCode });
  });
  next();
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
    service: "predictix-backend",
  });
});

// ── Prometheus Metrics ───────────────────────────────────────────────────────
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
