# MriJa Backend (Firebase Exit Plan)

This backend replaces Firebase collections/auth for the core MriJa workflows:

- Volunteer registration/login/verification
- Volunteer tasks (create/apply/delete/my tasks)
- Admin CRUD for events, past events, courses, report
- Admin views for registrations and memberships

It uses:

- `Express` API
- `SQLite` (via `better-sqlite3`)
- `JWT` auth

## 1. Setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:init
npm run db:seed-admin
npm run dev
```

Health check:

```bash
curl http://localhost:8080/api/health
```

## 2. Migrate existing Firebase data

1. Put Firebase service account json in the project root or set `FIREBASE_ADMIN_CREDENTIALS_PATH`.
2. Run:

```bash
cd backend
npm run migrate:firebase
```

This migrates collections:

- `events`
- `past_events`
- `courses`
- `reports`
- `registrations`
- `memberships`
- `volunteers`
- `volunteerTasks` (+ `appliedUsers`)

## 3. Important note about migrated passwords

Firebase Auth passwords cannot be exported directly into this local backend.

Migrated users are marked as `firebase-migrated:*` and must set a new password before login to this backend.

For immediate admin access, use:

```bash
npm run db:seed-admin
```

## 4. Main API routes

- `POST /api/auth/register-volunteer`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `PATCH /api/auth/me/skills`

- `GET /api/volunteer/tasks`
- `GET /api/volunteer/tasks/my`
- `POST /api/volunteer/tasks/:taskId/apply`
- `POST /api/volunteer/tasks` (manager/admin)
- `DELETE /api/volunteer/tasks/:taskId` (manager/admin)

- `GET /api/public/events`
- `GET /api/public/past-events`
- `GET /api/public/courses`
- `GET /api/public/report`
- `POST /api/public/registrations`

- `GET /api/admin/volunteers`
- `PATCH /api/admin/volunteers/:id/review`
- `PATCH /api/admin/volunteers/:id/role` (admin only)
- `GET/POST/PUT/DELETE /api/admin/events`
- `GET/POST/PUT/DELETE /api/admin/past-events`
- `GET/POST/PUT/DELETE /api/admin/courses`
- `GET/PUT /api/admin/report`
- `GET /api/admin/registrations`
- `GET /api/admin/memberships`

## 5. Free server deployment options

### Option A (recommended for persistent SQLite): Oracle Cloud Always Free VM

1. Create Ubuntu VM (Always Free).
2. Install Node 20+, clone repo.
3. Run backend with `pm2`.
4. Put Nginx in front + HTTPS (Let's Encrypt).
5. Store DB in `backend/data/mrija.db`.

### Option B: Any free app host + external DB

If you deploy on hosts with ephemeral disk, switch to Postgres before production.
This backend is a fast migration base and can be upgraded to Postgres in the next step.
