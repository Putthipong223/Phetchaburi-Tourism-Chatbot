# 🌿 น้องเพชร — Phetchaburi Tourism Chatbot

AI-powered tourism chatbot for Phetchaburi Province, Thailand.
Built with React + Node.js + Google Gemini 2.5 Flash

**Live Demo:** [your-app.vercel.app](https://your-app.vercel.app)

---

## ✨ Features
- 💬 24/7 AI chat in Thai, English, Chinese
- 🗺️ Smart itinerary planner (1–5 days)
- 🔖 Quick Menu with 8 instant topics
- 🌙 Auto Dark Mode at sunset
- ⚠️ Quota exceeded notifications

---

## 🚀 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/phetchaburi-chatbot.git
cd phetchaburi-chatbot
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
node server.js
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
# .env already points to localhost:5000 for local dev
npm run dev
```

Open http://localhost:3000

---

## 🌐 Deploy to Production

### Backend → Render (Free)

1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variable:
   - Key: `GEMINI_API_KEY`
   - Value: your API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
6. Click **Deploy** → Copy your URL (e.g. `https://phetchaburi-chatbot.onrender.com`)

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"New Project"** → Import your repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
4. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: your Render backend URL (e.g. `https://phetchaburi-chatbot.onrender.com`)
5. Click **Deploy** → Your chatbot is live! 🎉

---

## 🔑 Environment Variables

| File | Variable | Description |
|------|----------|-------------|
| `backend/.env` | `GEMINI_API_KEY` | Google Gemini API key |
| `backend/.env` | `PORT` | Server port (default: 5000) |
| `frontend/.env` | `VITE_API_URL` | Backend URL |

---

## 📋 Tech Stack
- **Frontend:** React 18 + Vite + CSS
- **Backend:** Node.js + Express
- **AI:** Google Gemini 2.5 Flash
- **Deploy:** Vercel (frontend) + Render (backend)

---

## ⚠️ Important Notes
- Never commit `.env` files — they contain your API key
- Free tier Gemini has daily quota limits
- Render free tier spins down after 15 min inactivity (first request may be slow)
