import { useEffect } from 'react';
import { X } from 'lucide-react';
import { themes, type Theme } from '../data/themes';

interface SettingsModalProps {
  currentThemeId: string;
  onSelect: (theme: Theme) => void;
  onClose: () => void;
}

export default function SettingsModal({ currentThemeId, onSelect, onClose }: SettingsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop — no blur so sidebar color change is visible in real time */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 380,
          borderRadius: 20,
          padding: '24px',
          background: 'rgba(18,15,36,0.96)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-base tracking-tight">테마 설정</h2>
            <p className="text-xs mt-1" style={{ color: '#52506a' }}>
              사이드바 색상 톤을 골라보세요
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.14)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Theme grid */}
        <div className="grid grid-cols-4 gap-4">
          {themes.map((theme) => {
            const isSelected = theme.id === currentThemeId;
            return (
              <button
                key={theme.id}
                onClick={() => onSelect(theme)}
                className="flex flex-col items-center gap-2.5 group"
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: theme.gradient,
                    boxShadow: isSelected
                      ? `0 0 0 2.5px ${theme.accent}, 0 0 18px ${theme.accent}55`
                      : `0 0 0 2px rgba(255,255,255,0.06)`,
                    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                />
                <span
                  className="text-xs font-medium transition-colors"
                  style={{
                    color: isSelected ? '#fff' : '#52506a',
                    transition: 'color 0.15s',
                  }}
                >
                  {theme.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: '#2e2c45', letterSpacing: '0.01em' }}
        >
          선택 즉시 적용돼요
        </p>
      </div>
    </>
  );
}
