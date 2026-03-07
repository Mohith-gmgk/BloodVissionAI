import os, uuid, re, base64
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from supabase_client import supabase

auth_bp = Blueprint("auth", __name__)

def validate_password(pw):
    return (
        len(pw) >= 8 and
        re.search(r"[A-Z]", pw) and
        re.search(r"[a-z]", pw) and
        re.search(r"\d", pw) and
        re.search(r"[@$!%*?&#^()_\-+=]", pw)
    )

def safe_user(user):
    return {k: v for k, v in user.items() if k != "password_hash"}

def upload_avatar(b64_string, user_id):
    """Upload base64 avatar to Supabase Storage and return public URL."""
    try:
        if "," in b64_string:
            b64_string = b64_string.split(",")[1]
        img_bytes = base64.b64decode(b64_string)
        filename = f"{user_id}.jpg"
        supabase.storage.from_("avatars").upload(
            filename, img_bytes,
            {"content-type": "image/jpeg", "upsert": "true"}
        )
        url = supabase.storage.from_("avatars").get_public_url(filename)
        return url
    except Exception as e:
        print(f"Avatar upload error: {e}")
        return None

# ── Register ──────────────────────────────────────────────────────────────────
@auth_bp.route("/register", methods=["POST"])
def register():
    data     = request.form or request.json or {}
    name     = (data.get("name") or "").strip()
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    phone    = (data.get("phone") or "").strip()
    avatar   = data.get("avatar") or ""

    if not name:
        return jsonify({"error": "Name is required"}), 400
    if not re.match(r"\S+@\S+\.\S+", email):
        return jsonify({"error": "Valid email required"}), 400
    if not validate_password(password):
        return jsonify({"error": "Password must be 8+ chars with uppercase, lowercase, digit, and special character"}), 400

    # Check if email exists
    existing = supabase.table("users").select("id").eq("email", email).execute()
    if existing.data:
        return jsonify({"error": "Email already registered"}), 409

    user_id = str(uuid.uuid4())

    # Upload avatar if provided
    avatar_url = None
    if avatar:
        avatar_url = upload_avatar(avatar, user_id)

    # Save user to Supabase
    user_data = {
        "id": user_id,
        "name": name,
        "email": email,
        "phone": phone,
        "password_hash": generate_password_hash(password),
        "avatar_url": avatar_url,
        "is_admin": False,
    }
    result = supabase.table("users").insert(user_data).execute()
    user = result.data[0]

    token = create_access_token(identity=user["id"])
    return jsonify({"user": safe_user(user), "token": token}), 201

# ── Login ─────────────────────────────────────────────────────────────────────
@auth_bp.route("/login", methods=["POST"])
def login():
    data     = request.json or {}
    email    = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    result = supabase.table("users").select("*").eq("email", email).execute()
    if not result.data:
        return jsonify({"error": "Invalid email or password"}), 401

    user = result.data[0]
    if not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=user["id"])
    return jsonify({"user": safe_user(user), "token": token}), 200

# ── Update Profile ────────────────────────────────────────────────────────────
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data    = request.form or request.json or {}
    updates = {}

    if data.get("name"):  updates["name"]  = data["name"].strip()
    if data.get("phone"): updates["phone"] = data["phone"].strip()
    if data.get("email"):
        email = data["email"].strip().lower()
        if not re.match(r"\S+@\S+\.\S+", email):
            return jsonify({"error": "Valid email required"}), 400
        updates["email"] = email
    if data.get("avatar"):
        avatar_url = upload_avatar(data["avatar"], user_id)
        if avatar_url: updates["avatar_url"] = avatar_url

    result = supabase.table("users").update(updates).eq("id", user_id).execute()
    if not result.data:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"user": safe_user(result.data[0])}), 200

# ── Change Password ───────────────────────────────────────────────────────────
@auth_bp.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id    = get_jwt_identity()
    data       = request.json or {}
    current_pw = data.get("current_password") or ""
    new_pw     = data.get("new_password") or ""

    result = supabase.table("users").select("*").eq("id", user_id).execute()
    if not result.data:
        return jsonify({"error": "User not found"}), 404

    user = result.data[0]
    if not check_password_hash(user["password_hash"], current_pw):
        return jsonify({"error": "Current password is incorrect"}), 401
    if not validate_password(new_pw):
        return jsonify({"error": "New password must meet all requirements"}), 400

    supabase.table("users").update({"password_hash": generate_password_hash(new_pw)}).eq("id", user_id).execute()
    return jsonify({"message": "Password updated successfully"}), 200

# ── Get all users (Admin only) ────────────────────────────────────────────────
@auth_bp.route("/admin/users", methods=["GET"])
@jwt_required()
def get_all_users():
    user_id = get_jwt_identity()
    admin   = supabase.table("users").select("is_admin").eq("id", user_id).execute()
    if not admin.data or not admin.data[0].get("is_admin"):
        return jsonify({"error": "Admin access required"}), 403

    users = supabase.table("users").select("id,name,email,avatar_url,created_at,is_admin").execute()
    return jsonify({"users": users.data}), 200
