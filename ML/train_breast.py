"""
Breast Cancer Prediction - CNN Model Training
Algorithm: Convolutional Neural Network (CNN)
Input: Histopathology image (binary: benign / malignant)
"""

import numpy as np
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report
import joblib

os.makedirs("models", exist_ok=True)

IMG_SIZE = (64, 64)
BATCH_SIZE = 32
EPOCHS = 15

# ── Build CNN ────────────────────────────────────────────────────────────────
def build_cnn():
    model = models.Sequential([
        layers.Input(shape=(*IMG_SIZE, 3)),
        layers.Conv2D(32, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.MaxPooling2D(),
        layers.Conv2D(64, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.MaxPooling2D(),
        layers.Conv2D(128, (3, 3), activation="relu", padding="same"),
        layers.BatchNormalization(),
        layers.MaxPooling2D(),
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(1, activation="sigmoid"),
    ])
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )
    return model

# ── Train with synthetic data if real dataset not found ─────────────────────
DATASET_PATH = "datasets/breast_cancer"

if os.path.exists(DATASET_PATH):
    datagen = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2,
                                  rotation_range=20, horizontal_flip=True,
                                  zoom_range=0.15)
    train_gen = datagen.flow_from_directory(
        DATASET_PATH, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode="binary", subset="training"
    )
    val_gen = datagen.flow_from_directory(
        DATASET_PATH, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode="binary", subset="validation"
    )
    model = build_cnn()
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS,
              callbacks=[tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)])
else:
    # ── Synthetic training for demo ─────────────────────────────────────────
    print("⚠️  Real dataset not found. Training on synthetic data for demo...")
    np.random.seed(42)
    n = 1000
    X = np.random.rand(n, *IMG_SIZE, 3).astype("float32")
    # Simple synthetic pattern: malignant images have higher mean pixel in center
    for i in range(n // 2, n):
        X[i, 20:44, 20:44, :] += 0.3
    X = np.clip(X, 0, 1)
    y = np.array([0] * (n // 2) + [1] * (n // 2))

    model = build_cnn()
    model.fit(X, y, validation_split=0.2, epochs=EPOCHS, batch_size=BATCH_SIZE,
              callbacks=[tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)],
              verbose=1)

model.save("models/breast_cnn_model.keras")
print("✅ Breast cancer CNN model saved to models/breast_cnn_model.keras")
