# 🚀 Deployment Guide for SkillRoute-AI

This guide covers how to deploy the **SkillRoute-AI** full-stack application.
- **Frontend**: Vite + React (Deployed on Vercel)
- **Backend**: Node.js + Express (Deployed on Render)
- **Database**: MongoDB Atlas

---

## 1. Prerequisites (Setup Services)

### 🅰️ MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/start/free) and create a free account.
2. Create a new Cluster (M0 Sandbox is free).
3. In **Database Access**, create a user (e.g., `admin`) and password.
4. In **Network Access**, allow access from anywhere (`0.0.0.0/0`).
5. Click **Connect** > **Drivers** to get your connection string.
   - It looks like: `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
   - *Save this for later.*

### 🔑 Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Get your `API_KEY`.

---

## 2. Deploy Backend (Render)

We will use **Render** because it offers free Node.js hosting.

1. **Sign Up**: Go to [render.com](https://render.com/) and log in with GitHub.
2. **New Web Service**: Click "New +" -> "Web Service".
3. **Connect Repo**: Select your `SkillRoute-AI` repository.
4. **Configure Settings**:
   - **Name**: `skillroute-backend` (or similar)
   - **Root Directory**: `server` (Important! Check this)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Environment Variables** (Scroll down to "Advanced"):
   Add the following keys:
   - `MONGO_URI`: (Paste your MongoDB connection string here)
   - `API_KEY`: (Paste your Gemini API Key)
   - `JWT_SECRET`: (Create a random secret, e.g., `mysecretkey123`)
   - `PORT`: `10000` (Render default)
   - `NODE_ENV`: `production`
6. **Deploy**: Click "Create Web Service".
   - Wait for it to build. Once live, copy the **Render URL** (e.g., `https://skillroute-backend.onrender.com`).

---

## 3. Deploy Frontend (Vercel)

1. **Sign Up**: Go to [vercel.com](https://vercel.com/) and log in with GitHub.
2. **Add New Project**: Click "Add New..." -> "Project".
3. **Connect Repo**: Import `SkillRoute-AI`.
4. **Configure Project**:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `./` (Default)
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
5. **Environment Variables**:
   Add this CRITICAL variable so the frontend knows where the backend is:
   - `VITE_API_URL`: (Paste your Render Backend URL **adding** `/api` at the end)
     - Example: `https://skillroute-backend.onrender.com/api`
6. **Deploy**: Click "Deploy".

---

## 4. Verification

1. Open your Vercel App URL.
2. Go to **Local Opportunities** or **Roadmap**.
3. If data loads (even mock data), the connection is working!
4. Check the **Chatbot** to see if it responds.

### Troubleshooting
- **Backend Error**: Check Render logs. If it says "MongoTimeoutError", check your MongoDB Network Access whitelist (`0.0.0.0/0`).
- **Frontend Error**: Open Browser Console (F12). If you see CORS errors or 404s on `/api/...`, check your `VITE_API_URL` setting in Vercel.

---
**Enjoy your deployed app! 🚀**
