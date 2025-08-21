# Store Rating Backend (Express + MySQL)

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. Create the database and run `database/schema.sql` then `database/seed.sql`.
3. `npm install`
4. `npm run dev` to start in dev mode (default port 4000).

## Highlights
- JWT auth (single login for all roles)
- RBAC (System Administrator, Normal User, Store Owner)
- Validations aligned with PDF
- Sorting & filtering for admin lists
- Ratings 1–5, unique per (user, store), with update support
