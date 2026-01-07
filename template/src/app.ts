import express from "express";
import cors from "cors";
import healthRoutes from "./modules/health/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
