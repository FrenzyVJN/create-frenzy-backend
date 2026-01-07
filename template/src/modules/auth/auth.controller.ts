import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { prisma } from "../../db/prisma";
import { AppError } from "../../middleware/error.middleware";
import { RegisterInput, LoginInput } from "./auth.types";

const SALT_ROUNDS = 10;

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body as RegisterInput;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return next(new AppError("User already exists", 409));
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // Generate JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return next(new AppError("JWT secret not configured", 500));
        }

        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body as LoginInput;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return next(new AppError("Invalid credentials", 401));
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new AppError("Invalid credentials", 401));
        }

        // Generate JWT
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return next(new AppError("JWT secret not configured", 500));
        }

        const token = jwt.sign({ userId: user.id }, secret, {
            expiresIn: "7d",
        });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};
