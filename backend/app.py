import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from routes.auth import auth_bp
from routes.predict import predict_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "bloodvision-secret-change-in-prod")
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
    app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "uploads")
    app.config["AVATAR_FOLDER"] = os.path.join(os.path.dirname(__file__), "avatars")

    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    os.makedirs(app.config["AVATAR_FOLDER"], exist_ok=True)

    CORS(app, origins=os.getenv("FRONTEND_URL", "*"))
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(predict_bp, url_prefix="/api")

    @app.route("/health")
    def health():
        from models.predictor import _model
        return {
            "status": "ok",
            "message": "BloodVision AI backend running",
            "model_loaded": _model is not None
        }

    # ✅ Preload model on startup so first prediction is fast!
    with app.app_context():
        print("[BloodVision] Preloading model on startup...")
        from models.predictor import load_model
        load_model()

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
