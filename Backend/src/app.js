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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "ok" });
});

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

app.get(/^(?!\/api).*/, (req, res, next) => {
  const indexPath = path.join(publicDir, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) next(); 
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

export default app;
