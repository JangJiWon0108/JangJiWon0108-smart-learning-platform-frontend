import {
  MessageSquare,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { type Theme } from '../data/themes';

interface NavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: 'chat', label: '질문하기', Icon: MessageSquare },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  theme: Theme;
  onOpenSettings: () => void;
}

export default function Sidebar({ activeItem, onItemClick, theme, onOpenSettings }: SidebarProps) {
  return (
    <div
      className="flex flex-col h-screen flex-shrink-0 text-white"
      style={{ width: 220, background: theme.bg, transition: 'background 0.3s ease' }}
    >
      {/* Logo */}
      <div className="px-4 py-6 border-b flex flex-col items-center gap-2" style={{ borderColor: theme.borderColor }}>
        <img
          src="/logo.png"
          alt="정처한방 로고"
          className="w-28 h-28 object-contain drop-shadow-lg"
        />
        <div className="text-center">
          <div className="text-lg font-extrabold tracking-tight text-white">정처한방</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeItem === id;
          return (
            <button
              key={id}
              onClick={() => onItemClick(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left"
              style={{
                background: isActive ? theme.accentLight : 'transparent',
                color: isActive ? theme.accent : theme.muted,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.color = theme.muted;
                }
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 pt-4 border-t" style={{ borderColor: theme.borderColor }}>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left"
          style={{ color: theme.muted, transition: 'background 0.15s, color 0.15s' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = theme.muted;
          }}
        >
          <Settings size={16} />
          <span>설정</span>
        </button>
      </div>
    </div>
  );
}
