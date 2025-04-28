
import React, { useState } from "react";
import { Plus, Search, Folder, X, Save, Bold, Italic, Heading1, List } from "lucide-react";
import clsx from "clsx";
import "./index.css";

const MOCK_NOTES = [
  {
    id: "1",
    title: "Welcome to Your Creative Notes",
    content: "This is a **Notion-inspired** note. Try editing me!",
    tags: ["Getting Started"],
  },
  {
    id: "2",
    title: "Ideas for Next Project",
    content: "- Build a personal website\n- Start a blog\n- Learn TypeScript",
    tags: ["Ideas"],
  },
];

const MOCK_TAGS = ["All", "Getting Started", "Ideas", "Work", "Personal"];

function formatContent(content: string) {
  // Simple markdown-like formatting for bold, italic, headings, and lists
  let lines = content.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-2xl font-bold mb-2">
          {line.replace("# ", "")}
        </h1>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={idx} className="ml-4 list-disc">
          {line.replace("- ", "")}
        </li>
      );
    }
    let formatted = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");
    return (
      <div
        key={idx}
        className="mb-1"
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  });
}

function NoteCard({ note, onClick }: { note: any; onClick: () => void }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border border-transparent hover:border-indigo-200"
      onClick={onClick}
    >
      <div className="font-semibold text-lg mb-1 truncate">{note.title}</div>
      <div className="text-gray-500 text-sm line-clamp-2 min-h-[2.5em]">
        {note.content.length > 60
          ? note.content.slice(0, 60) + "..."
          : note.content}
      </div>
      <div className="flex gap-2 mt-2">
        {note.tags.map((tag: string) => (
          <span
            key={tag}
            className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function Sidebar({
  tags,
  selectedTag,
  onSelectTag,
}: {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}) {
  return (
    <aside className="w-48 min-w-[160px] bg-white/80 backdrop-blur-md border-r border-gray-100 h-full py-6 px-4 hidden md:block">
      <div className="flex items-center gap-2 mb-6 font-bold text-indigo-700 text-xl">
        <Folder className="w-5 h-5" />
        Folders
      </div>
      <ul className="space-y-2">
        {tags.map((tag) => (
          <li key={tag}>
            <button
              className={clsx(
                "w-full text-left px-3 py-2 rounded-lg transition-colors",
                selectedTag === tag
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "hover:bg-indigo-50 text-gray-700"
              )}
              onClick={() => onSelectTag(tag)}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function NoteEditorModal({
  open,
  onClose,
  onSave,
  note,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (note: any) => void;
  note: any;
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags || []);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");

  React.useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setTags(note?.tags || []);
  }, [note, open]);

  function handleFormat(type: string) {
    if (type === "bold") {
      setContent((c) => c + "**bold text**");
    } else if (type === "italic") {
      setContent((c) => c + "*italic text*");
    } else if (type === "heading") {
      setContent((c) => c + "\n# Heading");
    } else if (type === "list") {
      setContent((c) => c + "\n- List item");
    }
  }

  function handleAddTag() {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
      setShowTagInput(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 relative animate-slideUp">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-indigo-500 transition-colors"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="mb-4">
          <input
            className="w-full text-2xl font-bold outline-none border-b border-gray-200 focus:border-indigo-400 transition-colors py-2 mb-2"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
          />
          <div className="flex gap-2 mb-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            <button
              className="text-xs text-indigo-500 hover:underline"
              onClick={() => setShowTagInput((v) => !v)}
            >
              + Tag
            </button>
            {showTagInput && (
              <span className="flex gap-1 items-center">
                <input
                  className="border rounded px-1 text-xs"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag();
                  }}
                  autoFocus
                  placeholder="New tag"
                />
                <button
                  className="text-indigo-500 text-xs"
                  onClick={handleAddTag}
                >
                  Add
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <button
            className="p-1 rounded hover:bg-indigo-50"
            title="Bold"
            onClick={() => handleFormat("bold")}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded hover:bg-indigo-50"
            title="Italic"
            onClick={() => handleFormat("italic")}
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded hover:bg-indigo-50"
            title="Heading"
            onClick={() => handleFormat("heading")}
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            className="p-1 rounded hover:bg-indigo-50"
            title="List"
            onClick={() => handleFormat("list")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
        <textarea
          className="w-full min-h-[120px] max-h-60 border border-gray-200 rounded-lg p-3 outline-none focus:border-indigo-400 transition-colors font-mono text-base resize-vertical"
          placeholder="Start writing your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end mt-4 gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center gap-1"
            onClick={() => {
              onSave({
                ...note,
                title: title || "Untitled",
                content,
                tags: tags.length ? tags : ["All"],
              });
              onClose();
            }}
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState(MOCK_NOTES);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredNotes = notes.filter((note) => {
    const matchesTag =
      selectedTag === "All" || note.tags.includes(selectedTag);
    const matchesSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  function handleOpenEditor(note?: any) {
    setSelectedNote(note || { title: "", content: "", tags: [] });
    setEditorOpen(true);
  }

  function handleSaveNote(note: any) {
    if (note.id) {
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...note } : n))
      );
    } else {
      setNotes((prev) => [
        {
          ...note,
          id: Date.now().toString(),
        },
        ...prev,
      ]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 font-sans flex">
      <Sidebar
        tags={MOCK_TAGS}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />
      <main className="flex-1 flex flex-col px-4 md:px-12 py-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-indigo-700 tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                Creative Notes
              </span>
            </span>
            <button
              className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition flex items-center gap-1"
              onClick={() => handleOpenEditor()}
            >
              <Plus className="w-4 h-4" />
              New Note
            </button>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow border border-gray-100 w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              className="flex-1 outline-none bg-transparent text-gray-700"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>
        <section className="flex-1">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg
                width="64"
                height="64"
                fill="none"
                viewBox="0 0 24 24"
                className="mb-4"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  fill="#f3f4f6"
                  stroke="#c7d2fe"
                  strokeWidth="1.5"
                />
                <rect
                  x="7"
                  y="9"
                  width="10"
                  height="2"
                  rx="1"
                  fill="#c7d2fe"
                />
                <rect
                  x="7"
                  y="13"
                  width="6"
                  height="2"
                  rx="1"
                  fill="#c7d2fe"
                />
              </svg>
              <div className="text-lg font-medium mb-2">No notes found</div>
              <div className="text-sm">
                Click <span className="font-semibold text-indigo-500">New Note</span> to get started!
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => handleOpenEditor(note)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <NoteEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveNote}
        note={selectedNote}
      />
    </div>
  );
}

export default App;