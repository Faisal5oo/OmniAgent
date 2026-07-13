"use client";

import AmbientCanvas from "./AmbientCanvas";
import DockNav from "./DockNav";
import { PageReveal } from "./motion/primitives";

/**
 * Shared responsive shell — ambient canvas + dock + content frame.
 * Used by Console, Leads list, and Lead detail routes.
 */
export default function AppShell({ children, isStreaming = false }) {
  return (
    <div className="relative min-h-dvh text-[#eef2f7]">
      <AmbientCanvas isStreaming={isStreaming} />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1680px] flex-col gap-3 p-3 sm:gap-3.5 sm:p-3.5 md:flex-row md:items-stretch md:gap-4 md:p-5">
        <DockNav />
        <main className="flex min-w-0 flex-1 flex-col gap-3 pb-20 sm:gap-4 md:pb-0">
          <PageReveal className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
            {children}
          </PageReveal>
        </main>
      </div>
    </div>
  );
}
