import { Bell, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

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

        <button className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground relative border border-transparent hover:border-border">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="h-4 w-px bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter mt-1">{user?.role || 'User'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
            <User size={20} className="text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};
