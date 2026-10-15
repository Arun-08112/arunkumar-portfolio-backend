# Arunkumar Portfolio — Phase 2 Express API

Works with the existing `portfolio_db` and eight PostgreSQL tables. **No database tables are changed.**

## Requirements
- Node.js 20+
- PostgreSQL running on port 5432
- Existing `portfolio_db` from Phase 2

## Setup (PowerShell)

```powershell
cd "D:\Job portal\projects\Arun\Arun\arunkumar-portfolio-backend"
Copy-Item .env.example .env
notepad .env
npm install
npm run dev
```

Change the example folder path to the folder where you extracted this ZIP. In `.env`, use your actual local PostgreSQL password. Never commit `.env` to Git or share it.

## Test

- http://localhost:5000/api/health
- http://localhost:5000/api/profile
- http://localhost:5000/api/projects
- http://localhost:5000/api/skills
- http://localhost:5000/api/experiences
- http://localhost:5000/api/education
- http://localhost:5000/api/social-links

The read-only endpoints return JSON `{ "success": true, "data": ... }`. Profile is an object; other `data` values are arrays. Unseeded tables return `[]`.

## Troubleshooting

- `28P01`: Check DB_USER/DB_PASSWORD.
- `3D000`: Verify DB_NAME is `portfolio_db`.
- `ECONNREFUSED`: Start the PostgreSQL Windows service and verify port 5432.
- `42P01`: Run the schema inside `portfolio_db` and check `public` schema.
- `EADDRINUSE`: Port 5000 is already used; set a free PORT in `.env`.

Next phase: authenticated admin CRUD / validated and rate-limited contact API, then Axios integration. Keep secret values only in backend `.env`, never in React Vite env.
