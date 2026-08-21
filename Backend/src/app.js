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
import intelligenceRoutes from './routes/intelligence.routes.js';
import forecastRoutes from './routes/forecast.routes.js';
import scenarioRoutes from './routes/scenario.routes.js';
import goalRoutes from './routes/goal.routes.js';
import insightRoutes from './routes/insight.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Populated by `npm run build` in Frontend (vite outDir points here).
// Empty/missing in pure-API local dev, which is fine - see fallback below.
const publicDir = path.join(__dirname, "..", "public");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Not needed for the deployed app itself (frontend and API share one
// origin, so the browser never makes a cross-origin request). Kept as an
// opt-in for anyone hitting the API from a separate origin - a local Vite
// dev server without the proxy, a mobile app, Postman, etc. Only enforced
// if FRONTEND_URL is actually set.
if (process.env.FRONTEND_URL) {
  const allowedOrigins = process.env.FRONTEND_URL
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`Not allowed by CORS: ${origin}`));
      },
      credentials: true,
    }),
  );
}

// Health check - useful for deployment platforms (Render/Railway) to verify the service is up
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "ok" });
});

// Serve the built frontend (Backend/public, produced by Frontend's `npm run build`)
app.use(express.static(publicDir));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/budget", budgetRouter); 
app.use("/api/recurring", recurringRouter);
app.use("/api/income", incomeRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/splits", splitRouter);
app.use("/api/ai", aiRouter);
app.use('/api/intelligence', intelligenceRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use(notFound);
app.use(errorHandler);

// SPA fallback: any other GET request (a React Router route like /expenses,
// hit directly or on refresh) gets index.html so the client router can take
// over. Unmatched /api/* requests get a plain 404 instead.
app.get(/^(?!\/api).*/, (req, res, next) => {
  const indexPath = path.join(publicDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) next(); // no build present (e.g. running backend-only) - fall through
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

export default app;
