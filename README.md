# 🏛️ University Hall Management — REST API

A secure, modular Express + TypeScript REST API powering a dual-role university hall management platform.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/express-5.1.0-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/mongodb-atlas-green.svg)](https://www.mongodb.com/atlas/database)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Deployment Status](https://img.shields.io/badge/deployment-active-success.svg)](https://hall-management-api.onrender.com)

[API Docs](https://hall-management-api.onrender.com/health) | [Frontend Client](https://hall-management-server-three.vercel.app) | [Report Bug](https://github.com/rasel754/hall-management-server/issues)

## 📖 Overview

This REST API manages student accommodation, room allocations, fee payments, and administrative workflows in a university hall environment. The system serves two primary roles: administrators who manage room configurations, approve bookings, and post announcements, and students who apply for rooms, track payment statuses, and submit maintenance complaints. Featuring JWT-based authentication, schema-first input validation, and role-based access control, the system exposes over 40 structured endpoints. The API is written in strict-mode TypeScript, interfaces with a MongoDB Atlas cluster, and runs on Render in production.

## 🗂️ Table of Contents

- [Overview](#-overview)
- [Architecture Overview](#-architecture-overview)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Request & Response Format](#-request--response-format)
- [Data Models](#-data-models)
- [Authentication & Security](#-authentication--security)
- [Error Handling](#-error-handling)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Database Seeding](#-database-seeding)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Author / Contact](#-author--contact)

## 🏗️ Architecture Overview

The system uses a modular MVC architecture that groups controller, model, route, service, validation, and type files within separate feature directories inside the modules folder. This approach isolates domains like auth, room, booking, and complaint, ensuring that changes to booking logic do not impact authentication or student profile systems. Config files manage central setups like DB connections, environment schemas, and CORS origins, while reusable middleware handles logging, cross-cutting security, and validation before controllers are reached.

```text
src/
├── config/
│   ├── db.ts              # MongoDB connection with retry logic
│   ├── env.ts             # Zod-validated environment variables
│   └── corsOptions.ts     # CORS whitelist configuration
├── modules/
│   ├── auth/              # register, login, forgot/reset password, me
│   ├── student/           # profile, bookings, complaints, notices, payments
│   ├── admin/             # dashboard stats, student mgmt, analytics
│   ├── room/              # CRUD, status management, availability
│   ├── booking/           # create, approve, reject, cancel
│   ├── complaint/         # create, update status, resolve
│   ├── notice/            # create, publish, toggle active
│   └── payment/           # history, pay, status update
├── middlewares/
│   ├── auth.middleware.ts  # verifyToken, requireRole, checkBlocked
│   ├── errorHandler.ts    # Global centralized error handler
│   ├── notFound.ts        # 404 catch-all
│   ├── rateLimiter.ts     # express-rate-limit (auth: 10/15min, api: 100/15min)
│   ├── requestLogger.ts   # Morgan HTTP logging
│   └── validateRequest.ts # Zod schema middleware factory
├── utils/
│   ├── ApiError.ts        # Custom error class with statusCode
│   ├── ApiResponse.ts     # Standardized success response wrapper
│   ├── catchAsync.ts      # Async handler wrapper (eliminates try/catch)
│   ├── pagination.ts      # Reusable pagination helpers
│   └── sendEmail.ts       # Nodemailer email utility
├── types/
│   └── express.d.ts       # Extended Express Request (req.user)
├── app.ts                 # Express app config + middleware chain
├── server.ts              # Entry point + DB connect + graceful shutdown
└── seed.ts                # Database seeder script
```

## 🔌 API Endpoints Reference

### AUTH (/api/v1/auth)

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| POST | /register | No | — | Register new student account |
| POST | /login | No | — | Authenticate and receive JWT |
| POST | /logout | Yes | Any | Invalidate session |
| GET | /me | Yes | Any | Get current user profile |
| PUT | /change-password | Yes | Any | Change own password |
| POST | /forgot-password | No | — | Send password reset email |
| POST | /reset-password/:token | No | — | Reset password via email token |

### STUDENT (/api/v1/student)

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | /profile | Yes | Student | Get own profile |
| PUT | /profile | Yes | Student | Update profile fields |
| GET | /room | Yes | Student | Get current room assignment |
| GET | /bookings | Yes | Student | List own booking history |
| POST | /bookings | Yes | Student | Submit new room booking request |
| DELETE | /bookings/:id | Yes | Student | Cancel a pending booking |
| GET | /complaints | Yes | Student | List own complaints (filterable) |
| POST | /complaints | Yes | Student | Submit new complaint |
| GET | /complaints/:id | Yes | Student | Get single complaint detail |
| GET | /notices | Yes | Student | List active notices (filterable) |
| GET | /notices/:id | Yes | Student | Get single notice |
| GET | /payments | Yes | Student | Get payment history |
| POST | /payments/:id/pay | Yes | Student | Process payment for a record |

### ADMIN (/api/v1/admin)

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | /dashboard | Yes | Admin | Aggregated stats overview |
| GET | /students | Yes | Admin | List all students (search, filter, paginate) |
| GET | /students/:id | Yes | Admin | Get full student profile |
| DELETE | /students/:id | Yes | Admin | Remove student account |
| PUT | /students/:id/block | Yes | Admin | Block student with reason |
| PUT | /students/:id/unblock | Yes | Admin | Unblock student account |
| GET | /rooms | Yes | Admin | List all rooms (filter, paginate) |
| POST | /rooms | Yes | Admin | Create new room |
| GET | /rooms/:id | Yes | Admin | Get room with current occupants |
| PUT | /rooms/:id | Yes | Admin | Update room details |
| DELETE | /rooms/:id | Yes | Admin | Delete empty room |
| PUT | /rooms/:id/status | Yes | Admin | Update room status |
| GET | /bookings | Yes | Admin | List all booking requests (filter, paginate) |
| PUT | /bookings/:id/approve | Yes | Admin | Approve booking + update room occupancy |
| PUT | /bookings/:id/reject | Yes | Admin | Reject booking with reason |
| GET | /complaints | Yes | Admin | List all complaints (filter, paginate) |
| PUT | /complaints/:id/status | Yes | Admin | Update complaint status + admin note |
| GET | /notices | Yes | Admin | List all notices (paginate, filter) |
| POST | /notices | Yes | Admin | Create and publish notice |
| PUT | /notices/:id | Yes | Admin | Edit existing notice |
| DELETE | /notices/:id | Yes | Admin | Delete notice |
| PUT | /notices/:id/toggle | Yes | Admin | Toggle notice active/inactive |
| GET | /payments | Yes | Admin | All payments (filter by status/month) |
| PUT | /payments/:id/status | Yes | Admin | Manually update payment status |
| GET | /analytics | Yes | Admin | Charts data (revenue, occupancy, complaints) |

All list endpoints support pagination via ?page=1&limit=10 query parameters. Response meta includes total, page, limit, and totalPages.

## 📥 Request & Response Format

### EXAMPLE 1 — Successful Login (POST /api/v1/auth/login)

**Request body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjFhMmIzYzRkNWU2ZjdhOGI5YzBkMSIsInJvbGUiOiJzdHVkZW50In0.x4N1_aW...",
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "studentId": "STU-2024-001",
      "department": "Computer Science",
      "avatar": "https://res.cloudinary.com/demo/image/upload/v1600000000/avatar.jpg"
    }
  }
}
```

### EXAMPLE 2 — Validation Error (POST /api/v1/auth/register with missing fields)

**Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email address",
    "password": "Password must be at least 8 characters"
  }
}
```

### EXAMPLE 3 — Paginated List (GET /api/v1/admin/students?page=2&limit=5)

**Response (200):**
```json
{
  "success": true,
  "message": "Students retrieved successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Alice Smith",
      "email": "alice.smith@example.com",
      "role": "student",
      "studentId": "STU-2024-002",
      "department": "Electrical Engineering",
      "isBlocked": false
    }
  ],
  "meta": {
    "total": 47,
    "page": 2,
    "limit": 5,
    "totalPages": 10
  }
}
```

## 🗃️ Data Models

<details>
<summary>📄 User Model</summary>

```typescript
interface IUser {
  _id: ObjectId;
  name: string;                          // 2–50 characters
  email: string;                         // unique, lowercase
  password: string;                      // bcrypt hashed, select: false
  role: 'student' | 'admin';
  studentId?: string;                    // unique, students only
  department?: string;
  year?: 1 | 2 | 3 | 4;
  phone?: string;
  avatar?: string;                       // image URL
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  isBlocked: boolean;                    // default: false
  blockReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
```
</details>

<details>
<summary>📄 Room Model</summary>

```typescript
interface IRoom {
  _id: ObjectId;
  roomNumber: string;                    // unique room identifier
  floor: number;                         // building floor index
  type: 'single' | 'double' | 'triple';  // room occupancy type
  capacity: number;                      // maximum allowed occupants
  currentOccupancy: number;              // current count of assigned students
  pricePerMonth: number;                 // monthly fee in local currency
  facilities: string[];                  // array of room amenities
  images: string[];                      // image URLs
  status: 'available' | 'occupied' | 'full' | 'maintenance'; // room status flag
  createdAt: Date;
  updatedAt: Date;
}
```
</details>

<details>
<summary>📄 Booking Model</summary>

```typescript
interface IBooking {
  _id: ObjectId;
  student: ObjectId;                     // reference to User model (student role)
  room: ObjectId;                        // reference to Room model
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'active'; // booking status
  requestDate: Date;                     // timestamp of request creation
  approvalDate?: Date;                   // timestamp of admin approval
  approvedBy?: ObjectId;                 // reference to User (admin role)
  cancellationReason?: string;           // reason for cancellation or rejection
  cancellationDate?: Date;               // timestamp of cancellation
  moveInDate?: Date;                     // scheduled move-in date
  moveOutDate?: Date;                    // scheduled move-out date
  createdAt: Date;
  updatedAt: Date;
}
```
</details>

<details>
<summary>📄 Complaint Model</summary>

```typescript
interface IComplaint {
  _id: ObjectId;
  student: ObjectId;                     // reference to User model (student role)
  title: string;                         // 5–100 characters title
  category: 'maintenance' | 'noise' | 'cleanliness' | 'security' | 'other';
  description: string;                   // 20–1000 characters description
  image?: string;                        // optional attachment URL
  status: 'pending' | 'in_progress' | 'resolved'; // status workflow
  resolvedBy?: ObjectId;                 // reference to User (admin role)
  resolvedAt?: Date;                     // timestamp of resolution
  adminNote?: string;                    // response note from administrator
  createdAt: Date;
  updatedAt: Date;
}
```
</details>

<details>
<summary>📄 Notice Model</summary>

```typescript
interface INotice {
  _id: ObjectId;
  title: string;                         // 5–150 characters notice title
  content: string;                       // 20–5000 characters main content
  category: 'general' | 'urgent' | 'academic' | 'maintenance';
  publishedBy: ObjectId;                 // reference to User model (admin role)
  isActive: boolean;                     // published status visibility
  publishDate: Date;                     // timestamp of publication
  expiryDate?: Date;                     // optional auto-expiration date
  createdAt: Date;
  updatedAt: Date;
}
```
</details>

<details>
<summary>📄 Payment Model</summary>

```typescript
interface IPayment {
  _id: ObjectId;
  student: ObjectId;                     // reference to User model (student role)
  booking: ObjectId;                     // reference to Booking model
  amount: number;                        // transaction amount
  month: string;                         // billing month (e.g. "January 2026")
  status: 'pending' | 'paid' | 'overdue'; // billing status
  paidAt?: Date;                         // timestamp of payment clearance
  transactionId?: string;                // unique transaction confirmation reference
  createdAt: Date;
  updatedAt: Date;
}
```
</details>

## 🔐 Authentication & Security

Tokens are generated on successful login and contain the payload identifier and user role. The client sends this token inside the Authorization header as a Bearer token. The verifyToken middleware extracts this token, verifies it against the JWT secret, and attaches the decoded user data to the express request object. Subsequent middleware layers read this request object to validate authorization levels.

- **Password Hashing**: Cryptographic protection is achieved using bcryptjs with 12 salt rounds, ensuring that database records store only strong, non-reversible hashes.
- **Input Validation**: All POST and PUT requests are intercepted at the application boundary by Zod schemas, returning a 400 Bad Request response with detailed field-level errors if validation fails.
- **Role-Based Access**: The requireRole middleware matches the user role within the verified token against the endpoint restrictions, preventing students from accessing administrator paths.
- **Block Check**: The checkBlocked middleware queries the user state on every authenticated transaction, rejecting requests from blocked accounts with a 403 Forbidden error response containing the blocking reason.
- **Rate Limiting**: Path-specific rate limiting prevents abuse, restricting authentication paths to 10 requests per 15 minutes, and other application endpoints to 100 requests per 15 minutes.
- **Helmet**: Integration of Helmet sets eleven HTTP headers, including Content-Security-Policy and X-Frame-Options, guarding the system against clickjacking and scripting attacks.
- **CORS**: Requests are filtered using a strict cross-origin resource sharing policy that accepts only configuration-matched frontend origins and drops unlisted domains.
- **No Sensitive Leaks**: Sensitive fields like user passwords are restricted from database query results using Mongoose projections, and error stack traces are omitted in production environments.

## 🚨 Error Handling

Centralized error handling interceptors capture database validation failures, wrong cast targets, and custom runtime exceptions, ensuring the server returns uniform JSON error payloads.

| Error Type | HTTP Status | Triggered By |
| :--- | :--- | :--- |
| Validation Error (Zod) | 400 | Invalid request body fields |
| Cast Error (Mongoose) | 400 | Invalid MongoDB ObjectId in params |
| Duplicate Key (MongoDB 11000) | 409 | Duplicate email or studentId |
| Authentication Error | 401 | Missing, expired, or invalid JWT |
| Authorization Error | 403 | Insufficient role or blocked account |
| Not Found | 404 | Route doesn't exist or resource not found |
| Internal Server Error | 500 | Unexpected runtime errors |

## 🚀 Getting Started

Prerequisites: Node.js v18+, MongoDB Atlas account, and npm package manager.

1. Clone the repository:
   ```bash
   git clone https://github.com/rasel754/hall-management-server.git
   cd hall-management-server
   ```

2. Install the application dependencies:
   ```bash
   npm install
   ```

3. Set up the local environment file:
   ```bash
   cp .env.example .env
   ```

4. Populate the database with initial dummy datasets:
   ```bash
   npm run seed
   ```

5. Launch the development server in watch mode:
   ```bash
   npm run dev
   ```

6. Verify that the server is operational:
   ```bash
   curl http://localhost:5000/health
   ```

## ⚙️ Environment Variables

| Variable | Description | Required | Example |
| :--- | :--- | :--- | :--- |
| PORT | Port number where Express runs | Yes | 5000 |
| NODE_ENV | Active deployment environment context | Yes | development |
| MONGO_URI | Address link to the MongoDB database cluster | Yes | mongodb+srv://user:pass@cluster.mongodb.net/db |
| JWT_SECRET | String key used to sign credentials tokens | Yes | replace_with_a_strong_256_bit_random_secret |
| JWT_EXPIRES_IN | Expiry duration configuration for authentication | Yes | 7d |
| FRONTEND_ORIGIN | Address link of the target web client application | Yes | http://localhost:5173 |
| EMAIL_HOST | SMTP server hostname for system email alerts | Yes | smtp.mailtrap.io |
| EMAIL_PORT | Networking port for outgoing mail transport | Yes | 2525 |
| EMAIL_USER | Authentication credential name for email | Yes | your_mailtrap_username |
| EMAIL_PASS | Authentication credential key for email | Yes | your_mailtrap_password |
| EMAIL_FROM | Identity address used on outgoing email headers | Yes | noreply@hallms.com |

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hall-ms
JWT_SECRET=replace_with_a_strong_256_bit_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:5173
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_mailtrap_username
EMAIL_PASS=your_mailtrap_password
EMAIL_FROM=noreply@hallms.com
```

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| npm run dev | ts-node-dev src/server.ts | Start development server with ts-node-dev (hot reload) |
| npm run build | tsc | Compile TypeScript to dist/ folder |
| npm start | node dist/server.js | Run compiled production build |
| npm run seed | ts-node src/seed.ts | Clear DB and insert demo data |
| npm run lint | eslint . | Run ESLint on all TypeScript files |
| npm run type-check | tsc --noEmit | Run tsc --noEmit (no output, type errors only) |

## 🌱 Database Seeding

The database seeder is designed to facilitate local development and verification of administrative functions. It purges existing collections in the database and recreates them with formatted mock data.

- 1 Admin account (admin@example.com / adminpassword123)
- 10 Student accounts (including john.doe@example.com / password123)
- 20 Rooms across 4 floors (mix of single, double, triple types)
- 5 Notices (various categories, some expired)
- 8 Booking requests (mix of pending, approved, rejected)
- 6 Complaints (mix of categories and resolution states)
- Payment records auto-generated for all approved bookings

Run `npm run seed` to reset and populate the database. ⚠️ This will wipe all existing data.

## ☁️ Deployment

### Deploying to Render

1. Commit all project configurations and push the code to your GitHub repository.
2. Log into the Render platform dashboard and launch a new Web Service instance.
3. Establish a link to your target GitHub repository from the Render dashboard.
4. Set the Build Command configuration parameter:
   ```bash
   npm install && npm run build
   ```
5. Set the Start Command configuration parameter:
   ```bash
   npm start
   ```
6. Add the environment variables specified in the Environment Variables table inside the Render dashboard.
7. Confirm deployment. Render will execute builds and trigger service redeployments on every push.

### Environment Checklist before deploying

- [ ] NODE_ENV set to production
- [ ] MONGO_URI points to Atlas production cluster
- [ ] JWT_SECRET is a strong random string (32+ chars)
- [ ] FRONTEND_ORIGIN matches your deployed frontend URL
- [ ] No hardcoded secrets in codebase

## 🗺️ Roadmap

- [x] Modular MVC architecture
- [x] JWT authentication with role-based guards
- [x] Full CRUD for rooms, bookings, complaints, notices, payments
- [x] Centralized error handling with consistent response format
- [x] Zod input validation on all endpoints
- [x] Rate limiting and security headers
- [x] Pagination and filtering on all list endpoints
- [x] Database seeder with realistic demo data
- [ ] WebSocket support for real-time notifications
- [ ] Payment gateway integration (SSLCommerz for BD market)
- [ ] File upload to Cloudinary (room images, avatars)
- [ ] Email notification system (booking approved, complaint resolved)
- [ ] Redis caching for analytics endpoints
- [ ] API documentation with Swagger / OpenAPI 3.0
- [ ] Unit and integration tests (Jest + Supertest)
- [ ] Docker + docker-compose for local development

## 🤝 Contributing

1. Fork the repository on GitHub.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: add payment gateway integration'`).
4. Push the branch to your remote fork (`git push origin feature/amazing-feature`).
5. Open a Pull Request from the branch to our main repository branch for review.

### Conventional Commit Examples

```text
feat: add payment gateway integration
fix: resolve booking approval race condition
docs: update API endpoint reference
refactor: extract pagination logic to utility function
```

## 📄 License

This software application is distributed under the [MIT License](LICENSE).

## 👤 Author / Contact

- **Rasel**
- [Portfolio](https://portfolio-iota-two-90.vercel.app)
- [LinkedIn](https://www.linkedin.com/in/rasel754)
- [Email](mailto:raselahmed73614@gmail.com)
- [GitHub](https://github.com/rasel754)
