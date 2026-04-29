# Admin Auth

Jayco admin access is backed by the existing MongoDB database used by the catalog/admin system. There are no default credentials and no `.env` admin bypass.

## Required Environment

Set the existing MongoDB variables locally in `.env.local` or the project environment:

```env
MONGODB_URI=
MONGODB_DB=
```

`MONGODB_DB` is optional and defaults to `jayco` through `src/lib/mongodb/env.ts`.

## Indexes

Create or refresh the admin/contact indexes:

```bash
pnpm admin:indexes
```

This creates indexes for `admin_users`, `admin_sessions`, `admin_login_attempts`, and `contact_submissions`. Session expiry uses a MongoDB TTL index on `admin_sessions.expiresAt`.

## Create First Admin

Create or update an admin user:

```bash
pnpm admin:create -- --email admin@jaycoconstruction.com --username admin --name "Jayco Admin" --password "StrongPassword"
```

You can omit `--password` to be prompted, but the prompt is not masked. Passing `--password` may store the password in shell history.

## Login

Admin login is available at:

```txt
/admin/login
```

## Session Model

Admin login creates a database-backed session and sets an httpOnly `jayco_admin_session` cookie scoped to `/admin`.

The browser cookie stores the raw random session token. MongoDB stores only a SHA-256 hash of that token, plus expiry and revocation timestamps. Sessions expire after seven days. Logout marks the current session as revoked and clears the cookie.
