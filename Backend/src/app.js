import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import expenseRouter from "./routes/expense.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import budgetRouter from "./routes/budget.routes.js";
import recurringRouter from "./routes/recurring.routes.js";
import incomeRouter from "./routes/income.routes.js";
import accountRouter from "./routes/account.routes.js";
import splitRouter from "./routes/split.routes.js";
import aiRouter from "./routes/ai.routes.js";

import intelligenceRoutes from "./routes/intelligence.routes.js";
import forecastRoutes from "./routes/forecast.routes.js";
import scenarioRoutes from "./routes/scenario.routes.js";
import goalRoutes from "./routes/goal.routes.js";
import insightRoutes from "./routes/insight.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

import {
  notFound,
  errorHandler,
} from "./middleware/error.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/*
|--------------------------------------------------------------------------
| Frontend build directory
|--------------------------------------------------------------------------
|
| React/Vite build should generate:
|
| Backend/
|   public/
|     index.html
|     assets/
|
*/
const publicDir = path.join(__dirname, "..", "public");

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| For production, frontend and backend are served from the same
| Render domain, so CORS is normally not required.
|
| FRONTEND_URL can still be set if you want to allow another
| frontend/client to access the API.
|
*/

if (process.env.FRONTEND_URL) {
  const allowedOrigins = process.env.FRONTEND_URL
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests without an Origin header
        // such as Postman/server-to-server requests.
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(
          new Error(`Not allowed by CORS: ${origin}`)
        );
      },
      credentials: true,
    })
  );
}

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ok",
  });
});

/*
|--------------------------------------------------------------------------
| Serve React Frontend
|--------------------------------------------------------------------------
*/

app.use(express.static(publicDir));

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRouter);

app.use("/api/expenses", expenseRouter);

app.use("/api/analytics", analyticsRouter);

app.use("/api/budget", budgetRouter);

app.use("/api/recurring", recurringRouter);

app.use("/api/income", incomeRouter);

app.use("/api/accounts", accountRouter);

app.use("/api/splits", splitRouter);

app.use("/api/ai", aiRouter);

app.use("/api/intelligence", intelligenceRoutes);

app.use("/api/forecast", forecastRoutes);

app.use("/api/scenarios", scenarioRoutes);

app.use("/api/goals", goalRoutes);

app.use("/api/insights", insightRoutes);

app.use("/api/subscription", subscriptionRoutes);

/*
|--------------------------------------------------------------------------
| React SPA Fallback
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This MUST come BEFORE the notFound middleware.
|
| React Router routes such as:
|
| /login
| /dashboard
| /expenses
| /analytics
|
| should all return index.html.
|
*/

app.get(/^(?!\/api).*/, (req, res, next) => {
  const indexPath = path.join(publicDir, "index.html");

  res.sendFile(indexPath, (err) => {
    if (err) {
      next(err);
    }
  });
});

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
|
| This comes AFTER:
| - API routes
| - React SPA fallback
|
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;
