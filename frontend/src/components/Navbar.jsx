import React, { useState, useEffect } from 'react';
import { Bell, User, Sun, Moon, Trash2, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/announcement.service';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all read:", error);
    }
  };

  const handleDeleteNotif = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      // Recalculate unread if needed
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Network Operational</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground relative border border-transparent hover:border-border"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-[8px] font-black text-white flex items-center justify-center rounded-full border-2 border-card">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest">Alert Terminal</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <CheckCircle size={10} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[10px] font-bold text-muted-foreground uppercase italic pb-12">
                    No recent transmission alerts
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n._id}
                      className={`p-4 border-b border-border/50 hover:bg-muted/30 transition-colors relative group ${!n.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${!n.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <p className="text-[11px] font-bold text-foreground leading-tight">{n.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                          <p className="text-[8px] font-black uppercase text-muted-foreground/50 tracking-widest mt-2">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Received
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteNotif(n._id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-1">{user?.role || 'User'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden transition-all hover:border-primary/50 cursor-pointer">
            <User size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};
