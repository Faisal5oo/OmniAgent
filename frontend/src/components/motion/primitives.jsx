"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { EASE_OUT, SPRING_TRANSITION } from "@/lib/constants";

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

export function PageReveal({ children, className = "" }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      className={className}
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function MotionPress({
  children,
  className = "",
  hoverY = -3,
  hoverScale = 1.01,
  tapScale = 0.985,
  as = "div",
  ...rest
}) {
  const Comp = motion[as] || motion.div;

  return (
    <Comp
      className={`will-change-transform ${className}`}
      whileHover={{ y: hoverY, scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      transition={SPRING_TRANSITION}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export function MagneticIcon({ children, className = "" }) {
  return (
    <motion.span
      className={`inline-flex ${className}`}
      whileHover={{ scale: 1.12, rotate: -4 }}
      whileTap={{ scale: 0.9, rotate: 0 }}
      transition={SPRING_TRANSITION}
    >
      {children}
    </motion.span>
  );
}
