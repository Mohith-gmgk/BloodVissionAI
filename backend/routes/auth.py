import os, uuid, base64, re
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.user_store import get_user_by_email, get_user_by_id, create_user, update_user

auth_bp = Blueprint("auth", __name__)

# ── Validators ────────────────────────────────────────────────────────────────
def validate_password(pw):
    return (
        len(pw) >= 8 and
        re.search(r"[A-Z]", pw) and
        re.search(r"[a-z]", pw) and
        re.search(r"\d", pw) and
        re.search(r"[@$!%*?&#^()_\-+=]", pw)
    )

def save_base64_avatar(b64_string, folder):
    """Save a base64-encoded image and return the file path."""
    try:
        if b64_string.startswith("data:"):
            header, data = b64_string.split(",", 1)
        else:
            data = b64_string
        img_bytes = base64.b64decode(data)
        filename = f"{uuid.uuid4().hex}.jpg"
        filepath = os.path.join(folder, filename)
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        return filename
    except Exception:
        return None

# ── Register ──────────────────────────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.form or request.json or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    phone = (data.get("phone") or "").strip()
    avatar_b64 = data.get("avatar") or ""

    # Validation
    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not re.match(r"\S+@\S+\.\S+", email):
        return jsonify({"error": "Valid email required"}), 400
    if not validate_password(password):
        return jsonify({"error": "Password must be 8+ chars with uppercase, lowercase, digit, and special character"}), 400
    if get_user_by_email(email):
        return jsonify({"error": "Email already registered"}), 409

    # Save avatar
    avatar_filename = None
    if avatar_b64:
        avatar_filename = save_base64_avatar(avatar_b64, current_app.config["AVATAR_FOLDER"])

    user = create_user({
        "id": str(uuid.uuid4()),
        "name": name,
        "email": email,
        "phone": phone,
        "password_hash": generate_password_hash(password),
        "avatar": avatar_filename,
        "history": [],
    })

    token = create_access_token(identity=user["id"])
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return jsonify({"user": safe_user, "token": token}), 201

# ── Login ─────────────────────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = get_user_by_email(email)
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=user["id"])
    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return jsonify({"user": safe_user, "token": token}), 200

# ── Update Profile ────────────────────────────────────────────────────────────
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.form or request.json or {}
    updates = {}

    if data.get("name"): updates["name"] = data["name"].strip()
    if data.get("email"):
        email = data["email"].strip().lower()
        if not re.match(r"\S+@\S+\.\S+", email):
            return jsonify({"error": "Valid email required"}), 400
        updates["email"] = email
    if data.get("phone"): updates["phone"] = data["phone"].strip()
    if data.get("avatar"):
        fname = save_base64_avatar(data["avatar"], current_app.config["AVATAR_FOLDER"])
        if fname: updates["avatar"] = fname

    user = update_user(user_id, updates)
    if not user:
        return jsonify({"error": "User not found"}), 404

    safe_user = {k: v for k, v in user.items() if k != "password_hash"}
    return jsonify({"user": safe_user}), 200

# ── Change Password ───────────────────────────────────────────────────────────
@auth_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.json or {}
    current_pw = data.get("current_password") or ""
    new_pw = data.get("new_password") or ""

    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not check_password_hash(user["password_hash"], current_pw):
        return jsonify({"error": "Current password is incorrect"}), 401
    if not validate_password(new_pw):
        return jsonify({"error": "New password must be 8+ chars with uppercase, lowercase, digit, and special character"}), 400

    update_user(user_id, {"password_hash": generate_password_hash(new_pw)})
    return jsonify({"message": "Password updated successfully"}), 200
