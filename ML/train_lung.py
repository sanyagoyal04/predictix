"""
Lung Cancer Prediction - InceptionResNetV2 Transfer Learning
Algorithm: InceptionResNetV2 (pre-trained on ImageNet, fine-tuned)
Input: Chest X-ray / CT scan image
"""

import numpy as np
import os
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import InceptionResNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator

os.makedirs("models", exist_ok=True)

IMG_SIZE = (299, 299)
BATCH_SIZE = 16
EPOCHS = 20

def build_inception_resnet():
    base_model = InceptionResNetV2(
        weights="imagenet", include_top=False,
        input_shape=(*IMG_SIZE, 3)
    )
    # Freeze base first
    base_model.trainable = False

    x = base_model.output
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dense(512, activation="relu")(x)
    x = layers.Dropout(0.4)(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.3)(x)
    output = layers.Dense(1, activation="sigmoid")(x)

    model = models.Model(inputs=base_model.input, outputs=output)
    model.compile(
        optimizer=tf.keras.optimizers.Adam(1e-4),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )
    return model, base_model

DATASET_PATH = "datasets/lung_cancer"

if os.path.exists(DATASET_PATH):
    datagen = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2,
                                  rotation_range=15, horizontal_flip=True,
                                  brightness_range=[0.8, 1.2])
    train_gen = datagen.flow_from_directory(
        DATASET_PATH, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode="binary", subset="training"
    )
    val_gen = datagen.flow_from_directory(
        DATASET_PATH, target_size=IMG_SIZE, batch_size=BATCH_SIZE,
        class_mode="binary", subset="validation"
    )
    model, base_model = build_inception_resnet()

    # Phase 1: Train top layers only
    model.fit(train_gen, validation_data=val_gen, epochs=10,
              callbacks=[tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)])

    # Phase 2: Fine-tune last 30 layers
    base_model.trainable = True
    for layer in base_model.layers[:-30]:
        layer.trainable = False
    model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),
                  loss="binary_crossentropy", metrics=["accuracy"])
    model.fit(train_gen, validation_data=val_gen, epochs=EPOCHS,
              callbacks=[tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True)])
else:
    print("⚠️  Real dataset not found. Using synthetic data for demo InceptionResNetV2 model...")
    np.random.seed(42)
    n = 200
    X = np.random.rand(n, *IMG_SIZE, 3).astype("float32")
    y = np.random.randint(0, 2, n)

    model, _ = build_inception_resnet()
    model.fit(X, y, validation_split=0.2, epochs=3, batch_size=BATCH_SIZE, verbose=1)

model.save("models/lung_inception_model.keras")
print("✅ Lung cancer InceptionResNetV2 model saved to models/lung_inception_model.keras")
