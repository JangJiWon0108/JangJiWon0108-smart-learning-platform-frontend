import { useState, useRef, type KeyboardEvent } from 'react';
import { Image, Send, X } from 'lucide-react';
import { type Theme } from '../data/themes';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_ACCEPT = ALLOWED_MIME.join(',');

interface InputAreaProps {
  onSend: (text: string, image?: File) => void;
  isLoading?: boolean;
  theme: Theme;
}

export default function InputArea({ onSend, isLoading = false, theme }: InputAreaProps) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!text.trim() && !imageFile) || isLoading) return;
    onSend(text.trim(), imageFile ?? undefined);
    setText('');
    clearImage();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_MIME.includes(file.type)) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const canSend = (text.trim().length > 0 || imageFile !== null) && !isLoading;

  return (
    <div
      className="px-5 py-4"
      style={{ borderTop: '1px solid #e2e8f0', background: '#ffffff' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_ACCEPT}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-2 flex items-start gap-2">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="첨부 이미지"
              className="rounded-xl object-cover"
              style={{ maxWidth: 120, maxHeight: 90 }}
            />
            <button
              onClick={clearImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#475569', color: '#fff' }}
            >
              <X size={11} />
            </button>
          </div>
          <span className="text-xs mt-1" style={{ color: '#94a3b8' }}>
            {imageFile?.name}
          </span>
        </div>
      )}

      <div
        className="flex items-end gap-2 rounded-2xl px-4 py-3"
        style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
      >
        {/* Action buttons */}
        <div className="flex items-center gap-1 mb-0.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: imageFile ? theme.primary : '#94a3b8' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = imageFile ? theme.primary : '#64748b')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = imageFile ? theme.primary : '#94a3b8')}
            title="이미지 첨부 (JPEG·PNG·WEBP·GIF)"
          >
            <Image size={18} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="질문을 입력하거나 코드를 붙여넣으세요..."
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
          style={{
            color: '#334155',
            minHeight: 24,
            maxHeight: 128,
          }}
        />

        {/* Right buttons */}
        <div className="flex items-center gap-1 mb-0.5">
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="p-2 rounded-xl transition-colors"
            style={{
              background: canSend ? theme.gradient : '#e2e8f0',
              color: canSend ? '#ffffff' : '#94a3b8',
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
            title="전송"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
