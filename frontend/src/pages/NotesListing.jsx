import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, FileText, Download, MoreVertical, Plus, ChevronDown, Check, Paperclip } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { FocusedEditor } from "../components/ui/FocusedEditor";
import { EditorToolbar } from "../components/ui/EditorToolbar";
import { useAuth } from "../context/AuthContext";
import { noteService } from "../services/note.service";
import { classService } from "../services/class.service";
import { Alert } from "../components/ui/Alert";
import { AnimatePresence } from "framer-motion";

export default function NotesListing() {
    const { user } = useAuth();
    const isFaculty = user?.role?.toLowerCase() === "faculty";
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    // Real Data State
    const [notes, setNotes] = useState([]);
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // New Note State
    const [currentNote, setCurrentNote] = useState(null);
    const [noteTitle, setNoteTitle] = useState("");
    const [selectedClassId, setSelectedClassId] = useState(null); // null means Personal Note
    const [visibility, setVisibility] = useState("personal");
    const [collaborationMode, setCollaborationMode] = useState("readonly");
    const [attachmentFile, setAttachmentFile] = useState(null);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
    const [alert, setAlert] = useState(null);

    const getAttachmentUrl = (note) => {
        if (!note?.attachment_url) return null;
        const apiBase = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api/v1";
        const backendBase = apiBase.replace(/\/api\/v1$/, "");
        return `${backendBase}${note.attachment_url}`;
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setIsLoading(true);
        try {
            const [notesData, classesData] = await Promise.all([
                noteService.getNotes(),
                classService.getMyClasses()
            ]);
            setNotes(notesData);
            setClasses(classesData);
        } catch (error) {
            console.error("Failed to fetch notes/classes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = async () => {
        if (!noteTitle.trim()) {
            setAlert({ message: "Academic Document Title is required", type: "error" });
            setTimeout(() => setAlert(null), 4000);
            return;
        }
        const content = editorRef.current?.innerHTML || "";
        const isPlaceholder = content === "<p>Start drafting your high-fidelity academic notes here...</p>";
        if ((!content.trim() || isPlaceholder) && !attachmentFile && !currentNote?.attachment_url) {
            setAlert({ message: "Add note content or attach a file", type: "error" });
            setTimeout(() => setAlert(null), 4000);
            return;
        }

        setIsSaving(true);
        try {
            const payload = new FormData();
            payload.append("title", noteTitle);
            payload.append("content", isPlaceholder ? "" : content);
            payload.append("class_id", selectedClassId || "");
            payload.append("visibility", visibility);
            payload.append("collaboration_mode", collaborationMode);

            if (attachmentFile) {
                payload.append("attachment", attachmentFile);
            }

            if (currentNote) {
                await noteService.updateNote(currentNote._id, payload);
            } else {
                await noteService.createNote(payload);
            }

            setIsEditorOpen(false);
            setNoteTitle("");
            setCurrentNote(null);
            setSelectedClassId(null);
            setVisibility("personal");
            setCollaborationMode("readonly");
            setAttachmentFile(null);
            fetchInitialData(); // Refresh list
        } catch (error) {
            console.error("Failed to publish/update note:", error);
            setAlert({
                message: error.response?.data?.message || "Protocol Failure: Failed to sync note",
                type: "error"
            });
            setTimeout(() => setAlert(null), 5000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenNote = (note) => {
        setCurrentNote(note);
        setNoteTitle(note.title);
        setSelectedClassId(note.class_id);
        setVisibility(note.visibility || (note.class_id ? "public" : "personal"));
        setCollaborationMode(note.collaboration_mode || "readonly");
        setAttachmentFile(null);
        setIsEditorOpen(true);
        // Delay to ensure DOM is ready
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = note.content;
            }
        }, 100);
    };

    const handleNewNote = () => {
        setCurrentNote(null);
        setNoteTitle("");
        setSelectedClassId(null);
        setVisibility("personal");
        setCollaborationMode("readonly");
        setAttachmentFile(null);
        setIsEditorOpen(true);
        // Delay to ensure DOM is ready for the contentEditable ref
        setTimeout(() => {
            if (editorRef.current) {
                editorRef.current.innerHTML = "<p>Start drafting your high-fidelity academic notes here...</p>";
            }
        }, 100);
    };

    const handleDownload = (note) => {
        const blob = new Blob([`
            <html>
                <head>
                    <title>${note.title}</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #333; }
                        h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
                        .meta { color: #666; font-size: 0.8em; margin-bottom: 30px; }
                    </style>
                </head>
                <body>
                    <h1>${note.title}</h1>
                    <div class="meta">By ${note.uploaded_by?.name} | Published on ${new Date(note.createdAt).toLocaleDateString()}</div>
                    <div class="content">${note.content}</div>
                </body>
            </html>
        `], { type: 'text/html' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCommand = (cmd, val) => {
        if (editorRef.current) {
            editorRef.current.focus();

            if (cmd === 'insertCode') {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);

                    // Ensure the range is within the editor
                    if (!editorRef.current.contains(range.commonAncestorContainer)) {
                        return;
                    }

                    const container = document.createElement('div');
                    container.className = 'snippet-container';
                    container.contentEditable = 'false';

                    // Internal Header
                    const header = document.createElement('div');
                    header.className = 'snippet-header';

                    const label = document.createElement('div');
                    label.className = 'snippet-label';
                    label.innerText = 'Academic Drafting Core';

                    const controls = document.createElement('div');
                    controls.className = 'snippet-controls';

                    const toggleBtn = document.createElement('div');
                    toggleBtn.className = 'snippet-btn';
                    toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
                    toggleBtn.title = "Convert to Formula View";

                    const deleteBtn = document.createElement('div');
                    deleteBtn.className = 'snippet-btn delete';
                    deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
                    deleteBtn.title = "Discard Segment";

                    controls.appendChild(toggleBtn);
                    controls.appendChild(deleteBtn);
                    header.appendChild(label);
                    header.appendChild(controls);
                    container.appendChild(header);

                    const codeBox = document.createElement('div');
                    codeBox.className = 'snippet-box';
                    codeBox.contentEditable = 'true';
                    codeBox.innerHTML = '<br>';

                    const presentLayer = document.createElement('div');
                    presentLayer.className = 'snippet-present';
                    presentLayer.innerHTML = '<div class="formula-text">Converting segment...</div>';

                    container.appendChild(codeBox);
                    container.appendChild(presentLayer);

                    deleteBtn.onclick = (e) => {
                        e.preventDefault();
                        container.remove();
                    };

                    toggleBtn.onclick = (e) => {
                        e.preventDefault();
                        const isPresenting = presentLayer.classList.toggle('active');
                        codeBox.classList.toggle('hidden');

                        if (isPresenting) {
                            const rawText = codeBox.innerText.trim();
                            presentLayer.innerHTML = `<div class="formula-text">${rawText || "Formula Empty"}</div>`;
                            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;
                            toggleBtn.title = "Edit Code Segment";
                            label.innerText = 'Academic Result View';
                        } else {
                            toggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
                            toggleBtn.title = "Convert to Formula View";
                            label.innerText = 'Academic Drafting Core';
                            codeBox.focus();
                        }
                    };

                    range.deleteContents();
                    range.insertNode(container);

                    const p = document.createElement('p');
                    p.innerHTML = '<br>';
                    container.after(p);

                    const newRange = document.createRange();
                    newRange.setStart(codeBox, 0);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            } else {
                document.execCommand(cmd, false, val);
            }
        }
    };


    return (
        <DashboardLayout>
            <div className="space-y-8 h-full">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Resource Hub</h1>
                        <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">
                            {isFaculty ? "Manage shared materials and academic fragments" : "Access all shared lecture notes and study guides"}
                        </p>
                    </div>
                    <Button
                        onClick={handleNewNote}
                        className="px-6 h-10 font-bold uppercase tracking-tighter shadow-lg shadow-primary/10 hover:scale-105 transition-transform"
                    >
                        <Plus size={18} /> {isFaculty ? "Upload Note" : "Share Note"}
                    </Button>
                </header>

                <FocusedEditor
                    isOpen={isEditorOpen}
                    onClose={() => setIsEditorOpen(false)}
                    title="Intelligent Note Editor"
                >
                    <div className="flex flex-col space-y-12">
                        <div className="space-y-6 text-center max-w-2xl mx-auto w-full">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">Document Identity</label>
                            <input
                                placeholder="Enter document title..."
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                className="w-full bg-transparent border-none text-4xl font-black text-center focus:outline-none placeholder:text-muted-foreground/30 px-4"
                            />

                            {/* Sharing Scope Selector */}
                            <div className="relative inline-block mt-4">
                                <button
                                    onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all"
                                >
                                    Sharing Scope: {
                                        !selectedClassId ? "Personal Note" :
                                            `${classes.find(c => c._id === selectedClassId)?.class_name} (${visibility === "student-only" ? "Fellow Students" : "Public"})`
                                    }
                                    <ChevronDown size={14} />
                                </button>

                                {isClassDropdownOpen && (
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-1 text-[10px] font-black text-primary/40 uppercase tracking-widest border-b border-border/50 mb-1">Private Scope</div>
                                        <button
                                            onClick={() => { setSelectedClassId(null); setVisibility("personal"); setIsClassDropdownOpen(false); }}
                                            className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest flex items-center justify-between hover:bg-muted group"
                                        >
                                            Personal Note
                                            {!selectedClassId && <Check size={12} className="text-primary" />}
                                        </button>

                                        <div className="px-4 py-1 text-[10px] font-black text-primary/40 uppercase tracking-widest border-b border-border/50 mt-3 mb-1">Class Scope (Publish to Section)</div>
                                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                            {classes.map(cls => (
                                                <div key={cls._id} className="border-b border-border/30 last:border-0 pb-1">
                                                    <div className="px-4 py-2 text-[10px] font-black text-muted-foreground bg-muted/30">{cls.class_name}</div>
                                                    <button
                                                        onClick={() => { setSelectedClassId(cls._id); setVisibility("public"); setIsClassDropdownOpen(false); }}
                                                        className="w-full px-6 py-2 text-left text-[9px] font-bold uppercase tracking-widest flex items-center justify-between hover:bg-muted group"
                                                    >
                                                        Class Public (Faculty + Students)
                                                        {selectedClassId === cls._id && visibility === "public" && <Check size={12} className="text-primary" />}
                                                    </button>
                                                    {!isFaculty && (
                                                        <>
                                                            <button
                                                                onClick={() => { setSelectedClassId(cls._id); setVisibility("student-only"); setIsClassDropdownOpen(false); }}
                                                                className="w-full px-6 py-2 text-left text-[9px] font-bold uppercase tracking-widest flex items-center justify-between hover:bg-muted group"
                                                            >
                                                                Fellow Students Only
                                                                {selectedClassId === cls._id && visibility === "student-only" && <Check size={12} className="text-primary" />}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="px-4 py-1 text-[10px] font-black text-primary/40 uppercase tracking-widest border-b border-border/50 mt-3 mb-1">Collaboration Mode</div>
                                        <button
                                            onClick={() => { setCollaborationMode("readonly"); setIsClassDropdownOpen(false); }}
                                            className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest flex items-center justify-between hover:bg-muted group"
                                        >
                                            Read-Only Mode
                                            {collaborationMode === "readonly" && <Check size={12} className="text-primary" />}
                                        </button>
                                        <button
                                            onClick={() => { setCollaborationMode("editable"); setIsClassDropdownOpen(false); }}
                                            className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest flex items-center justify-between hover:bg-muted group"
                                        >
                                            Collaborative (Editable)
                                            {collaborationMode === "editable" && <Check size={12} className="text-primary" />}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col space-y-0">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60 text-center mb-6">Content Fragment</label>

                            <div className="flex items-center justify-center mb-4 gap-3">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.txt"
                                    onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 px-4 text-[10px] font-bold uppercase tracking-widest"
                                    onClick={openFilePicker}
                                >
                                    <Paperclip size={14} /> Upload File
                                </Button>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground max-w-[280px] truncate">
                                    {attachmentFile ? attachmentFile.name : (currentNote?.attachment_name || "No file selected")}
                                </span>
                            </div>

                            <div className="flex flex-col border border-border rounded-xl bg-white/5 shadow-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20">
                                <EditorToolbar
                                    onCommand={handleCommand}
                                    onAlert={(msg) => {
                                        setAlert({ message: msg, type: 'info' });
                                        setTimeout(() => setAlert(null), 3000);
                                    }}
                                />
                                <div className="relative group p-8 bg-card/10">
                                    <div
                                        ref={editorRef}
                                        contentEditable={
                                            !currentNote ||
                                            currentNote.uploaded_by._id === user._id ||
                                            collaborationMode === "editable"
                                        }
                                        className="w-full min-h-[400px] bg-transparent border-none text-xl leading-relaxed focus:outline-none transition-all font-medium custom-scrollbar selection:bg-primary/20 relative"
                                        onInput={(e) => {
                                            // Handle content change if needed
                                        }}
                                    >
                                        <p>Start drafting your high-fidelity academic notes here...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-6 justify-center pb-12 pt-8 border-t border-border/10">
                            <Button
                                variant="outline"
                                className="h-14 px-10 font-black uppercase tracking-widest text-xs border-border hover:bg-muted rounded-xl"
                                onClick={() => setIsEditorOpen(false)}
                            >
                                Discard Draft
                            </Button>
                            <Button
                                className="h-14 px-12 font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl"
                                onClick={handlePublish}
                                disabled={isSaving}
                            >
                                {isSaving ? "Syncing..." : "Publish Academic Note"}
                            </Button>
                        </div>
                    </div>
                </FocusedEditor>

                <div className="flex gap-4 items-center mb-8">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input placeholder="Search materials..." className="pl-10 h-10 border-border bg-muted/20" />
                    </div>
                    <Button variant="outline" className="h-10 px-4 text-xs font-bold uppercase tracking-widest ring-1 ring-border">
                        <Filter size={16} /> Filter
                    </Button>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accessing Academic Archives...</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center p-20 border border-dashed border-border rounded-xl">
                            <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">No resources found in your current scope</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <Card
                                key={note._id}
                                onClick={() => handleOpenNote(note)}
                                className="hover:border-foreground/20 transition-all cursor-pointer group shadow-sm border-border bg-card"
                            >
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg group-hover:text-foreground tracking-tight">{note.title}</h3>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                                <span className="text-foreground/70 bg-muted px-2 py-0.5 rounded-sm">
                                                    {note.class_id ? (classes.find(c => c._id === note.class_id)?.class_name || "Class Note") : "Personal"}
                                                </span>
                                                {note.visibility === "student-only" && (
                                                    <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-sm flex items-center gap-1 border border-amber-500/20">
                                                        Learners Only
                                                    </span>
                                                )}
                                                <span className={`${note.collaboration_mode === 'editable' ? 'text-green-500 bg-green-500/10' : 'text-primary/70 bg-muted'} px-2 py-0.5 rounded-sm border border-transparent`}>
                                                    {note.collaboration_mode === 'editable' ? 'Collaborative' : 'Read-Only'}
                                                </span>
                                                <span className="opacity-30">•</span>
                                                <span>By {note.uploaded_by?.name || "Unknown"}</span>
                                                <span className="opacity-30">•</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                                {note.attachment_name && (
                                                    <>
                                                        <span className="opacity-30">•</span>
                                                        <span className="flex items-center gap-1 text-primary/80">
                                                            <Paperclip size={12} />
                                                            {note.attachment_name}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            className="h-9 text-[10px] font-black uppercase tracking-widest px-4 border-border hover:border-foreground/30"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(note);
                                            }}
                                        >
                                            <Download size={14} /> Get Fragment
                                        </Button>
                                        {note.attachment_url && (
                                            <Button
                                                variant="outline"
                                                className="h-9 text-[10px] font-black uppercase tracking-widest px-4 border-border hover:border-foreground/30"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(getAttachmentUrl(note), "_blank");
                                                }}
                                            >
                                                <Paperclip size={14} /> Open File
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            className="h-9 w-9 p-0 hover:bg-muted border border-transparent hover:border-border"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVertical size={16} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence>
                {alert && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert(null)}
                    />
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
