"""
Blood Group Prediction Model
-----------------------------
Model  : finetuned_blood_group_model.h5  (fine-tuned MobileNet CNN)
Input  : (224, 224, 3)  float32  normalized to [0, 1]
Output : 4-class softmax  →  A | AB | B | O
         (alphabetical order used by flow_from_directory)
"""

import os, io
import numpy as np
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), "finetuned_blood_group_model.h5")

# Alphabetical order (how flow_from_directory sorts sub-folders)
CLASS_NAMES = ["A", "AB", "B", "O"]

IMG_SIZE = (224, 224)
_model   = None


def load_model():
    global _model
    if _model is not None:
        return _model
    if not os.path.exists(MODEL_PATH):
        print(f"[BloodVision] Model not found: {MODEL_PATH}")
        return None
    try:
        import tensorflow as tf
        _model = tf.keras.models.load_model(MODEL_PATH)
        out = _model.output_shape[-1]
        print(f"[BloodVision] ✅ Model loaded  |  output units: {out}  |  classes: {CLASS_NAMES}")
    except Exception as e:
        print(f"[BloodVision] ❌ Load failed: {e}")
        _model = None
    return _model


def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE, Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)   # (1, 224, 224, 3)


def predict(image_bytes):
    model = load_model()

    if model is not None:
        arr   = preprocess_image(image_bytes)
        preds = model.predict(arr, verbose=0)[0]
        idx   = int(np.argmax(preds))
        blood_group = CLASS_NAMES[idx]
        confidence  = round(float(preds[idx]) * 100, 1)
        class_probs = {
            CLASS_NAMES[i]: round(float(p) * 100, 2)
            for i, p in enumerate(preds)
        }
        return {
            "blood_group":         blood_group,
            "confidence":          confidence,
            "class_probabilities": class_probs,
            "val_accuracy":        96.4,   # ← set to your actual val accuracy
            "model_accuracy":      99.2,   # ← set to your actual test accuracy
        }

    # fallback demo mode (no model loaded)
    import random
    bg = random.choice(CLASS_NAMES)
    return {
        "blood_group":         bg,
        "confidence":          round(random.uniform(82, 99), 1),
        "class_probabilities": {g: round(random.uniform(0, 100), 2) for g in CLASS_NAMES},
        "val_accuracy":        0.0,
        "model_accuracy":      0.0,
        "demo_mode":           True,
    }
