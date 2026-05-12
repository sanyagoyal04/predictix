"""
Diabetes Prediction Model Training
Algorithm: Support Vector Machine (SVM)
Dataset: PIMA Indians Diabetes Dataset
"""

import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

os.makedirs("models", exist_ok=True)

# ── Synthetic PIMA-like dataset ─────────────────────────────────────────────
np.random.seed(42)
n = 768

pregnancies = np.random.randint(0, 17, n)
glucose = np.random.randint(0, 200, n)
blood_pressure = np.random.randint(0, 122, n)
skin_thickness = np.random.randint(0, 99, n)
insulin = np.random.randint(0, 846, n)
bmi = np.round(np.random.uniform(0, 67.1, n), 1)
dpf = np.round(np.random.uniform(0.078, 2.42, n), 3)
age = np.random.randint(21, 81, n)

# Risk-based target
risk = (
    (glucose > 140).astype(int) * 2 +
    (bmi > 30).astype(int) +
    (age > 40).astype(int) +
    (pregnancies > 3).astype(int) +
    (dpf > 0.5).astype(int)
)
target = (risk >= 3).astype(int)

df = pd.DataFrame({
    "Pregnancies": pregnancies,
    "Glucose": glucose,
    "BloodPressure": blood_pressure,
    "SkinThickness": skin_thickness,
    "Insulin": insulin,
    "BMI": bmi,
    "DiabetesPedigreeFunction": dpf,
    "Age": age,
    "Outcome": target
})

# ── Train / Test split ──────────────────────────────────────────────────────
X = df.drop("Outcome", axis=1)
y = df["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── Preprocessing ───────────────────────────────────────────────────────────
scaler = StandardScaler()
X_train_sc = scaler.fit_transform(X_train)
X_test_sc = scaler.transform(X_test)

# ── Model Training (SVM with RBF kernel) ────────────────────────────────────
model = SVC(kernel="rbf", C=1.0, gamma="scale", probability=True, random_state=42)
model.fit(X_train_sc, y_train)

# ── Evaluation ──────────────────────────────────────────────────────────────
y_pred = model.predict(X_test_sc)
acc = accuracy_score(y_test, y_pred)
print(f"Diabetes Model Accuracy: {acc:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["No Diabetes", "Diabetes"]))

# ── Save ─────────────────────────────────────────────────────────────────────
joblib.dump(model, "models/diabetes_model.pkl")
joblib.dump(scaler, "models/diabetes_scaler.pkl")
print("✅ Diabetes model saved to models/diabetes_model.pkl")
