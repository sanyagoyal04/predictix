"""
Lung Cancer Prediction Script
Called by Node.js as: python predict_lung.py <image_path>
"""

import sys
import json
import numpy as np
import os

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

def predict(image_path):
    import tensorflow as tf
    from tensorflow.keras.preprocessing.image import load_img, img_to_array

    base = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base, "models", "lung_inception_model.keras")

    model = tf.keras.models.load_model(model_path)

    img = load_img(image_path, target_size=(299, 299))
    arr = img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    prob = float(model.predict(arr, verbose=0)[0][0])
    prediction = 1 if prob >= 0.5 else 0
    confidence = round((prob if prediction == 1 else 1 - prob) * 100, 2)

    risk_level = "High" if prob >= 0.7 else "Moderate" if prob >= 0.4 else "Low"

    return {
        "prediction": prediction,
        "result": "Lung Cancer Detected" if prediction == 1 else "No Cancer Detected",
        "confidence": confidence,
        "risk_level": risk_level,
        "model": "InceptionResNetV2 (Transfer Learning)",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    try:
        image_path = sys.argv[1]
        result = predict(image_path)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)
