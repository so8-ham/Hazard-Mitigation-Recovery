# Hazard Mitigation Recovery

## Overview

This repository contains the backend API for a hazard mitigation and recovery system built with Node.js and Express. It supports role-based admin authentication, proposal creation, voting workflows, transaction tracking, notifications, and disaster response data management.

## Key Features

- JWT-based authentication for Main Admin and Local Admin users
- Role-based access control and secure routing
- Proposal submission and approval workflow
- Vote recording and proposal status handling
- Notification delivery and management
- Transaction logging for approved proposals
- MongoDB persistence via Mongoose
- Email OTP verification for password recovery

## Technology Stack

- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs for password hashing
- dotenv for environment configuration
- helmet and cors for security
- morgan for request logging
- nodemailer for email notifications

## Repository Structure

- `backend/src/app.js` - Express app setup
- `backend/src/server.js` - Server bootstrap
- `backend/src/config/` - Database and mail configuration
- `backend/src/controllers/` - Request handlers
- `backend/src/routes/` - API route definitions
- `backend/src/models/` - Mongoose models
- `backend/src/middleware/` - Auth, roles, and error handling
- `backend/src/services/` - Business logic and external services

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/so8-ham/Hazard-Mitigation-Recovery.git
   cd Hazard-Mitigation-Recovery/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/` and set the required values:

   ```env
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=1d
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with nodemon for development

## API Endpoints

### Authentication

- `POST /api/auth/register-main-admin`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/verify-otp`
- `POST /api/auth/reset-password`

### Main Admin

- `POST /api/main-admin/create-local-admin`
- `GET /api/main-admin/local-admins`
- `PUT /api/main-admin/local-admin/:id`
- `DELETE /api/main-admin/local-admin/:id`

### Local Admin

- `GET /api/local-admin/profile`
- `PUT /api/local-admin/profile`
- `DELETE /api/local-admin/delete-account`

### Proposals

- `POST /api/proposal/create`
- `GET /api/proposal/my-proposals`
- `GET /api/proposal/all`
- `GET /api/proposal/:id`

### Voting

- `POST /api/vote/:proposalId`
- `GET /api/vote/proposal/:proposalId`

### Notifications

- `GET /api/notification/my`
- `PUT /api/notification/read/:id`
- `DELETE /api/notification/delete/:id`

## Notes

- This project focuses on backend API functionality. A frontend may be added separately.
- Ensure MongoDB is running and accessible from the configured `MONGO_URI`.
- If using email features, verify SMTP credentials and network access.

## License

This project is licensed under the ISC License.
