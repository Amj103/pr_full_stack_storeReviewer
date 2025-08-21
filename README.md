pr_store_rating

A full‑stack web app for browsing stores and submitting 1–5 star ratings, with role‑based access for System Administrator, Normal User, and Store Owner.

### Features
- JWT authentication with roles: ADMIN, USER, OWNER
- Users can search stores and submit/update ratings (one per store)
- Average ratings shown per store
- Admin dashboard and endpoints to manage users and stores
- Owner dashboard with store average and rater list


### Repository Layout
- `frontend/` — React app (Vite). Default dev port: `5173`.
- `backend/` — Express API. Default port: `4000`.
  - `backend/database/schema.sql` — tables
  - `backend/database/seed.sql` — optional sample data (uses placeholder password hashes)

---

## Prerequisites
- Node.js 18+ and npm
- MySQL 8+ server
- A MySQL user with privileges to create/use a database

## 1) Clone and install
```bash
# in PowerShell or your terminal
cd C:\VsCode\pr

# Install backend deps
cd backend
npm install

# Install frontend deps
cd ../frontend
npm install
```

## 2) Create the MySQL database
You can use MySQL Workbench or the CLI. Example with CLI:

```sql
-- Connect to MySQL and run:
CREATE DATABASE store_rating CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Apply the schema:
```bash
# from the project root
mysql -u <USER> -p store_rating < backend/database/schema.sql
```

(Optional) Seed sample data:
```bash
mysql -u <USER> -p store_rating < backend/database/seed.sql
```
Note: `seed.sql` uses a placeholder password hash. See "Set/Reset the admin password" below.

## 3) Configure environment variables (backend)
Create `backend/.env` with your settings:
```env
# Backend HTTP port (default 4000)
PORT=4000

# MySQL connection
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password(qazwsx123)
DB_NAME=store_rating

# Any strong random string
JWT_SECRET=change_this_to_a_long_random_string
```

## 4) Configure environment variables (frontend)
Frontend will call the API at `VITE_API_URL`. Defaults to `http://localhost:4000` if not set.

Create `frontend/.env` (optional if using default):
```env
VITE_API_URL=http://localhost:4000
```

## 5) Run locally (two terminals)
Terminal A — start the API:
```bash
cd backend
npm run dev
# API listening on :4000
```

Terminal B — start the frontend:
```bash
cd frontend
npm run dev
# Vite dev server on http://localhost:5173
```
Open `http://localhost:5173` in your browser.

---

## Set/Reset the admin password
create an admin via the API or direct SQL insert after hashing a password.

---

## Common API endpoints (summary)
- `POST /auth/signup` — User signup (creates USER)
- `POST /auth/login` — Login, returns `{ token, user }`
- `GET /stores?search=&sortBy=name|email|address|rating&order=asc|desc` — List stores with average ratings; includes `myRating` if logged in
- `POST /ratings` — USER only; body `{ storeId, score }`
- `GET /admin/dashboard` — ADMIN only; summary counts
- `POST /admin/users` — ADMIN create user (any role)
- `GET /admin/users` — ADMIN list users (search/sort)
- `GET /admin/users/:id` — ADMIN get user details (includes owner rating average if OWNER)
- `GET /admin/stores` — ADMIN list stores (search/sort)
- `POST /admin/stores` — ADMIN create store
- `GET /owner/dashboard` — OWNER only; store average and raters

Auth header: `Authorization: Bearer <JWT>`

---

## Production notes (optional)
- Frontend: build with `cd frontend && npm run build` (outputs `dist/`)
- Backend: run with `cd backend && npm run start` after setting `.env`
- Serve the built frontend with any static host or integrate a reverse proxy (e.g., Nginx) to route `/` to the frontend and `/api` (or `/`) to the backend.

## Troubleshooting
- Cannot connect to DB: verify `DB_HOST/PORT/USER/PASS/NAME` and that MySQL is running.
- Login fails after seeding: update the admin `password_hash` using the steps above.
- CORS issues: backend enables CORS; ensure `VITE_API_URL` points to the backend URL.
- Port conflicts: change `PORT` in `backend/.env` or `server.port` in `frontend/vite.config.js`. 