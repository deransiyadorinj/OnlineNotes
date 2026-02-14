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
            size="lg"
            disabled={isLoading || text.trim() === ""}
            className="bg-gradient-to-r from-primary via-[hsl(275,80%,58%)] to-accent text-white font-bold text-sm px-6 shadow-[0_0_20px_hsl(330,85%,60%,0.35),0_0_40px_hsl(220,91%,60%,0.2)] ring-1 ring-accent/30 transition-all duration-300 hover:shadow-[0_0_28px_hsl(330,85%,60%,0.5),0_0_56px_hsl(220,91%,60%,0.3)] hover:scale-[1.05] hover:brightness-110 active:scale-[0.97] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:brightness-100"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
            )}
            Create Note
          </Button>
        </div>
      </div>
    </form>
  );
}
