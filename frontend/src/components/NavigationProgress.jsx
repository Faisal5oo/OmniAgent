"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ConsoleSkeleton,
  DeskSkeleton,
  LeadDetailSkeleton,
  LeadsSkeleton,
} from "@/components/PageSkeletons";

function skeletonForPath(path) {
  if (!path) return null;
  const base = path.split("?")[0];
  if (base.startsWith("/leads/") && base !== "/leads") {
    return <LeadDetailSkeleton />;
  }
  if (base === "/leads") return <LeadsSkeleton />;
  if (base === "/desk" || base.startsWith("/desk/")) return <DeskSkeleton />;
  return <ConsoleSkeleton />;
}

/**
 * Top progress bar + instant skeleton veil on internal navigations
 * (lead clicks, dock links) so the app never feels stalled.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [barVisible, setBarVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const [pendingPath, setPendingPath] = useState(null);
  const timers = useRef([]);
  const pathnameRef = useRef(pathname);
  const isFirst = useRef(true);

  pathnameRef.current = pathname;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const startBar = useCallback(() => {
    clearTimers();
    setBarVisible(true);
    setWidth(18);
    timers.current.push(setTimeout(() => setWidth(52), 50));
    timers.current.push(setTimeout(() => setWidth(76), 180));
    timers.current.push(setTimeout(() => setWidth(90), 360));
  }, []);

  const finish = useCallback(() => {
    setWidth(100);
    timers.current.push(
      setTimeout(() => {
        setBarVisible(false);
        setWidth(0);
        setPendingPath(null);
      }, 180)
    );
  }, []);

  // When route lands, clear pending overlay
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return undefined;
    }

    if (pendingPath) {
      const pendingBase = pendingPath.split("?")[0];
      if (pathname === pendingBase) {
        finish();
      }
    }

    return clearTimers;
  }, [pathname, pendingPath, finish]);

  // Intercept internal link clicks for instant skeleton
  useEffect(() => {
    const onClick = (e) => {
      const anchor = e.target.closest("a[href]");
      if (!anchor) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return;
      }

      const nextPath = href.split("?")[0];
      if (nextPath === pathnameRef.current) return;
      if (nextPath === "/login") return;

      setPendingPath(href);
      startBar();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [startBar]);

  // Safety timeout so overlay never sticks
  useEffect(() => {
    if (!pendingPath) return undefined;
    const t = setTimeout(() => finish(), 2200);
    return () => clearTimeout(t);
  }, [pendingPath, finish]);

  return (
    <>
      {(barVisible || width > 0) && (
        <div
          className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] overflow-hidden"
          aria-hidden
        >
          <div
            className="h-full origin-left rounded-r-full transition-[width] duration-300 ease-out"
            style={{
              width: `${width}%`,
              background:
                "linear-gradient(90deg, transparent, #3dffa8 25%, #e8b86d 100%)",
              boxShadow: "0 0 14px rgba(61,255,168,0.55)",
              opacity: barVisible ? 1 : 0,
            }}
          />
        </div>
      )}

      {pendingPath && (
        <div
          className="fixed inset-0 z-[90] overflow-y-auto bg-[#050607]"
          style={{ animation: "route-veil-in 0.12s ease-out" }}
          aria-busy="true"
          aria-live="polite"
        >
          {skeletonForPath(pendingPath)}
        </div>
      )}
    </>
  );
}
