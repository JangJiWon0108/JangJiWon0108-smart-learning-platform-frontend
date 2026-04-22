export interface Theme {
  id: string;
  name: string;
  bg: string;
  accent: string;
  accentLight: string;
  muted: string;
  borderColor: string;
  gradient: string;
  primary: string; // action color for chat area (buttons, highlights)
}

export const themes: Theme[] = [
  {
    id: 'void',
    name: '보이드',
    bg: '#2d1159',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.12)',
    gradient: 'linear-gradient(135deg, #7c3aed, #2563eb)',
    primary: '#7c3aed',
  },
  {
    id: 'midnight',
    name: '미드나잇',
    bg: '#0f2d5c',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #1e40af, #0ea5e9)',
    primary: '#2563eb',
  },
  {
    id: 'forest',
    name: '포레스트',
    bg: '#0e3d28',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #065f46, #10b981)',
    primary: '#10b981',
  },
  {
    id: 'rose',
    name: '로즈',
    bg: '#4a1025',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #9f1239, #f43f5e)',
    primary: '#f43f5e',
  },
  {
    id: 'ocean',
    name: '오션',
    bg: '#0c3450',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #0e7490, #06b6d4)',
    primary: '#06b6d4',
  },
  {
    id: 'sunset',
    name: '선셋',
    bg: '#421908',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #c2410c, #fbbf24)',
    primary: '#f97316',
  },
  {
    id: 'mono',
    name: '모노',
    bg: '#212121',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.45)',
    borderColor: 'rgba(255,255,255,0.08)',
    gradient: 'linear-gradient(135deg, #333333, #888888)',
    primary: '#64748b',
  },
  {
    id: 'lavender',
    name: '라벤더',
    bg: '#281257',
    accent: '#ffffff',
    accentLight: 'rgba(255,255,255,0.18)',
    muted: 'rgba(255,255,255,0.5)',
    borderColor: 'rgba(255,255,255,0.1)',
    gradient: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
    primary: '#a78bfa',
  },
];

export const defaultTheme = themes[0];
