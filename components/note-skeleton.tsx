"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NoteSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="mb-2 h-4 w-3/4 bg-muted" />
      <Skeleton className="mb-2 h-4 w-1/2 bg-muted" />
      <Skeleton className="mt-3 h-3 w-1/4 bg-muted" />
    </div>
  );
}

export function NoteSkeletonGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <NoteSkeleton key={i} />
      ))}
    </div>
  );
}
