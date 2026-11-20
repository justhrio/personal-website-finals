# personal-website-finals

Personal portfolio website and guestbook application built with **Vue 3 + Vite** (frontend) and **NestJS + Supabase** (backend).

## Repository Structure

```text
personal-website-finals/
├── backend/                # NestJS REST API (/api/guestbook) backed by Supabase
│   ├── src/
│   │   ├── main.ts         # App entry point (CORS enabled, port 3000)
│   │   ├── app.module.ts
│   │   ├── app.controller.ts
│   │   └── app.service.ts
│   └── test/
└── frontend/               # Vue 3 + Vite single-page portfolio application
    ├── index.html
    └── src/
        ├── main.js
        └── App.vue
```

## Getting Started

### Backend (`backend/`)

```bash
cd backend
npm install
npm run start:dev
```

Optional environment variables:
- `PORT` (defaults to `3000`)
- `SUPABASE_URL`
- `SUPABASE_KEY`

### Frontend (`frontend/`)

```bash
cd frontend
npm install
npm run dev
```