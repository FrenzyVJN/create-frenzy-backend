# Frenzy Backend

A production-ready, reusable hackathon backend template built with modern TypeScript and best practices. Perfect for student projects, MVPs, and rapid prototyping.

## Tech Stack

- **Runtime**: Node.js (>=20)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma v7
- **Validation**: Zod
- **Authentication**: JWT + bcrypt
- **Environment**: dotenv
- **Rate Limiting**: express-rate-limit

## Features

- Complete authentication system (register/login)
- JWT-based authorization
- Password hashing with bcrypt (10 rounds)
- Request validation using Zod
- Global error handling
- Rate limiting on auth routes
- Graceful shutdown handling
- Prisma singleton pattern with connection pooling
- Health check endpoints
- TypeScript strict mode
- Modular architecture

## Quick Start

### Prerequisites

- Node.js 20 or higher
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: Server port (default: 3000)
   - `NODE_ENV`: development or production

3. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

4. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Your server should now be running at `http://localhost:3000`!

## Project Structure

```
frenzy-backend/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── db/
│   │   └── prisma.ts          # Prisma client singleton
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT authentication
│   │   ├── error.middleware.ts     # Global error handler
│   │   └── validate.middleware.ts  # Zod validation
│   └── modules/
│       ├── auth/
│       │   ├── auth.types.ts       # Zod schemas
│       │   ├── auth.controller.ts  # Auth logic
│       │   └── auth.routes.ts      # Auth endpoints
│       └── health/
│           └── health.routes.ts    # Health checks
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Migration history
├── prisma.config.ts           # Prisma v7 configuration
├── .env.example               # Environment template
└── package.json
```

## Available Endpoints

### Health Check
- `GET /health` - Public health check
  ```json
  {
    "status": "ok",
    "uptime": 123.456
  }
  ```

- `GET /health/protected` - Protected endpoint (requires JWT)
  ```json
  {
    "status": "ok",
    "message": "You are authenticated!",
    "userId": "user-uuid"
  }
  ```

### Authentication
- `POST /auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

- `POST /auth/login` - Login and receive JWT
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```

Both return:
```json
{
  "message": "...",
  "token": "jwt-token-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

## Adding New Modules

Follow the modular pattern to add new features:

1. **Create module directory**
   ```bash
   mkdir -p src/modules/yourModule
   ```

2. **Add types (Zod schemas)**
   ```typescript
   // src/modules/yourModule/yourModule.types.ts
   import { z } from "zod";
   
   export const yourSchema = z.object({
     field: z.string(),
   });
   
   export type YourType = z.infer<typeof yourSchema>;
   ```

3. **Create controller**
   ```typescript
   // src/modules/yourModule/yourModule.controller.ts
   import { Request, Response, NextFunction } from "express";
   
   export const yourHandler = async (req: Request, res: Response, next: NextFunction) => {
     try {
       // Your logic here
       res.json({ success: true });
     } catch (error) {
       next(error);
     }
   };
   ```

4. **Define routes**
   ```typescript
   // src/modules/yourModule/yourModule.routes.ts
   import { Router } from "express";
   import { validate } from "../../middleware/validate.middleware";
   import { authenticateToken } from "../../middleware/auth.middleware";
   import { yourSchema } from "./yourModule.types";
   import { yourHandler } from "./yourModule.controller";
   
   const router = Router();
   
   router.post("/", authenticateToken, validate(yourSchema), yourHandler);
   
   export default router;
   ```

5. **Register in app.ts**
   ```typescript
   import yourModuleRoutes from "./modules/yourModule/yourModule.routes";
   app.use("/your-endpoint", yourModuleRoutes);
   ```

## Protecting Routes

Use the `authenticateToken` middleware to protect routes:

```typescript
import { authenticateToken } from "../../middleware/auth.middleware";

router.get("/protected", authenticateToken, (req, res) => {
  // req.userId is available here
  res.json({ userId: req.userId });
});
```

## Validation

Use the `validate` middleware with Zod schemas:

```typescript
import { validate } from "../../middleware/validate.middleware";
import { yourSchema } from "./yourModule.types";

router.post("/endpoint", validate(yourSchema), controller);
```

## NPM Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma client

## Prisma Commands

```bash
# Create a new migration
npm run prisma:migrate

# Generate Prisma client after schema changes
npm run prisma:generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 7-day expiration
- **Rate Limiting**: 100 requests per 15 minutes on auth routes
- **Input Validation**: All requests validated with Zod
- **Error Handling**: No stack traces leaked in production
- **CORS**: Enabled for cross-origin requests

## Error Handling

All errors are caught by the global error handler. Use the `AppError` class for custom errors:

```typescript
import { AppError } from "../middleware/error.middleware";

throw new AppError("Resource not found", 404);
```

## Best Practices

1. **Always validate inputs** with Zod schemas
2. **Use async/await** with try-catch blocks
3. **Pass errors to next()** in controllers
4. **Keep controllers thin** - business logic in services
5. **One module = one feature** (routes, types, controller)
6. **Update Prisma schema** then run migrations
7. **Protect sensitive routes** with `authenticateToken`
