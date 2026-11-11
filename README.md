# VoyageCRM – Travel Webapp & Sales CRM

A complete, full-stack travel booking platform and enterprise CRM featuring automated lead capture, interactive quotation builder, day-wise itineraries, customer portal, sales pipeline, and PostgreSQL database schema.

---

## 🚀 Deploying to Vercel

This project is pre-configured for **1-click zero-config Vercel deployment** with Vite and React 19.

### Option 1: Automatic GitHub Integration (Recommended)
1. Commit and push the latest repository files to your `main` branch:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment configuration and dependencies"
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com):
   - Import your GitHub repository (`travel-web-app-crm`).
   - Framework Preset: **Vite** (auto-detected).
   - Build Command: `npm run build` (auto-detected).
   - Output Directory: `dist` (auto-detected).
   - Install Command: `npm install --legacy-peer-deps` (pre-configured in `vercel.json`).
3. Click **Deploy**. The build will complete in ~30 seconds.

### Option 2: Deploying via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons.
- **Bundler & Server**: Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`.
- **Database Architecture**: PostgreSQL 14+ Relational Schema (DDL located in `/database/schema.sql`).
- **State & Storage**: Reactive persistent storage layer with instant CRM lead pipeline capture.

---

## 📦 Key Files & Configuration

- `vercel.json`: Vercel routing rules (`SPA rewrites`) and build configuration.
- `.npmrc`: Enables `legacy-peer-deps=true` for clean, conflict-free package resolution across all npm environments.
- `database/schema.sql`: Complete PostgreSQL production schema with tables, triggers, ENUMs, analytical views, and seed records.
