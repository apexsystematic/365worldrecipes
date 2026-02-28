# 🌍 365 World Recipes — Vercel Deployment

A beautiful web app with 365 easy recipes from around the world, powered by Google Gemini AI.

## 🚀 Deploy in 5 Minutes

### Step 1 — Get a Free Gemini API Key
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API key"**
4. Copy the key (starts with `AIza...`)

### Step 2 — Upload to GitHub
1. Go to [github.com](https://github.com) and create a free account if needed
2. Click **"New repository"** → name it `world-recipes` → click **Create**
3. Upload all files from this folder by dragging them into the GitHub interface
   - Make sure to keep the folder structure: `api/generate.js`, `public/index.html`, `vercel.json`

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → select your `world-recipes` repo
3. Click **Deploy** (no build settings needed)

### Step 4 — Add Your API Key (Securely)
1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** your key from Step 1
3. Click **Save**
4. Go to **Deployments** → click the three dots on the latest → **Redeploy**

### ✅ Done!
Your app is now live at `your-project.vercel.app` with a secret API key nobody can steal.

---

## 📁 File Structure
```
world-recipes/
├── api/
│   └── generate.js      ← Secure serverless proxy (hides your API key)
├── public/
│   └── index.html       ← The full recipe app
├── vercel.json          ← Routing config
└── README.md
```

## 🔑 How the Security Works
- Your Gemini API key is stored as a **Vercel Environment Variable** — never in your code
- The browser calls `/api/generate` (your own server)
- Your server adds the secret key and calls Gemini
- Nobody viewing your page source can ever see the key

## 💡 Gemini Free Tier Limits
- 15 requests per minute
- 1,500 requests per day
- More than enough to generate all 365 recipes!
