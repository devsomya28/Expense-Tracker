import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/Feedback";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-base-bg">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden px-16 py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent" />
        <div className="relative flex items-center gap-2">
          <Landmark size={22} className="text-brand-light" />
          <span className="text-xl font-bold text-white">Finora</span>
        </div>

        <div className="relative max-w-md">
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6">
            Financial clarity,
            <br />
            redefined.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Enter a sophisticated ecosystem designed for precision wealth
            management and uncompromising security.
          </p>

          <svg
            viewBox="0 0 640 220"
            className="w-full mt-16 opacity-90"
            fill="none"
          >
            <path
              d="M0 170 C 80 175, 130 150, 170 150 C 220 150, 250 90, 320 80 C 380 72, 420 40, 460 30 L 460 30"
              stroke="url(#g)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="170" cy="150" r="5" fill="#a78bfa" />
            <circle cx="460" cy="30" r="5" fill="#a78bfa" />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="640" y2="0">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p className="relative text-xs text-zinc-600">
          © {new Date().getFullYear()} Finora Systems. Secure Encrypted
          Connection.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Landmark size={22} className="text-brand-light" />
            <span className="text-xl font-bold text-white">Finora</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-zinc-500 text-sm mb-8">
            Log in to your account to continue.
          </p>

          <div className="card p-6">
            <ErrorBanner message={error} />
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="label">Email</label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="name@company.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Password</label>
                  <button
                    type="button"
                    className="text-xs text-brand-light hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-base-border bg-base-panel accent-brand"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3"
              >
                {submitting ? "Logging in..." : "Login"}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-light font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
