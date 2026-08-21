import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { ProtectedRoute, PublicOnlyRoute } from "./components/RouteGuards";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Recurring from "./pages/Recurring";
import Accounts from "./pages/Accounts";
import SplitExpenses from "./pages/SplitExpenses";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import AskAI from "./pages/AskAI";
import Settings from "./pages/Settings";
import GoalsPage from "./pages/GoalsPage";
import Forecast from "./pages/Forecast";
import ScenarioPage from "./pages/ScenarioPage";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/income" element={<Income />} />
              <Route path="/recurring" element={<Recurring />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/split-expenses" element={<SplitExpenses />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/scenarios" element={<ScenarioPage />} />
              <Route path="/pricing" element={<Pricing />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
