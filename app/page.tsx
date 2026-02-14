"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import {
  db,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
  type Note,
} from "@/lib/firebase";
import { AppHeader } from "@/components/app-header";
import { SearchBar } from "@/components/search-bar";
import { NoteInput } from "@/components/note-input";
import { NoteCard } from "@/components/note-card";
import { NotesToolbar } from "@/components/notes-toolbar";
import { NoteSkeletonGrid } from "@/components/note-skeleton";
import { NotesEmpty } from "@/components/notes-empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type SortMode = "newest" | "oldest" | "important";

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [addingNote, setAddingNote] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notesData: Note[] = snapshot.docs.map((d) => ({
          id: d.id,
          text: d.data().text || "",
          pinned: d.data().pinned || false,
          important: d.data().important || false,
          createdAt: d.data().createdAt || null,
        }));
        setNotes(notesData);
        setLoading(false);
        setIsConnected(true);
      },
      (error) => {
        console.error("Firestore error:", error);
        setIsConnected(false);
        setLoading(false);
        toast.error("Connection lost. Retrying...");
      }
    );

    return () => unsubscribe();
  }, []);

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = notes.filter((n) => n.text.toLowerCase().includes(q));
    }

    const sorted = [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (sortMode === "important") {
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;
      }

      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;

      if (sortMode === "oldest") return aTime - bTime;
      return bTime - aTime;
    });

    return sorted;
  }, [notes, search, sortMode]);

  const handleAddNote = useCallback(async (text: string) => {
    setAddingNote(true);
    try {
      await addDoc(collection(db, "notes"), {
        text,
        pinned: false,
        important: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Note created successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to create note");
    } finally {
      setAddingNote(false);
    }
  }, []);

  const handleDeleteNote = useCallback(async (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));

    setTimeout(async () => {
      try {
        await deleteDoc(doc(db, "notes", id));
        toast.success("Note deleted");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note");
      } finally {
        setRemovingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }, 250);
  }, []);

  const handleDeleteAll = useCallback(async () => {
    try {
      const batch = writeBatch(db);
      notes.forEach((note) => {
        batch.delete(doc(db, "notes", note.id));
      });
      await batch.commit();
      toast.success(`Deleted ${notes.length} notes`);
    } catch (error) {
      console.error("Error deleting all notes:", error);
      toast.error("Failed to delete all notes");
    }
    setShowDeleteAllDialog(false);
  }, [notes]);

  const handleUpdateNote = useCallback(async (id: string, text: string) => {
    try {
      await updateDoc(doc(db, "notes", id), { text });
      toast.success("Note updated");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note");
    }
  }, []);

  const handleTogglePin = useCallback(async (id: string, pinned: boolean) => {
    try {
      await updateDoc(doc(db, "notes", id), { pinned });
      toast.success(pinned ? "Note pinned" : "Note unpinned");
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to update note");
    }
  }, []);

  const handleToggleImportant = useCallback(
    async (id: string, important: boolean) => {
      try {
        await updateDoc(doc(db, "notes", id), { important });
        toast.success(
          important ? "Marked as important" : "Removed importance"
        );
      } catch (error) {
        console.error("Error toggling importance:", error);
        toast.error("Failed to update note");
      }
    },
    []
  );

  function handleExport(format: "txt" | "json") {
    if (notes.length === 0) return;

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "txt") {
      content = notes
        .map(
          (n, i) =>
            `${i + 1}. ${n.text}${n.pinned ? " [PINNED]" : ""}${
              n.important ? " [IMPORTANT]" : ""
            }`
        )
        .join("\n\n");
      filename = "online-notes.txt";
      mimeType = "text/plain";
    } else {
      content = JSON.stringify(
        notes.map((n) => ({
          text: n.text,
          pinned: n.pinned,
          important: n.important,
          createdAt: n.createdAt
            ? new Date(n.createdAt.seconds * 1000).toISOString()
            : null,
        })),
        null,
        2
      );
      filename = "online-notes.json";
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <AppHeader noteCount={notes.length} isConnected={isConnected} />

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Create Note Section */}
        <section aria-label="Create a new note">
          <NoteInput onAdd={handleAddNote} isLoading={addingNote} />
        </section>

        {/* Search & Toolbar */}
        <div className="flex flex-col gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <NotesToolbar
            onDeleteAll={() => setShowDeleteAllDialog(true)}
            onExport={handleExport}
            sortMode={sortMode}
            onSortChange={setSortMode}
            noteCount={notes.length}
          />
        </div>

        {/* Notes Grid */}
        <section aria-label="Your notes" aria-live="polite" className="flex-1">
          {loading ? (
            <NoteSkeletonGrid />
          ) : filteredAndSortedNotes.length === 0 ? (
            <NotesEmpty hasSearch={search.trim().length > 0} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAndSortedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onUpdate={handleUpdateNote}
                  onTogglePin={handleTogglePin}
                  onToggleImportant={handleToggleImportant}
                  isRemoving={removingIds.has(note.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            {"Online Notes \u2014 Real-time cloud notes powered by Firebase"}
          </p>
        </div>
      </footer>

      {/* Delete All Confirmation */}
      <AlertDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
      >
        <AlertDialogContent className="border-border bg-card text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete all notes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will permanently delete all {notes.length} notes. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-secondary text-secondary-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:scale-[1.03] active:scale-[0.97]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="bg-destructive text-destructive-foreground font-semibold shadow-md shadow-destructive/25 transition-all duration-200 hover:bg-destructive/90 hover:shadow-lg hover:shadow-destructive/40 hover:scale-[1.03] hover:brightness-110 active:scale-[0.97]"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
