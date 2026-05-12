const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

const COLORS = {
  primary: rgb(0.11, 0.47, 0.78),      // #1B78C7
  danger: rgb(0.88, 0.16, 0.24),       // #E12940
  success: rgb(0.09, 0.69, 0.45),      // #17B072
  warning: rgb(0.95, 0.6, 0.07),       // #F2991A
  gray: rgb(0.5, 0.5, 0.5),
  dark: rgb(0.1, 0.1, 0.1),
  light: rgb(0.96, 0.96, 0.98),
};

const getRiskColor = (riskLevel) => {
  if (riskLevel === "High") return COLORS.danger;
  if (riskLevel === "Moderate") return COLORS.warning;
  return COLORS.success;
};

const generatePDFReport = async (prediction) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const disease = prediction.disease.charAt(0).toUpperCase() + prediction.disease.slice(1);
  const result = prediction.result;
  const user = prediction.user;

  // ── Header background ────────────────────────────────────────────────────
  page.drawRectangle({
    x: 0, y: height - 120, width, height: 120, color: COLORS.primary,
  });

  // Logo text
  page.drawText("PredictiX", {
    x: 40, y: height - 52, size: 28, font: boldFont, color: rgb(1, 1, 1),
  });
  page.drawText("AI-Powered Disease Prediction Platform", {
    x: 40, y: height - 78, size: 11, font: regularFont, color: rgb(0.85, 0.90, 1.0),
  });

  // Report date
  page.drawText(`Report Date: ${new Date(prediction.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })}`, {
    x: 40, y: height - 106, size: 9, font: regularFont, color: rgb(0.8, 0.85, 1.0),
  });

  // ── Report Title ────────────────────────────────────────────────────────
  page.drawText(`${disease} Disease Prediction Report`, {
    x: 40, y: height - 160, size: 20, font: boldFont, color: COLORS.dark,
  });

  // ── Divider ──────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: 40, y: height - 175 }, end: { x: width - 40, y: height - 175 },
    thickness: 1.5, color: COLORS.primary,
  });

  // ── Patient Info ─────────────────────────────────────────────────────────
  let y = height - 210;
  page.drawText("Patient Information", {
    x: 40, y, size: 13, font: boldFont, color: COLORS.primary,
  });
  y -= 22;

  const patientInfo = [
    ["Name", user?.fullName || "—"],
    ["Email", user?.email || "—"],
    ["Prediction ID", prediction._id.toString()],
    ["Date & Time", new Date(prediction.createdAt).toLocaleString()],
  ];

  for (const [label, value] of patientInfo) {
    page.drawText(`${label}:`, { x: 40, y, size: 10, font: boldFont, color: COLORS.gray });
    page.drawText(value, { x: 160, y, size: 10, font: regularFont, color: COLORS.dark });
    y -= 18;
  }

  // ── Prediction Result Box ────────────────────────────────────────────────
  y -= 20;
  const riskColor = getRiskColor(result?.riskLevel);
  const isPositive = result?.prediction === 1;
  const boxColor = isPositive ? rgb(1, 0.93, 0.93) : rgb(0.92, 1, 0.95);

  page.drawRectangle({ x: 40, y: y - 90, width: width - 80, height: 100, color: boxColor, borderColor: isPositive ? COLORS.danger : COLORS.success, borderWidth: 2 });

  page.drawText("Prediction Result", {
    x: 55, y: y - 18, size: 12, font: boldFont, color: COLORS.dark,
  });
  page.drawText(result?.resultText || "—", {
    x: 55, y: y - 40, size: 16, font: boldFont,
    color: isPositive ? COLORS.danger : COLORS.success,
  });
  page.drawText(`Confidence: ${result?.confidence}%   |   Risk Level: ${result?.riskLevel}`, {
    x: 55, y: y - 62, size: 11, font: regularFont, color: riskColor,
  });
  page.drawText(`ML Model: ${result?.model}   |   Model Version: ${result?.version}`, {
    x: 55, y: y - 80, size: 9, font: regularFont, color: COLORS.gray,
  });

  // ── Input Features ────────────────────────────────────────────────────────
  y -= 120;
  page.drawText("Input Features Submitted", {
    x: 40, y, size: 13, font: boldFont, color: COLORS.primary,
  });
  y -= 5;
  page.drawLine({
    start: { x: 40, y }, end: { x: width - 40, y },
    thickness: 0.5, color: COLORS.gray,
  });
  y -= 18;

  const inputEntries = Object.entries(prediction.inputData || {});
  let col = 0;
  for (const [key, val] of inputEntries) {
    const xPos = col === 0 ? 40 : 320;
    page.drawText(`${key}:`, { x: xPos, y, size: 9, font: boldFont, color: COLORS.gray });
    page.drawText(String(val), { x: xPos + 130, y, size: 9, font: regularFont, color: COLORS.dark });
    col++;
    if (col === 2) { col = 0; y -= 16; }
    if (y < 120) break;
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height: 60, color: COLORS.light });
  page.drawText("⚠  This report is for informational purposes only. Consult a qualified medical professional.", {
    x: 40, y: 36, size: 8, font: regularFont, color: COLORS.warning,
  });
  page.drawText("© 2025 PredictiX. All rights reserved.", {
    x: 40, y: 18, size: 8, font: regularFont, color: COLORS.gray,
  });
  page.drawText(`Processing Time: ${prediction.processingTime}ms`, {
    x: width - 200, y: 18, size: 8, font: regularFont, color: COLORS.gray,
  });

  return await pdfDoc.save();
};

module.exports = { generatePDFReport };
