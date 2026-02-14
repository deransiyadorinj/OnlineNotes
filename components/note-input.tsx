"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface NoteInputProps {
  onAdd: (text: string) => void;
  isLoading: boolean;
}

export function NoteInput({ onAdd, isLoading }: NoteInputProps) {
  const [text, setText] = useState("");

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
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your note here..."
          className="min-h-[100px] resize-none bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
          aria-label="Note text"
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
          {"Ctrl + Enter to save"}
        </span>
      </div>
      <Button
        type="submit"
        disabled={isLoading || text.trim() === ""}
        className="self-end bg-primary text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add Note
      </Button>
    </form>
  );
}
