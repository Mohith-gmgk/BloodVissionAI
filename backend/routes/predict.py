import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.predictor import predict
from models.user_store import get_user_by_id, update_user

predict_bp = Blueprint("predict", __name__)

ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "tiff", "tif", "bmp", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ── Predict ───────────────────────────────────────────────────────────────────
@predict_bp.route("/predict", methods=["POST"])
@jwt_required()
def predict_route():
    user_id = get_jwt_identity()

    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"}), 400

    image_bytes = file.read()
    if len(image_bytes) == 0:
        return jsonify({"error": "Empty file uploaded"}), 400

    try:
        result = predict(image_bytes)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

    # Save to history
    entry = {
        "id": str(uuid.uuid4()),
        "blood_group": result["blood_group"],
        "confidence": result["confidence"],
        "val_accuracy": result["val_accuracy"],
        "file_name": file.filename,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    user = get_user_by_id(user_id)
    if user:
        history = [entry] + (user.get("history") or [])
        update_user(user_id, {"history": history[:100]})  # keep last 100

    return jsonify(result), 200

# ── Get History ───────────────────────────────────────────────────────────────
@predict_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"history": user.get("history", [])}), 200
