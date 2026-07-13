"use client";

export function Skeleton({ className = "", style }) {
  return (
    <div
      className={`skeleton-bone ${className}`}
      style={style}
      aria-hidden
    />
  );
}

export function SkeletonCircle({ size = 40, className = "" }) {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonLine({ width = "100%", className = "" }) {
  return (
    <Skeleton
      className={`h-3 rounded-md ${className}`}
      style={{ width }}
    />
  );
}
