const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    disease: {
      type: String,
      enum: ["heart", "diabetes", "breast", "lung"],
      required: true,
    },
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    result: {
      prediction: Number,
      resultText: String,
      confidence: Number,
      riskLevel: String,
      model: String,
      version: String,
    },
    imagePath: {
      type: String,
      default: null,
    },
    reportPath: {
      type: String,
      default: null,
    },
    processingTime: {
      type: Number, // milliseconds
    },
  },
  { timestamps: true }
);

// Index for fast user-based queries
predictionSchema.index({ user: 1, createdAt: -1 });
predictionSchema.index({ disease: 1 });

module.exports = mongoose.model("Prediction", predictionSchema);
