import { Router } from "express";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = Router();

// Public health check
router.get("/", (_req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
    });
});

// Protected route example
router.get("/protected", authenticateToken, (req, res) => {
    res.json({
        status: "ok",
        message: "You are authenticated!",
        userId: req.userId,
    });
});

export default router;
