# 🩸 BloodVision AI — Full Stack Deployment Guide

## Project Structure

```
bloodvision/
├── frontend/           ← React app (deploy on Render Static Site or Netlify)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI.jsx          ← Reusable UI: Card, Btn, Input, etc.
│   │   │   ├── Navbar.jsx
│   │   │   ├── Animations.jsx  ← Particles + DNA Helix canvas
│   │   │   ├── Charts.jsx      ← Bar, Line, Donut charts
│   │   │   └── Chatbot.jsx     ← AI chatbot
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── PredictPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js      ← Auth context provider
│   │   ├── utils/
│   │   │   ├── api.js          ← Axios API calls
│   │   │   ├── auth.js         ← Validators, localStorage helpers
│   │   │   └── theme.js        ← Colors + constants
│   │   └── App.js              ← Router + layout
│   └── package.json
│
└── backend/            ← Flask API (deploy on Render Web Service)
    ├── app.py              ← Flask app factory
    ├── gunicorn.conf.py    ← Production server config
    ├── requirements.txt
    ├── .env.example
    ├── routes/
    │   ├── auth.py         ← /api/auth/* endpoints
    │   └── predict.py      ← /api/predict + /api/history
    └── models/
        ├── predictor.py    ← AI model loader + inference
        ├── user_store.py   ← JSON-based user storage
        └── blood_group_model.h5   ← ⬅ PUT YOUR MODEL HERE
```

---

## 🚀 Deploy on Render

### Step 1 — Deploy Backend (Flask)

1. Push the `backend/` folder to a GitHub repo
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:create_app() -c gunicorn.conf.py`
   - **Environment:** Python 3
5. Add environment variables:
   - `JWT_SECRET_KEY` = any long random string
   - `FRONTEND_URL` = your frontend URL (or `*` for testing)
6. Click **Deploy**
7. Note your backend URL: `https://bloodvision-backend.onrender.com`

> ⚠️ **Add your AI model:** Upload `blood_group_model.h5` to the `backend/models/` folder.
> Without it, the app runs in **demo mode** (random predictions for testing).

---

### Step 2 — Deploy Frontend (React)

1. Push the `frontend/` folder to a GitHub repo
2. Go to Render → **New Static Site**
3. Connect the repo
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
5. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL from Step 1
6. Click **Deploy**

---

## 🤖 Connecting Your AI Model

Place your trained TensorFlow/Keras model at:
```
backend/models/blood_group_model.h5
```

The model must:
- Accept input shape: `(batch, 224, 224, 3)` — normalized to [0, 1]
- Output shape: `(batch, 8)` — softmax probabilities
- Classes (in order): `["A+", "A-", "AB+", "AB-", "B+", "B-", "O+", "O-"]`

Update `models/predictor.py` if your class order or input size differs.

---

## 🛠 Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env   # Edit with your values
python app.py
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # Set REACT_APP_API_URL=http://localhost:5000
npm start
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Login, returns JWT |
| PUT | `/api/auth/profile` | ✓ | Update profile |
| PUT | `/api/auth/password` | ✓ | Change password |
| POST | `/api/predict` | ✓ | Upload image → blood group |
| GET | `/api/history` | ✓ | Get prediction history |
| GET | `/health` | ✗ | Health check |

---

## 🔒 Security Notes

- JWT tokens expire after 1 hour by default (configure in `app.py`)
- Passwords are hashed with Werkzeug's `pbkdf2:sha256`
- For production, replace `user_store.py` with a real database (PostgreSQL + SQLAlchemy recommended)
- Set a strong `JWT_SECRET_KEY` in production
