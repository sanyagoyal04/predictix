const { spawn } = require("child_process");
const path = require("path");

const ML_PATH = path.resolve(__dirname, "../../..", "ML");

/**
 * Run a Python prediction script and return parsed JSON result
 * @param {string} scriptName - Python script filename
 * @param {string|object} arg - JSON string or path argument
 * @returns {Promise<object>} Prediction result
 */
const runPythonScript = (scriptName, arg) => {
  return new Promise((resolve, reject) => {
    const argStr = typeof arg === "object" ? JSON.stringify(arg) : arg;
    const scriptPath = path.join(ML_PATH, scriptName);

    const py = spawn("python3", [scriptPath, argStr]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => { stdout += data.toString(); });
    py.stderr.on("data", (data) => { stderr += data.toString(); });

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Python error: ${stderr || "Unknown error"}`));
      }
      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${stdout}`));
      }
    });

    py.on("error", (err) => {
      reject(new Error(`Failed to spawn Python process: ${err.message}`));
    });
  });
};

module.exports = { runPythonScript };
