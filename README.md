# Hazard Mitigation Recovery

## Overview

This repository contains a full-stack Hazard Mitigation and Recovery system with:
- `backend/`: Node.js + Express API
- `frontend/`: React + Vite UI

The app supports Main Admin and Local Admin workflows for proposal management, voting, notifications, transaction tracking, and OTP-enabled password recovery.

## Working Details

### Backend

The backend provides REST APIs for:
- Authentication and role-based authorization
- Main Admin management
- Local Admin profile and proposal creation
- Proposal approval workflow and voting
- Notification management
- Transaction logging
- OTP-based password recovery via email

The backend runs on port `4040` by default.

### Frontend

The frontend is a React application built with Vite. It consumes the backend API and provides:
- Login and password reset flows
- Dashboard views for Main Admin and Local Admin
- Proposal creation and list views
- Transaction and notification pages
- Role-aware routing and protected pages

The frontend runs on port `5173` by default.

## Technology Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, Axios, React Router
- Auth: JWT, bcryptjs
- Security: helmet, cors
- Logging: morgan
- Email: nodemailer

## Project Folder Structure

```
hackathon/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── mail.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── mainAdmin.controller.js
│   │   │   ├── localAdmin.controller.js
│   │   │   ├── proposal.controller.js
│   │   │   ├── transaction.controller.js
│   │   │   ├── vote.controller.js
│   │   │   └── notification.controller.js
│   │   ├── models/
│   │   │   ├── mainadmin.model.js
│   │   │   ├── localadmin.model.js
│   │   │   ├── otp.model.js
│   │   │   ├── proposal.model.js
│   │   │   ├── transaction.model.js
│   │   │   ├── vote.model.js
│   │   │   └── notification.model.js
│   │   ├── routes/
│   │   │   ├── mainAdmin.routes.js
│   │   │   ├── localAdmin.routes.js
│   │   │   ├── proposal.routes.js
│   │   │   ├── transaction.routes.js
│   │   │   ├── vote.routes.js
│   │   │   └── notification.routes.js
│   │   └── middlewares/
│   │       ├── auth.middleware.js
│   │       ├── role.middleware.js
│   │       └── error.middleware.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   └── LoginPage.jsx
│   │   │   ├── localAdmin/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── MyProposalsPage.jsx
│   │   │   │   ├── MyTransactionsPage.jsx
│   │   │   │   ├── NewProposalPage.jsx
│   │   │   │   └── ProfilePage.jsx
│   │   │   ├── mainAdmin/
│   │   │   │   ├── AllProposalsPage.jsx
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   ├── LocalAdminsPage.jsx
│   │   │   │   └── TransactionsPage.jsx
│   │   │   └── shared/
│   │   │       └── NotificationsPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── folderstructure.txt
```

## Setup and Run

### Backend

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add `.env` in `backend/` with:
   ```env
   PORT=4040
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password_or_app_password
   ```
4. Start backend:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```
4. Open browser at:
   - `http://localhost:5173`

## API Base URL

- Backend API base: `http://localhost:4040/api`

## Important Notes

- The frontend uses Axios to call the backend at `http://localhost:4040/api`.
- OTP emails require valid Gmail credentials configured in `backend/.env`.
- The backend uses MongoDB via the connection URI in `MONGO_URI`.
- If using Gmail with 2FA, generate an App Password and use that in `EMAIL_PASS`.

## License

This project is licensed under the ISC License.
