"use client";

import AppShell from "@/components/AppShell";
import { Skeleton, SkeletonCircle, SkeletonLine } from "@/components/ui/Skeleton";

function HudSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="surface-sm flex h-[108px] items-center gap-3.5 p-3.5 sm:h-[116px] sm:p-4">
          <SkeletonCircle size={56} className="shrink-0" />
          <div className="flex w-full flex-col gap-2">
            <SkeletonLine width="40%" />
            <SkeletonLine width="70%" className="h-4" />
            <SkeletonLine width="55%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConsoleSkeleton() {
  return (
    <AppShell>
      <HudSkeleton />
      <div className="grid flex-1 grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-[minmax(300px,380px)_minmax(0,1fr)]">
        <div className="surface flex min-h-[420px] flex-col gap-4 p-4 sm:p-6">
          <SkeletonLine width="30%" />
          <SkeletonLine width="75%" className="h-7" />
          <SkeletonLine width="55%" />
          <Skeleton className="mt-2 h-36 w-full rounded-2xl" />
          <div className="mt-auto space-y-2 pt-4">
            <SkeletonLine width="35%" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="surface p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-2">
                <SkeletonLine width="90px" />
                <SkeletonLine width="160px" className="h-6" />
              </div>
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <Skeleton className="absolute left-0 top-0 h-[76px] w-[42%] max-w-[160px] rounded-2xl" />
              <Skeleton className="absolute right-0 top-0 h-[76px] w-[42%] max-w-[160px] rounded-2xl" />
              <Skeleton className="absolute bottom-0 left-0 h-[76px] w-[42%] max-w-[160px] rounded-2xl" />
              <Skeleton className="absolute bottom-0 right-0 h-[76px] w-[42%] max-w-[160px] rounded-2xl" />
              <SkeletonCircle
                size={96}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="surface min-h-[240px] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="space-y-2">
                <SkeletonLine width="80px" />
                <SkeletonLine width="120px" className="h-5" />
              </div>
              <Skeleton className="h-6 w-24 rounded-lg" />
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function LeadsSkeleton() {
  return (
    <AppShell>
      <div className="space-y-2">
        <SkeletonLine width="110px" />
        <SkeletonLine width="220px" className="h-7" />
        <SkeletonLine width="70%" className="max-w-md" />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="surface-sm p-3.5 sm:p-4">
            <SkeletonLine width="45%" className="mb-2" />
            <SkeletonLine width="60%" className="h-6" />
            <SkeletonLine width="50%" className="mt-2" />
          </div>
        ))}
      </div>

      <div className="surface flex flex-col gap-3 p-3 sm:flex-row sm:p-4">
        <Skeleton className="h-10 flex-1 rounded-xl" />
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-lg" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="surface-sm flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:p-4"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="w-full space-y-2">
                <SkeletonLine width="45%" className="h-4" />
                <SkeletonLine width="65%" />
                <SkeletonLine width="80%" className="hidden sm:block" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:flex sm:gap-5">
              <SkeletonLine width="48px" />
              <SkeletonLine width="64px" />
              <SkeletonLine width="52px" />
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

export function LeadDetailSkeleton() {
  return (
    <AppShell>
      <div className="flex items-center gap-2">
        <SkeletonLine width="48px" />
        <SkeletonLine width="12px" />
        <SkeletonLine width="140px" />
      </div>

      <div className="surface p-4 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-2xl sm:h-16 sm:w-16" />
            <div className="w-full max-w-md space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-14 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-lg" />
              </div>
              <SkeletonLine width="70%" className="h-7" />
              <SkeletonLine width="55%" />
            </div>
          </div>
          <Skeleton className="h-24 w-full max-w-[220px] rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="surface-sm p-3.5">
            <SkeletonLine width="40%" className="mb-2" />
            <SkeletonLine width="70%" className="h-5" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3.5">
          <div className="surface space-y-4 p-4 sm:p-6">
            <SkeletonLine width="120px" />
            <SkeletonLine width="200px" className="h-6" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </div>
          </div>
          <div className="surface space-y-4 p-4 sm:p-6">
            <SkeletonLine width="140px" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <SkeletonLine width="50%" />
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3.5">
          <div className="surface space-y-3 p-4 sm:p-5">
            <SkeletonLine width="100px" />
            <div className="flex gap-3">
              <SkeletonCircle size={44} />
              <div className="w-full space-y-2">
                <SkeletonLine width="60%" />
                <SkeletonLine width="40%" />
              </div>
            </div>
            <SkeletonLine width="80%" />
            <SkeletonLine width="70%" />
          </div>
          <div className="surface space-y-3 p-4 sm:p-5">
            <SkeletonLine width="90px" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-3">
                <SkeletonLine width="35%" />
                <SkeletonLine width="40%" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function DeskSkeleton() {
  return (
    <AppShell>
      <div className="space-y-2">
        <SkeletonLine width="100px" />
        <SkeletonLine width="240px" className="h-7" />
        <SkeletonLine width="75%" className="max-w-xl" />
      </div>

      <div className="surface space-y-4 p-4 sm:p-6">
        <div className="flex justify-between gap-4">
          <div className="w-full max-w-md space-y-2">
            <SkeletonLine width="120px" />
            <SkeletonLine width="180px" className="h-6" />
            <SkeletonLine width="90%" />
          </div>
          <SkeletonLine width="100px" className="h-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="surface-sm p-3.5">
              <SkeletonLine width="50%" className="mb-2" />
              <SkeletonLine width="65%" className="h-5" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="surface space-y-3 p-4 sm:p-6">
          <SkeletonLine width="90px" />
          <SkeletonLine width="160px" className="h-6" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-xl" />
          ))}
        </div>
        <div className="space-y-3.5">
          <div className="surface space-y-3 p-4 sm:p-5">
            <SkeletonLine width="110px" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <div className="surface space-y-3 p-4 sm:p-5">
            <SkeletonLine width="100px" />
            <div className="grid grid-cols-2 gap-2.5">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
