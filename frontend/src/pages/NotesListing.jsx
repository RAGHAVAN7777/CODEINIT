import React, { useState, useEffect } from "react";
import { Search, Filter, FileText, Download, MoreVertical, Plus } from "lucide-react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { FocusedEditor } from "../components/ui/FocusedEditor";
import { EditorToolbar } from "../components/ui/EditorToolbar";
import { useAuth } from "../context/AuthContext";

export default function NotesListing() {
    const { user } = useAuth();
    const isFaculty = user?.role?.toLowerCase() === "faculty";
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const editorRef = React.useRef(null);

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

    const resources = [
        { title: "Neural Networks Fundamentals", course: "AI Elective", author: "Dr. Smith", date: "2 days ago" },
        { title: "Systems Programming Core", course: "CS202", author: "Prof. James", date: "Last Week" },
        { title: "Distributed Computing Guide", course: "CS501", author: "Dr. Raghavan", date: "3 days ago" },
        { title: "Quantum Physics Summary", course: "PHY101", author: "Sarah Jane", date: "Today" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 h-full">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Resource Vault</h1>
                        <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">
                            {isFaculty ? "Manage shared materials and academic fragments" : "Access all shared lecture notes and study guides"}
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsEditorOpen(true)}
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
                        <div className="space-y-4 text-center">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60">Document Identity</label>
                            <input
                                placeholder="Enter document title..."
                                className="w-full bg-transparent border-none text-4xl font-black text-center focus:outline-none placeholder:text-muted-foreground/30 px-4"
                            />
                        </div>

                        <div className="flex flex-col space-y-0">
                            <label className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/60 text-center mb-6">Content Fragment</label>

                            <div className="flex flex-col border border-border rounded-xl bg-white/5 shadow-2xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/20">
                                <EditorToolbar onCommand={handleCommand} />
                                <div className="relative group p-8 bg-card/10">
                                    <div
                                        ref={editorRef}
                                        contentEditable
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
                                onClick={() => setIsEditorOpen(false)}
                            >
                                Publish Academic Note
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
                    {resources.map((note, i) => (
                        <Card key={i} className="hover:border-foreground/20 transition-all cursor-pointer group shadow-sm border-border bg-card">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg group-hover:text-foreground tracking-tight">{note.title}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                            <span className="text-foreground/70 bg-muted px-2 py-0.5 rounded-sm">{note.course}</span>
                                            <span className="opacity-30">•</span>
                                            <span>By {note.author}</span>
                                            <span className="opacity-30">•</span>
                                            <span>{note.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest px-4 border-border hover:border-foreground/30"><Download size={14} /> Get Fragment</Button>
                                    <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-muted border border-transparent hover:border-border"><MoreVertical size={16} /></Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
