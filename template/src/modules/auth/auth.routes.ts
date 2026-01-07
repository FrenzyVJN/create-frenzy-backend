import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../middleware/validate.middleware";
import { registerSchema, loginSchema } from "./auth.types";
import { register, login } from "./auth.controller";

const router = Router();

// Rate limiting for auth routes (100 requests per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to all auth routes
router.use(authLimiter);

// POST /auth/register
router.post("/register", validate(registerSchema), register);

// POST /auth/login
router.post("/login", validate(loginSchema), login);

export default router;
