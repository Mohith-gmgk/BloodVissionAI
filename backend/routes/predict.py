import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.predictor import predict
from supabase_client import supabase

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
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid or unsupported file type"}), 400

    image_bytes = file.read()
    if not image_bytes:
        return jsonify({"error": "Empty file uploaded"}), 400

    try:
        result = predict(image_bytes)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

    # Save prediction to Supabase
    entry = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "blood_group": result["blood_group"],
        "confidence": result["confidence"],
        "val_accuracy": result["val_accuracy"],
        "model_accuracy": result["model_accuracy"],
        "image_name": file.filename,
    }
    supabase.table("predictions").insert(entry).execute()

    return jsonify(result), 200

# ── Get User History ──────────────────────────────────────────────────────────
@predict_bp.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    result  = supabase.table("predictions").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(100).execute()
    return jsonify({"history": result.data}), 200

# ── Admin - Get All Predictions ───────────────────────────────────────────────
@predict_bp.route("/admin/predictions", methods=["GET"])
@jwt_required()
def get_all_predictions():
    user_id = get_jwt_identity()
    admin   = supabase.table("users").select("is_admin").eq("id", user_id).execute()
    if not admin.data or not admin.data[0].get("is_admin"):
        return jsonify({"error": "Admin access required"}), 403

    result = supabase.table("predictions").select("*, users(name,email)").order("created_at", desc=True).limit(500).execute()
    return jsonify({"predictions": result.data}), 200

# ── Admin - Get Stats ─────────────────────────────────────────────────────────
@predict_bp.route("/admin/stats", methods=["GET"])
@jwt_required()
def get_admin_stats():
    user_id = get_jwt_identity()
    admin   = supabase.table("users").select("is_admin").eq("id", user_id).execute()
    if not admin.data or not admin.data[0].get("is_admin"):
        return jsonify({"error": "Admin access required"}), 403

    total_users       = supabase.table("users").select("id", count="exact").execute()
    total_predictions = supabase.table("predictions").select("id", count="exact").execute()
    all_preds         = supabase.table("predictions").select("blood_group,confidence").execute()

    group_counts = {"A": 0, "AB": 0, "B": 0, "O": 0}
    total_conf   = 0
    for p in all_preds.data:
        g = p.get("blood_group")
        if g in group_counts: group_counts[g] += 1
        total_conf += p.get("confidence", 0)

    avg_conf = round(total_conf / len(all_preds.data), 1) if all_preds.data else 0

    return jsonify({
        "total_users":       total_users.count,
        "total_predictions": total_predictions.count,
        "group_distribution": group_counts,
        "avg_confidence":    avg_conf,
        "model_accuracy":    99.2,
        "val_accuracy":      96.4,
    }), 200
