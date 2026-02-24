import React, { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Search, UserPlus, X, Check, Users } from "lucide-react";
import { userService } from "../../services/user.service";

export const ShareModal = ({ isOpen, onClose, onShare, noteTitle }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (isOpen) {
            performSearch(""); // Fetch initially on open
        }
    }, [isOpen]);

    const filteredResults = searchQuery.length >= 2
        ? results.filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : results;

    const performSearch = async (query = searchQuery) => {
        setIsSearching(true);
        try {
            const data = await userService.searchStudents(query);
            setResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const toggleUser = (user) => {
        if (selectedUsers.find(u => u._id === user._id)) {
            setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const handleShare = () => {
        const payload = {
            userIds: selectedUsers.map(u => u._id),
            // Only send email if it looks like one and no users are selected (or as an addition)
            email: selectedUsers.length === 0 && searchQuery.includes("@") ? searchQuery.trim() : null
        };
        onShare(payload);
        onClose();
        setSelectedUsers([]);
        setSearchQuery("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Peer-to-Peer Academic Exchange">
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Transmit Intelligence</p>
                    <h3 className="text-xl font-bold tracking-tight">{noteTitle}</h3>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                        placeholder="Search colleagues by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 bg-muted/20 border-border/50 focus:ring-2 focus:ring-primary/10"
                    />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search Results</span>
                        {isSearching && <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                    </div>

                    <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        {filteredResults.length === 0 && !isSearching ? (
                            <div className="text-center py-8 border border-dashed border-red-500/20 bg-red-500/5 rounded-xl">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-red-500/70">No peers located matching "{searchQuery}"</p>
                            </div>
                        ) : (
                            filteredResults.map(user => (
                                <button
                                    key={user._id}
                                    onClick={() => toggleUser(user)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedUsers.find(u => u._id === user._id)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-muted/30 border-transparent hover:border-border hover:bg-muted/50"
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold uppercase tracking-widest">{user.name}</div>
                                        <div className={`text-[9px] opacity-60 ${selectedUsers.find(u => u._id === user._id) ? "text-white" : ""}`}>{user.email}</div>
                                    </div>
                                    {selectedUsers.find(u => u._id === user._id) ? <Check size={14} /> : <UserPlus size={14} />}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {selectedUsers.length > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="px-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipient Roster ({selectedUsers.length})</div>
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map(user => (
                                <div key={user._id} className="flex items-center gap-2 bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-full">
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{user.name}</span>
                                    <button onClick={() => toggleUser(user)} className="text-primary hover:text-red-500 transition-colors">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4 flex gap-3">
                    <Button variant="outline" className="flex-1 h-12 uppercase font-black text-[10px] tracking-widest" onClick={onClose}>Abort</Button>
                    <Button
                        className="flex-1 h-12 uppercase font-black text-[10px] tracking-widest"
                        disabled={selectedUsers.length === 0 && (!searchQuery.includes("@") || searchQuery.length < 5)}
                        onClick={handleShare}
                    >
                        Initiate Exchange
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
