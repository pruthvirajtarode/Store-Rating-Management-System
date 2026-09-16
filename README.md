# Store Rating Management System

A full-stack application built to manage store ratings, featuring Role-Based Access Control (RBAC), modern UI design, and robust APIs.

## Features

- **Multi-Role Support:** SYSTEM ADMINISTRATOR, NORMAL USER, and STORE OWNER.
- **Unified Login:** Automatic role-based redirection to respective dashboards.
- **Admin Dashboard:** Statistics, User Management (Search, Sort, Pagination), and Store Management.
- **Normal User Flow:** View stores, submit/modify exactly one rating per store.
- **Store Owner Flow:** View average ratings and individual rating details for assigned stores.
- **Security:** JWT authentication, bcrypt hashing, API validation, and Role-Based Authorization.
- **Responsive UI:** Built with Tailwind CSS and React for Desktop, Tablet, and Mobile.

## Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, Lucide React
- **Backend:** Node.js, Express.js, REST API architecture
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT, bcryptjs
- **Validation:** express-validator (backend), client-side validation

## Architecture

- **Backend:** `Routes -> Middleware (Auth & Validate) -> Controller -> Prisma -> PostgreSQL`
- **Frontend:** `React Context (Auth) -> React Router (Protected Routes) -> Axios (Interceptors) -> Pages & Components`

## Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL (Ensure it is running locally)

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd store-rating-system
   ```

2. **Install Root Dependencies:**
   ```bash
   npm run install:all
   ```

3. **Database Configuration:**
   - Create a PostgreSQL database (e.g., `store_rating_db`).
   - Copy `.env.example` to `.env` in the `backend/` directory:
     ```bash
     cd backend
     cp .env.example .env
     ```
   - Update `DATABASE_URL` in `backend/.env` with your PostgreSQL credentials:
     `DATABASE_URL="postgresql://postgres:password@localhost:5432/store_rating_db"`

4. **Prisma Migration and Seed:**
   From the `backend` directory, run:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start the Application:**
   From the root directory, run:
   ```bash
   npm run dev
   ```
   This will start both the backend server (Port 5000) and the frontend Vite app concurrently.

## Demo Credentials

The database seed creates several demo accounts with the password `Secure@123`.

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@ratehub.com | Secure@123 |
| **Store Owner** | owner1@ratehub.com | Secure@123 |
| **Normal User** | user1@ratehub.com | Secure@123 |

## API Overview

**Auth**
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/change-password`
- `GET /api/auth/me`

**Admin**
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `GET /api/admin/stores`
- `POST /api/admin/stores`

**Stores & Ratings (User)**
- `GET /api/stores`
- `GET /api/stores/:id`
- `POST /api/ratings`
- `PUT /api/ratings/:id`

**Owner**
- `GET /api/owner/dashboard`
- `GET /api/owner/ratings`

## Future Improvements
- Email verification during registration.
- Forgotten password recovery via email.
- Real-time notifications for store owners when a new rating is submitted.
- Advanced charts with Recharts on the Admin dashboard.
