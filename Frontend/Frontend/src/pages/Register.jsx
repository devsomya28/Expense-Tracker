import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ErrorBanner } from "../components/Feedback";

function getStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-red-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-400"];
  const idx = Math.max(0, Math.min(score - 1, 3));

  return {
    score,
    label: password ? labels[idx] : "",
    color: colors[idx],
  };
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => getStrength(form.password), [form.password]);
  const emailValid = /^\S+@\S+\.\S+$/.test(form.email);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-bg px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <Landmark size={24} className="text-brand-light" />
            <span className="text-3xl font-extrabold bg-gradient-to-r from-white to-brand-light bg-clip-text text-transparent">
              Finora
            </span>
          </div>
          <p className="text-sm text-zinc-500">Premium Finance</p>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-bold text-white mb-1">
            Create an account
          </h2>
          <p className="text-sm text-zinc-500 mb-6">
            Enter your details to join the platform.
          </p>

          <ErrorBanner message={error} />

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="label uppercase text-[11px]">Username</label>
              <input
                required
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                placeholder="john_doe"
                className="input-field"
              />
            </div>

            <div>
              <label className="label uppercase text-[11px]">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="alex@example.com"
                  className="input-field pr-10"
                />
                {emailValid && (
                  <Check
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="label uppercase text-[11px]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1.5 bg-base-border rounded-full overflow-hidden flex gap-0.5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full ${
                          i < strength.score ? strength.color : "bg-base-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500 w-12 text-right">
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="label uppercase text-[11px]">
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <label className="flex items-start gap-2.5 text-sm text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-base-border bg-base-panel accent-brand shrink-0"
              />
              <span>
                I agree to the{" "}
                <span className="text-brand-light underline">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-brand-light underline">
                  Privacy Policy
                </span>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3"
            >
              {submitting ? "Creating account..." : "Create account"}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-light font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
