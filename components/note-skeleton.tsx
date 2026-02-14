"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NoteSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Skeleton className="mb-3 h-4 w-4/5 bg-muted" />
      <Skeleton className="mb-2 h-4 w-3/5 bg-muted" />
      <Skeleton className="mb-2 h-4 w-2/5 bg-muted" />
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <Skeleton className="h-3 w-20 bg-muted" />
        <div className="flex gap-1">
          <Skeleton className="h-6 w-6 rounded-md bg-muted" />
          <Skeleton className="h-6 w-6 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function NoteSkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <NoteSkeleton key={i} />
      ))}
    </div>
  );
}
