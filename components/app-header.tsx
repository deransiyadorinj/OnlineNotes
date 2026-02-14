"use client";

import { BookOpen, WifiOff, Cloud } from "lucide-react";

interface AppHeaderProps {
  noteCount: number;
  isConnected: boolean;
}

export function AppHeader({ noteCount, isConnected }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 glass border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20 transition-all duration-300 hover:bg-primary/25 hover:ring-primary/40 hover:scale-105">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Online Notes
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Cloud Synced
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground ring-1 ring-border transition-colors duration-200 hover:bg-secondary/80">
            {noteCount} {noteCount === 1 ? "note" : "notes"}
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
              isConnected
                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                : "bg-destructive/10 text-destructive ring-1 ring-destructive/20"
            }`}
          >
            {isConnected ? (
              <>
                <Cloud className="h-3 w-3" />
                <span>Synced</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" />
                <span>Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
