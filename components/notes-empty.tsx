"use client";

import { BookOpen, SearchX } from "lucide-react";

interface NotesEmptyProps {
  hasSearch: boolean;
}

export function NotesEmpty({ hasSearch }: NotesEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 animate-float">
        {hasSearch ? (
          <SearchX className="h-10 w-10 text-primary/60" />
        ) : (
          <BookOpen className="h-10 w-10 text-primary/60" />
        )}
      </div>
      {hasSearch ? (
        <>
          <h3 className="text-lg font-semibold text-foreground">
            No matching notes
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Try adjusting your search query to find what you are looking for.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-foreground">
            No notes yet
          </h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Create your first note above. All notes are synced to the cloud in
            real time.
          </p>
        </>
      )}
    </div>
  );
}
