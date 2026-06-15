"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "", college: "", gradYear: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const data = {
      username: form.username,
      email: form.email,
      password: form.password,
      college: form.college || undefined,
      gradYear: form.gradYear ? parseInt(form.gradYear) : undefined,
    };

    const parsed = signUpSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!errs[field]) errs[field] = issue.message;
      }
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrors({ form: json.message ?? "Something went wrong." });
        return;
      }
      router.push("/signIn?registered=1");
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-10 h-10 rounded-xl bg-indigo-600 text-white items-center justify-center font-black text-lg mb-4 select-none">
            P
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Already have one?{" "}
            <Link href="/signIn" className="text-indigo-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          {errors.form && (
            <div className="mb-5 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Username"
              name="username"
              value={form.username}
              onChange={onChange}
              error={errors.username}
              placeholder="johndoe42"
              autoComplete="username"
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />

            {/* Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Min 6 chars · 1 uppercase · 1 number"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            <Field
              label="College (optional)"
              name="college"
              value={form.college}
              onChange={onChange}
              error={errors.college}
              placeholder="Your university"
            />

            <Field
              label="Graduation year (optional)"
              name="gradYear"
              type="number"
              value={form.gradYear}
              onChange={onChange}
              error={errors.gradYear}
              placeholder={String(new Date().getFullYear())}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-xs text-center text-muted-foreground">
            By signing up you agree to our{" "}
            <Link href="/terms" className="hover:underline text-foreground/70">Terms</Link> and{" "}
            <Link href="/privacy" className="hover:underline text-foreground/70">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, name, type = "text", value, onChange, error, placeholder, autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
