"use client";

import { StickyNote } from "lucide-react";

interface NotesEmptyProps {
  hasSearch: boolean;
}

export function NotesEmpty({ hasSearch }: NotesEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
        <StickyNote className="h-8 w-8 text-primary" />
      </div>
      {hasSearch ? (
        <>
          <h3 className="text-lg font-semibold text-foreground">
            No matching notes
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Try adjusting your search query to find what you are looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-foreground">
            No notes yet
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Write your first note above and it will appear here instantly,
            synced to the cloud in real time.
          </p>
        </>
      )}
    </div>
  );
}
