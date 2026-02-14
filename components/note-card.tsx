"use client";

import { useState, useRef, useEffect } from "react";
import { Pin, Star, Pencil, Trash2, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Note } from "@/lib/firebase";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onTogglePin: (id: string, pinned: boolean) => void;
  onToggleImportant: (id: string, important: boolean) => void;
  isRemoving?: boolean;
}

export function NoteCard({
  note,
  onDelete,
  onUpdate,
  onTogglePin,
  onToggleImportant,
  isRemoving,
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  function handleSave() {
    if (editText.trim() === "") return;
    onUpdate(note.id, editText.trim());
    setIsEditing(false);
  }

  function handleCancel() {
    setEditText(note.text);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  const createdAt = note.createdAt
    ? new Date(note.createdAt.seconds * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  return (
    <div
      className={`group relative flex flex-col rounded-xl border transition-all duration-300 ${
        isRemoving ? "animate-note-out" : "animate-note-in"
      } ${
        note.important
          ? "border-accent/30 bg-accent/5 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
          : "border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
      } ${
        note.pinned ? "ring-1 ring-primary/25" : ""
      }`}
      onDoubleClick={() => {
        if (!isEditing) setIsEditing(true);
      }}
    >
      {/* Pinned badge */}
      {note.pinned && (
        <div className="absolute -top-2.5 right-4 z-10">
          <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md shadow-primary/25">
            <Pin className="h-2.5 w-2.5" />
            Pinned
          </div>
        </div>
      )}

      {/* Important indicator bar */}
      {note.important && (
        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-accent" />
      )}

      <div className="flex flex-1 flex-col p-4">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <Textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] resize-none border-border bg-secondary text-sm leading-relaxed text-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="flex gap-2 self-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 px-3 text-xs text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground hover:scale-[1.02]"
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={editText.trim() === ""}
                className="h-8 bg-primary px-3 text-xs text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
              {note.text}
            </p>

            {/* Footer: Timestamp + Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {createdAt}
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                          note.pinned
                            ? "bg-primary/15 text-primary hover:bg-primary/25"
                            : "text-muted-foreground hover:bg-secondary hover:text-primary"
                        }`}
                        onClick={() => onTogglePin(note.id, !note.pinned)}
                        aria-label={note.pinned ? "Unpin note" : "Pin note"}
                      >
                        <Pin
                          className={`h-3.5 w-3.5 ${
                            note.pinned ? "fill-primary" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-popover text-popover-foreground"
                    >
                      <p>{note.pinned ? "Unpin" : "Pin to top"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-7 w-7 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                          note.important
                            ? "bg-accent/15 text-accent hover:bg-accent/25"
                            : "text-muted-foreground hover:bg-secondary hover:text-accent"
                        }`}
                        onClick={() =>
                          onToggleImportant(note.id, !note.important)
                        }
                        aria-label={
                          note.important
                            ? "Remove importance"
                            : "Mark important"
                        }
                      >
                        <Star
                          className={`h-3.5 w-3.5 ${
                            note.important ? "fill-accent" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-popover text-popover-foreground"
                    >
                      <p>
                        {note.important
                          ? "Remove importance"
                          : "Mark important"}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-secondary hover:text-foreground active:scale-95"
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit note"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-popover text-popover-foreground"
                    >
                      <p>Edit note</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-destructive/15 hover:text-destructive active:scale-95"
                        onClick={() => onDelete(note.id)}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-popover text-popover-foreground"
                    >
                      <p>Delete note</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
