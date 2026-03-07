"""
Simple in-memory user store.
For production, replace with a real database (PostgreSQL, MongoDB, etc.)
"""
import json, os

DB_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def _load():
    if os.path.exists(DB_FILE):
        with open(DB_FILE) as f:
            return json.load(f)
    return []

def _save(users):
    with open(DB_FILE, "w") as f:
        json.dump(users, f, indent=2)

def get_all_users():
    return _load()

def get_user_by_email(email):
    return next((u for u in _load() if u["email"] == email), None)

def get_user_by_id(user_id):
    return next((u for u in _load() if u["id"] == user_id), None)

def create_user(user_data):
    users = _load()
    users.append(user_data)
    _save(users)
    return user_data

def update_user(user_id, updates):
    users = _load()
    for i, u in enumerate(users):
        if u["id"] == user_id:
            users[i].update(updates)
            _save(users)
            return users[i]
    return None
