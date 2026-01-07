import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { AppError } from "./error.middleware";

// Extend Express Request type to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const authenticateToken = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return next(new AppError("Access token required", 401));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return next(new AppError("JWT secret not configured", 500));
    }

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 403));
    }
};
