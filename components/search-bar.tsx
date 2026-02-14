"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary" />
      <Input
        type="text"
        placeholder="Search your notes..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border-border bg-card pl-10 pr-10 text-sm text-card-foreground placeholder:text-muted-foreground transition-all duration-300 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/40 focus-visible:shadow-md focus-visible:shadow-primary/10 hover:border-muted-foreground/30"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2 rounded-lg text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-secondary"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
