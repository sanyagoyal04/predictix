const Prediction = require("../models/Prediction");
const { runPythonScript } = require("../utils/runPython");
const { predictionCounter, predictionDuration, predictionConfidence } = require("../utils/metrics");
const { generatePDFReport } = require("../utils/pdfGenerator");
const logger = require("../utils/logger");

// ── Generic handler factory ─────────────────────────────────────────────────
const makePrediction = (disease, scriptName, inputExtractor) => async (req, res) => {
  const startTime = Date.now();
  const timer = predictionDuration.startTimer({ disease });

  try {
    const input = inputExtractor(req);
    const mlResult = await runPythonScript(scriptName, input);

    const processingTime = Date.now() - startTime;
    timer();

    // Track Prometheus metrics
    predictionCounter.inc({ disease, result: mlResult.result });
    predictionConfidence.set({ disease }, mlResult.confidence);

    // Save to MongoDB
    const prediction = await Prediction.create({
      user: req.user.id,
      disease,
      inputData: input,
      result: {
        prediction: mlResult.prediction,
        resultText: mlResult.result,
        confidence: mlResult.confidence,
        riskLevel: mlResult.risk_level,
        model: mlResult.model,
        version: mlResult.version,
      },
      imagePath: req.file ? req.file.path : null,
      processingTime,
    });

    logger.info(`Prediction [${disease}] for user ${req.user.id}: ${mlResult.result} (${mlResult.confidence}%)`);

    res.json({
      success: true,
      predictionId: prediction._id,
      ...mlResult,
      processingTime,
    });
  } catch (err) {
    timer();
    logger.error(`Prediction error [${disease}]: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Disease Controllers ──────────────────────────────────────────────────────
const predictHeart = makePrediction("heart", "predict_heart.py", (req) => req.body);
const predictDiabetes = makePrediction("diabetes", "predict_diabetes.py", (req) => req.body);

const predictBreast = makePrediction("breast", "predict_breast.py", (req) => {
  if (!req.file) throw new Error("Image file is required");
  return req.file.path;
});

const predictLung = makePrediction("lung", "predict_lung.py", (req) => {
  if (!req.file) throw new Error("Image file is required");
  return req.file.path;
});

// ── History ──────────────────────────────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const { disease, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };
    if (disease) query.disease = disease;

    const total = await Prediction.countDocuments(query);
    const predictions = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      predictions,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Download PDF Report ──────────────────────────────────────────────────────
const downloadReport = async (req, res) => {
  try {
    const prediction = await Prediction.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("user", "fullName email");

    if (!prediction) {
      return res.status(404).json({ message: "Prediction not found" });
    }

    const pdfBytes = await generatePDFReport(prediction);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="predictix-report-${prediction._id}.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Failed to generate PDF report" });
  }
};

// ── Stats ─────────────────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await Prediction.aggregate([
      { $match: { user: require("mongoose").Types.ObjectId.createFromHexString(userId) } },
      { $group: { _id: "$disease", count: { $sum: 1 } } },
    ]);
    const total = await Prediction.countDocuments({ user: userId });
    res.json({ stats, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { predictHeart, predictDiabetes, predictBreast, predictLung, getHistory, downloadReport, getStats };
