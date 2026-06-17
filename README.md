# 🏢 University Hall Management API

A robust, production-ready backend REST API for managing university hall operations. This system handles student accommodations, administrative workflows, and role-based access control, providing a secure and scalable foundation for university administrative systems.

## 🔗 Live API & Base URL

- **Base URL:** `http://localhost:5000` (Local)
- **Health Check:** `GET /health` (Returns `{"success": true, "message": "Server is running"}`)

*(Update the Base URL with your production link once deployed, e.g., `https://api.yourdomain.com`)*

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control (Admin, Student).
- **Role Management**: Differentiated permissions for Admins (managing halls, assigning rooms) and Students (viewing assignments, requesting services).
- **Student Management**: Endpoints for registering, updating, and managing student profiles.
- **Hall & Room Allocation**: Core functionality for managing university housing capacity and assignments.
- **Data Validation**: Strict input validation using Zod to ensure data integrity.
- **Robust Error Handling**: Centralized global error handler returning consistent and predictable API responses.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB
- **ORM / ODM:** Mongoose
- **Validation:** Zod
- **Security:** bcryptjs (password hashing), jsonwebtoken (JWT auth), CORS
- **Tooling:** ts-node

## 🛣️ API Endpoints

Below is a sample of the core API structure:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT

### Admin (Protected: Requires Admin Role)
- `GET /api/admin/dashboard` - Get administrative statistics
- `POST /api/admin/rooms` - Add a new room to a hall
- `GET /api/admin/students` - Retrieve all student records
- *(Additional CRUD endpoints for halls, rooms, and student management)*

### Student (Protected: Requires Student Role)
- `GET /api/student/profile` - Get logged-in student's profile
- `PUT /api/student/profile` - Update profile details
- `GET /api/student/room` - Get current room assignment details

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Hall-Management-Server.git
   cd Hall-Management-Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory based on the example below.

4. **Start the development server:**
   ```bash
   npm run dev-backend
   ```
   *The server will start on `http://localhost:5000`.*

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Application Port
PORT=5000

# MongoDB Connection String
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hall-ms?retryWrites=true&w=majority

# JWT Secret Key (Use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend Application Origin (For CORS)
FRONTEND_ORIGIN=https://hall-mangement-client.vercel.app
```

## 🛡️ Error Handling & Security

- **Global Error Handler:** All errors are intercepted by a centralized middleware (`errorHandler.ts`), ensuring the client always receives a clean JSON response structured as `{ "success": false, "message": "...", "error": {...} }`.
- **Validation:** Requests are intercepted and validated against predefined schemas using **Zod** before hitting the controllers.
- **Authentication:** Passwords are encrypted using **bcryptjs** before saving to the database. Routes are protected via middleware that verifies the **JWT** token and checks user roles.
- **CORS:** Configured to only accept requests from the designated `FRONTEND_ORIGIN`.

## 📁 Folder Structure

```text
src/
├── config/         # Environment variables and configuration files
├── controllers/    # Request handlers for various routes
├── middlewares/    # Custom middlewares (auth, errorHandler, etc.)
├── models/         # Mongoose schemas and models
├── routes/         # API route definitions (auth, admin, student)
├── types/          # TypeScript interfaces and type definitions
├── utils/          # Helper functions and utilities
├── validations/    # Zod schemas for input validation
├── app.ts          # Express app configuration & middleware setup
└── server.ts       # Server entry point and database connection
```

---
*Developed with ❤️ for streamlined university operations.*
