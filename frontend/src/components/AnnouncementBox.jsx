import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Bell, Plus, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent } from './ui/Card';
import { announcementService } from '../services/announcement.service';
import { useAuth } from '../context/AuthContext';

export const AnnouncementBox = ({ classId = null }) => {
    const { user } = useAuth();
    const isFaculty = user?.role === 'faculty';
    const canPost = isFaculty || (classId !== null); // Allow students to post in class chats

    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [title, setTitle] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showComposer, setShowComposer] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, [classId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [announcements]);

    const fetchData = async () => {
        try {
            const data = await announcementService.getAnnouncements();
            // Filter by classId if provided, otherwise show all global/accessible
            const filtered = classId
                ? data.filter(a => a.class_id?.toString() === classId.toString())
                : data;
            setAnnouncements(filtered);
        } catch (error) {
            console.error("Failed to fetch announcements:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!message.trim() || !title.trim()) return;

        setIsPosting(true);
        try {
            await announcementService.createAnnouncement({
                title,
                content: message,
                class_id: classId,
                type: 'general'
            });
            setMessage("");
            setTitle("");
            setShowComposer(false);
            fetchData();
        } catch (error) {
            console.error("Failed to post announcement:", error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <Card className="h-[450px] flex flex-col overflow-hidden border-border bg-card/50 backdrop-blur-md">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Announcement Stream</h3>
                </div>
                {canPost && (
                    <button
                        onClick={() => setShowComposer(!showComposer)}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors text-primary"
                    >
                        {showComposer ? <X size={16} /> : <Plus size={16} />}
                    </button>
                )}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center opacity-30">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40 italic">
                        <Bell size={24} className="mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Transmissions...</p>
                    </div>
                ) : (
                    announcements.map((ann, idx) => (
                        <div key={ann._id} className="flex flex-col gap-1 fade-in">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">{ann.author?.name}</span>
                                <span className="text-[8px] text-muted-foreground font-bold">
                                    {ann.createdAt ? new Date(ann.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                            </div>
                            <div className="bg-muted/40 p-3 rounded-xl rounded-tl-none border border-border/50">
                                <p className="text-[11px] font-bold text-foreground mb-1 underline decoration-primary/30 underline-offset-2">{ann.title}</p>
                                <p className="text-xs text-foreground/80 leading-relaxed">{ann.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showComposer && canPost && (
                <form onSubmit={handlePost} className="p-4 bg-muted/30 border-t border-border space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                    <Input
                        placeholder="Announcement Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="h-8 text-xs font-bold"
                        required
                    />
                    <div className="relative">
                        <textarea
                            placeholder="Type transmission content..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg p-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary min-h-[80px] resize-none font-medium"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isPosting || !message.trim()}
                            className="absolute bottom-3 right-3 p-2 bg-primary text-primary-foreground rounded-lg hover:scale-105 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </form>
            )}
        </Card>
    );
};
