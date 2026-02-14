"use client";

import { Trash2, Download, ArrowUpDown, FileText, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SortMode = "newest" | "oldest" | "important";

interface NotesToolbarProps {
  onDeleteAll: () => void;
  onExport: (format: "txt" | "json") => void;
  sortMode: SortMode;
  onSortChange: (mode: SortMode) => void;
  noteCount: number;
}

export function NotesToolbar({
  onDeleteAll,
  onExport,
  sortMode,
  onSortChange,
  noteCount,
}: NotesToolbarProps) {
  function cycleSortMode() {
    const modes: SortMode[] = ["newest", "oldest", "important"];
    const currentIndex = modes.indexOf(sortMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onSortChange(modes[nextIndex]);
  }

  const sortLabel =
    sortMode === "newest"
      ? "Newest first"
      : sortMode === "oldest"
      ? "Oldest first"
      : "Important first";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={cycleSortMode}
              className="h-9 rounded-lg border-border bg-card text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
              {sortLabel}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-popover-foreground">
            <p>Cycle sort order</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport("txt")}
              disabled={noteCount === 0}
              className="h-9 rounded-lg border-border bg-card text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              .txt
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-popover-foreground">
            <p>Export as text file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport("json")}
              disabled={noteCount === 0}
              className="h-9 rounded-lg border-border bg-card text-xs font-medium text-secondary-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:border-primary/30 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              <FileJson className="mr-1.5 h-3.5 w-3.5" />
              .json
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-popover-foreground">
            <p>Export as JSON file</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteAll}
              disabled={noteCount === 0}
              className="h-9 rounded-lg border-destructive/30 bg-destructive/10 text-xs font-medium text-destructive transition-all duration-200 hover:bg-destructive/20 hover:border-destructive/50 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete All
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-popover-foreground">
            <p>Delete all notes permanently</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
