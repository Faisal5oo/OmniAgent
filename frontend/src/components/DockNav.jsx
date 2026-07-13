"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Hexagon, Layers, LogOut, Scale, Users } from "lucide-react";
import { SPRING_TRANSITION } from "@/lib/constants";

const ITEMS = [
  { icon: Layers, label: "Console", href: "/", match: (path) => path === "/" },
  {
    icon: Users,
    label: "Leads",
    href: "/leads",
    match: (path) => path === "/leads" || path.startsWith("/leads/"),
  },
  {
    icon: Scale,
    label: "Decision Desk",
    href: "/desk",
    match: (path) => path === "/desk" || path.startsWith("/desk/"),
  },
];

export default function DockNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Still clear local route even if request fails
    }
    router.replace("/login");
    router.refresh();
  };

  return (
    <motion.nav
      className="surface-sm fixed inset-x-3 bottom-3 z-40 flex h-[64px] flex-row items-center justify-between px-2 safe-bottom md:static md:inset-auto md:bottom-auto md:z-auto md:h-auto md:w-[72px] md:shrink-0 md:flex-col md:justify-start md:self-stretch md:px-0 md:py-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING_TRANSITION}
      aria-label="Primary"
    >
      <Link href="/" aria-label="OmniAgent home">
        <motion.span
          className="relative mb-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl md:mb-7"
          style={{
            background:
              "linear-gradient(145deg, rgba(61,255,168,0.18), rgba(232,184,109,0.08))",
            boxShadow:
              "0 0 0 1px rgba(61,255,168,0.22), 0 8px 24px rgba(61,255,168,0.12), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
          whileHover={{ scale: 1.08, rotate: 8 }}
          whileTap={{ scale: 0.92, rotate: -4 }}
          transition={SPRING_TRANSITION}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(61,255,168,0.35), transparent)",
            }}
          />
          <Hexagon className="relative h-5 w-5 text-signal" strokeWidth={1.6} />
          <motion.span
            className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-signal shadow-signal"
            animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </motion.span>
      </Link>

      <div className="flex flex-1 flex-row items-center justify-center gap-1 md:flex-none md:flex-col md:gap-1.5">
        {ITEMS.map(({ icon: Icon, label, href, match }, i) => {
          const active = match(pathname);

          return (
            <Link key={label} href={href} title={label} aria-label={label}>
              <motion.span
                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                  active
                    ? "text-signal"
                    : "text-mist hover:bg-ink-700/60 hover:text-mist-bright"
                }`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_TRANSITION, delay: 0.06 + i * 0.04 }}
                whileHover={{ scale: 1.1, y: -1 }}
                whileTap={{ scale: 0.9 }}
              >
                {active && (
                  <motion.span
                    layoutId="dock-active"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "rgba(61,255,168,0.1)",
                      boxShadow:
                        "0 0 0 1px rgba(61,255,168,0.28), 0 0 20px rgba(61,255,168,0.12)",
                    }}
                    transition={SPRING_TRANSITION}
                  />
                )}
                <motion.span
                  className="relative"
                  animate={active ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={
                    active
                      ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                      : {}
                  }
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </motion.span>
                {active && (
                  <>
                    <motion.span
                      layoutId="dock-rail"
                      className="absolute -left-[3px] hidden h-4 w-[2px] rounded-full bg-signal md:block"
                      transition={SPRING_TRANSITION}
                    />
                    <motion.span
                      layoutId="dock-rail-mobile"
                      className="absolute -bottom-[3px] h-[2px] w-4 rounded-full bg-signal md:hidden"
                      transition={SPRING_TRANSITION}
                    />
                  </>
                )}
              </motion.span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center md:mt-auto md:flex-col md:gap-2">
        <div className="mx-1 hidden h-8 w-px bg-gradient-to-b from-transparent via-mist/30 to-transparent md:mx-0 md:block" />
        <motion.button
          type="button"
          title="Sign out"
          aria-label="Sign out"
          onClick={handleLogout}
          className="flex h-11 w-11 items-center justify-center rounded-2xl text-mist transition hover:bg-red-950/30 hover:text-red-300"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={SPRING_TRANSITION}
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.6} />
        </motion.button>
      </div>
    </motion.nav>
  );
}
