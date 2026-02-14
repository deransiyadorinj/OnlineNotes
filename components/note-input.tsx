"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NoteInputProps {
  onAdd: (text: string) => void;
  isLoading: boolean;
}

export function NoteInput({ onAdd, isLoading }: NoteInputProps) {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim() === "") return;
    onAdd(text.trim());
    setText("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div
        className={`relative rounded-xl border transition-all duration-300 ${
          isFocused
            ? "border-primary/40 shadow-lg shadow-primary/10 ring-1 ring-primary/25"
            : "border-border hover:border-muted-foreground/30"
        }`}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What's on your mind? Write a note..."
          className="min-h-[120px] resize-none border-0 bg-card text-sm leading-relaxed text-card-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label="Note text"
        />
        <div className="flex items-center justify-between border-t border-border/50 px-4 py-2.5">
          <span className="text-[11px] text-muted-foreground">
            {"Ctrl + Enter to save"}
          </span>
          <Button
            type="submit"
            disabled={isLoading || text.trim() === ""}
            className="bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100 disabled:hover:brightness-100"
          >
            {isLoading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-1.5 h-4 w-4" />
            )}
            Create Note
          </Button>
        </div>
      </div>
    </form>
  );
}
