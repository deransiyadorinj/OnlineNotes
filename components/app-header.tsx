"use client";

import { StickyNote, Wifi } from "lucide-react";

interface AppHeaderProps {
  noteCount: number;
  isConnected: boolean;
}

export function AppHeader({ noteCount, isConnected }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <StickyNote className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            NoteVault
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time cloud notes
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </span>
        <div className="flex items-center gap-1.5">
          <Wifi
            className={`h-3.5 w-3.5 ${
              isConnected ? "text-emerald-400" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-xs ${
              isConnected ? "text-emerald-400" : "text-muted-foreground"
            }`}
          >
            {isConnected ? "Synced" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}
