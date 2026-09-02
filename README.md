# Store Rating Platform

A full-stack web application for rating registered stores. The platform supports three roles:

- System Administrator
- Normal User
- Store Owner

The app allows users to browse stores, submit or update a rating from 1 to 5, and lets store owners view average ratings and who rated their stores.

## Tech Stack

- Backend: Node.js, Express.js, Sequelize, PostgreSQL
- Frontend: React, Vite, React Router
- Authentication: JWT with role-based access control
- Password hashing: bcryptjs

## Features

- Admin dashboard with counts for users, stores, and ratings
- Create and manage users with roles: ADMIN, NORMAL, and STORE_OWNER
- Create and manage stores and assign an owner
- Normal users can browse stores and submit or update a rating
- Store owners can view who rated their store and the average rating
- Password update support for authenticated users
- Server-side validation and authorization

## Project Structure

```bash
store-rating-platform/
├── client/                # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                # Express API
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or newer
- npm
- PostgreSQL installed and running locally

## Backend Setup

1. Open a terminal and go to the server folder:

```bash
cd server
```

2. Copy the example environment file and update the values:

```bash
copy .env.example .env
```

3. Edit the `.env` file with your PostgreSQL and JWT settings. The default example is:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_ratings
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=1d

CLIENT_ORIGIN=http://localhost:5173

ADMIN_NAME=Default Platform Administrator
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@1234
ADMIN_ADDRESS=Head Office
```

4. Create the PostgreSQL database:

```bash
createdb store_ratings
```

If you prefer SQL:

```sql
CREATE DATABASE store_ratings;
```

5. Install dependencies:

```bash
npm install
```

6. Seed the initial admin account:

```bash
npm run seed
```

This creates a default admin user using the values in `.env` or the fallback values above.

7. Start the backend:

```bash
npm run dev
```

The API will run at:

- http://localhost:5000

## Frontend Setup

Open a second terminal and run:

```bash
cd client
npm install
npm run dev
```

The frontend will run at:

- http://localhost:5173

The Vite config proxies `/api` requests to the backend automatically.

## Default Login

After seeding the database, you can sign in with the default admin account:

- Email: admin@example.com
- Password: Admin@1234

## App Flow

1. Log in as the seeded admin.
2. Create a STORE_OWNER user from the admin panel.
3. Create a store and assign it to that owner.
4. Sign up or create a NORMAL user.
5. Log in as a normal user to browse stores and submit ratings.
6. Log in as a store owner to view the store rating summary.

## Role Permissions

| Role | Permissions |
|---|---|
| Admin | Manage users and stores, view dashboard summaries, view user details |
| Normal User | Sign up, log in, update password, browse stores, submit/update ratings |
| Store Owner | Log in, update password, view average rating and rated users for assigned stores |

## Validation Rules

The app enforces validation on both the client and server:

- Name: 20 to 60 characters
- Address: up to 400 characters
- Password: 8 to 16 characters with at least one uppercase letter and one special character
- Email: valid email format

## API Summary

### Authentication

- `POST /api/auth/signup` — register a normal user
- `POST /api/auth/login` — login and receive JWT
- `PUT /api/auth/password` — update password for authenticated user
- `GET /api/auth/me` — get current authenticated user

### Admin

- `GET /api/admin/dashboard` — admin overview
- `POST /api/admin/users` — create users
- `GET /api/admin/users` — list/filter/sort users
- `GET /api/admin/users/:id` — get a single user profile
- `POST /api/admin/stores` — create a store
- `GET /api/admin/stores` — list/filter/sort stores

### User / Store Access

- `GET /api/stores` — list stores for normal users with overall and own rating
- `PUT /api/ratings/:storeId` — submit or update a rating

### Store Owner

- `GET /api/store-owner/dashboard` — view store-specific rating summary

## Database Notes

The backend uses Sequelize models for:

- `users`
- `stores`
- `ratings`

A user is assigned a role from:

- `ADMIN`
- `NORMAL`
- `STORE_OWNER`

Ratings are unique per user-store combination, so a user can only submit one rating for each store and can update it later.

## Notes

- The backend automatically syncs the database schema on startup using Sequelize.
- The seeded admin is intended for initial access before creating additional users.
- Frontend and backend run separately in development, with Vite proxying API requests to the backend server.

## Useful Commands

```bash
# Server
cd server
npm install
npm run seed
npm run dev

# Client
cd client
npm install
npm run dev
```

