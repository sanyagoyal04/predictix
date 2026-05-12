"""
Heart Disease Prediction Script
Called by Node.js as: python predict_heart.py <json_input>
Output: JSON with prediction and confidence
"""

import sys
import json
import numpy as np
import joblib
import os

def predict(features):
    base = os.path.dirname(os.path.abspath(__file__))
    model = joblib.load(os.path.join(base, "models", "heart_model.pkl"))
    scaler = joblib.load(os.path.join(base, "models", "heart_scaler.pkl"))

    feat_names = [
        "age", "sex", "cp", "trestbps", "chol", "fbs",
        "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
    ]
    X = np.array([[features[f] for f in feat_names]])
    X_sc = scaler.transform(X)

    prediction = int(model.predict(X_sc)[0])
    prob = float(model.predict_proba(X_sc)[0][1])
    confidence = round(prob * 100, 2)

    risk_level = "High" if prob >= 0.7 else "Moderate" if prob >= 0.4 else "Low"

    return {
        "prediction": prediction,
        "result": "Heart Disease Detected" if prediction == 1 else "No Heart Disease",
        "confidence": confidence,
        "risk_level": risk_level,
        "model": "Logistic Regression",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.argv[1])
        result = predict(input_data)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
