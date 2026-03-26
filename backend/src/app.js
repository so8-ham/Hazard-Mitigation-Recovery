import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import mainAdminRoutes from "./routes/mainAdmin.routes.js";
import localAdminRoutes from "./routes/localAdmin.routes.js";
import authRoutes from "./routes/password.routes.js";


import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors());

// Logging
app.use(morgan("dev"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API Running"
  });
});

// Routes
app.use("/api/main-admin", mainAdminRoutes);
app.use("/api/local-admin", localAdminRoutes);
app.use("/api/auth", authRoutes);


// 404 route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Global error handler
app.use(errorMiddleware);

export default app;