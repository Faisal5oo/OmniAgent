/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#050607",
          900: "#0a0c0f",
          800: "#12151a",
          700: "#1a1e26",
          600: "#252b36",
        },
        signal: {
          DEFAULT: "#3dffa8",
          dim: "#1a9e6a",
          muted: "rgba(61, 255, 168, 0.12)",
        },
        brass: {
          DEFAULT: "#e8b86d",
          dim: "#a67c3d",
          muted: "rgba(232, 184, 109, 0.12)",
        },
        mist: {
          DEFAULT: "#b8c6d8",
          bright: "#dce5f0",
          dim: "#8fa0b5",
        },
      },
      boxShadow: {
        glass:
          "inset 0 1px 0 0 rgba(255,255,255,0.07), inset 0 -1px 0 0 rgba(0,0,0,0.35), 0 28px 80px rgba(0,0,0,0.55)",
        "glass-sm":
          "inset 0 1px 0 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.35)",
        signal: "0 0 24px rgba(61, 255, 168, 0.25)",
        brass: "0 0 20px rgba(232, 184, 109, 0.2)",
      },
      keyframes: {
        "shimmer-sweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "border-spin": {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shimmer: "shimmer-sweep 2.4s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "float-y": "float-y 4s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
