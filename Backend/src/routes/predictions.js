const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  predictHeart, predictDiabetes, predictBreast, predictLung,
  getHistory, downloadReport, getStats,
} = require("../controllers/predictionController");
const { protect } = require("../middlewares/auth");
const { upload } = require("../middlewares/upload");

const router = express.Router();

// Rate limit: max 20 predictions per minute per user
const predLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: "Too many prediction requests. Please try again later." },
});

// All prediction routes require auth + rate limiting
router.use(protect);
router.use("/predict", predLimit);

router.post("/predict/heart", predictHeart);
router.post("/predict/diabetes", predictDiabetes);
router.post("/predict/breast", upload.single("image"), predictBreast);
router.post("/predict/lung", upload.single("image"), predictLung);

router.get("/history", getHistory);
router.get("/stats", getStats);
router.get("/report/:id", downloadReport);

module.exports = router;
