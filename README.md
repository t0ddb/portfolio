# Portfolio Site

Personal portfolio — Vite + React, deployed on Vercel.

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## Deploy to Vercel

### 1. Create a GitHub repo

Go to [github.com/new](https://github.com/new) and create a new repo (e.g., `portfolio`). Then push this project:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

### 2. Connect Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account
2. Click **"Add New Project"**
3. Select your `portfolio` repo
4. Vercel auto-detects Vite — just click **"Deploy"**
5. Your site is live at `your-project.vercel.app` in ~60 seconds

### 3. Custom domain (optional)

In your Vercel project dashboard:
1. Go to **Settings → Domains**
2. Add your domain (e.g., `toddbruschwein.com`)
3. Vercel gives you DNS records to add at your registrar
4. SSL is automatic

## Editing Content

All portfolio content lives in the `PORTFOLIO_DATA` object at the top of `src/Portfolio.jsx`. Update your projects, skills, contact info, and about text there.
