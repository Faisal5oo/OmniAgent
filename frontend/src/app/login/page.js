"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { DEMO_CREDENTIALS } from "@/lib/auth";
import { EASE_OUT } from "@/lib/constants";

function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#060708]" />

      <motion.div
        className="absolute left-1/2 top-[-20%] h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(61,255,168,0.14) 0%, transparent 58%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-[10%] bottom-[-20%] h-[50vmax] w-[50vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,184,109,0.1) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[5%] top-[30%] h-[40vmax] w-[40vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(125,211,252,0.08) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
        animate={{ x: [0, -25, 0], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 45%, black, transparent)",
        }}
      />
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || "Invalid credentials.");
        setShake((n) => n + 1);
        setLoading(false);
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/");
      router.refresh();
    } catch {
      setError("Connection failed.");
      setShake((n) => n + 1);
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      key={shake}
      animate={shake ? { x: [0, -7, 7, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.38 }}
      className="w-full max-w-[400px]"
    >
      <motion.div
        className="relative overflow-hidden rounded-[24px] border px-7 py-8 sm:px-9 sm:py-10"
        style={{
          background:
            "linear-gradient(165deg, rgba(255,255,255,0.045) 0%, transparent 40%), rgba(12, 14, 18, 0.72)",
          borderColor: "rgba(184,198,216,0.12)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.06), 0 40px 100px rgba(0,0,0,0.55)",
          backdropFilter: "blur(24px)",
        }}
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: EASE_OUT }}
      >
        {/* Soft inner wash */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              "linear-gradient(180deg, rgba(61,255,168,0.06), transparent)",
          }}
        />

        <div className="relative">
          <motion.p
            className="font-display text-[11px] font-medium tracking-[0.32em] text-signal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            OMNIAGENT
          </motion.p>

          <motion.h1
            className="mt-5 font-display text-[2rem] font-semibold tracking-tight text-[#f2f5f8] sm:text-[2.15rem]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: EASE_OUT }}
          >
            Welcome back
          </motion.h1>
          <motion.p
            className="mt-2 text-[14px] text-mist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
          >
            Access your command center.
          </motion.p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-mist-bright">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
                className="w-full rounded-2xl border-0 bg-[#080a0c]/85 px-4 py-3.5 text-[14px] text-[#eef2f7] outline-none ring-1 ring-white/[0.08] transition placeholder:text-mist/50 focus:ring-signal/35"
                placeholder="name@company.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-mist-bright">
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border-0 bg-[#080a0c]/85 px-4 py-3.5 pr-11 text-[14px] text-[#eef2f7] outline-none ring-1 ring-white/[0.08] transition placeholder:text-mist/50 focus:ring-signal/35"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-mist/80 transition hover:text-mist-bright"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                className="mt-4 text-[13px] text-red-300"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold tracking-tight text-[#04120c] disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #3dffa8 0%, #1fb874 100%)",
              boxShadow:
                "0 0 0 1px rgba(61,255,168,0.3), 0 12px 32px rgba(61,255,168,0.18)",
            }}
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
          >
            {loading ? (
              <motion.span
                className="h-4 w-4 rounded-full border-2 border-[#04120c]/25 border-t-[#04120c]"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>

          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-white/10" />
            <p className="font-mono text-[10px] tracking-wide text-mist/70">
              {DEMO_CREDENTIALS.email}
            </p>
            <span className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </motion.div>
    </motion.form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-5 py-14">
      <Atmosphere />
      <div className="relative z-10 w-full max-w-[400px]">
        <Suspense
          fallback={
            <div className="h-[420px] w-full animate-pulse rounded-[24px] bg-white/[0.04]" />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
