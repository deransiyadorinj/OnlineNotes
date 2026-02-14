"use client";

import { useState, useRef, useEffect } from "react";
import {
  Pin,
  Star,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
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
      className={`group relative rounded-xl border transition-all duration-300 ${
        isRemoving ? "animate-note-out" : "animate-note-in"
      } ${
        note.important
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-border bg-card"
      } ${
        note.pinned ? "ring-1 ring-primary/20" : ""
      } hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5`}
      onDoubleClick={() => {
        if (!isEditing) {
          setIsEditing(true);
        }
      }}
    >
      {note.pinned && (
        <div className="absolute -top-2 right-4">
          <div className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            Pinned
          </div>
        </div>
      )}

      <div className="p-4">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] resize-none bg-secondary text-sm text-foreground focus-visible:ring-1 focus-visible:ring-primary"
            />
            <div className="flex gap-1.5 self-end">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={editText.trim() === ""}
                className="h-7 bg-primary px-2 text-xs text-primary-foreground hover:bg-primary/90"
              >
                <Check className="mr-1 h-3 w-3" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
              {note.text}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {createdAt}
              </span>
              <div className="flex items-center gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={() => onTogglePin(note.id, !note.pinned)}
                        aria-label={note.pinned ? "Unpin note" : "Pin note"}
                      >
                        <Pin
                          className={`h-3.5 w-3.5 ${
                            note.pinned ? "fill-primary text-primary" : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>{note.pinned ? "Unpin" : "Pin to top"}</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-amber-400"
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
                            note.important
                              ? "fill-amber-400 text-amber-400"
                              : ""
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>
                        {note.important ? "Remove importance" : "Mark important"}
                      </p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit note"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
                      <p>Edit note</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(note.id)}
                        aria-label="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-popover text-popover-foreground">
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
