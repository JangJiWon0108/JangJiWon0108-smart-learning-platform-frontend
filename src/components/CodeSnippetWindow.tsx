import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
  code: string;
  language?: string;
  title?: string;
  maxHeight?: number;
  className?: string;
};

export default function CodeSnippetWindow({
  code,
  language = 'text',
  title,
  maxHeight = 520,
  className,
}: Props) {
  const safeTitle = title?.trim();

  return (
    <div
      className={className}
      style={{
        background: '#0b1020',
        border: '1px solid rgba(148,163,184,0.16)',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(15,23,42,0.22)',
      }}
    >
      {/* Title bar (macOS traffic lights) */}
      <div
        className="flex items-center gap-3 px-3 py-2"
        style={{
          background: 'linear-gradient(180deg, rgba(36,41,59,0.92), rgba(20,24,35,0.92))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block"
            style={{ width: 10, height: 10, borderRadius: 999, background: '#ff5f57', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)' }}
          />
          <span
            aria-hidden
            className="inline-block"
            style={{ width: 10, height: 10, borderRadius: 999, background: '#febc2e', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)' }}
          />
          <span
            aria-hidden
            className="inline-block"
            style={{ width: 10, height: 10, borderRadius: 999, background: '#28c840', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)' }}
          />
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          {safeTitle && (
            <span
              className="text-[11px] font-mono truncate"
              style={{ color: 'rgba(226,232,240,0.78)' }}
              title={safeTitle}
            >
              {safeTitle}
            </span>
          )}
        </div>

        <span
          className="text-[10px] font-mono uppercase"
          style={{
            color: 'rgba(148,163,184,0.55)',
            letterSpacing: '0.08em',
          }}
        >
          {language}
        </span>
      </div>

      {/* Code */}
      <div style={{ background: '#0b1020' }}>
        <SyntaxHighlighter
          language={language}
          style={oneDark as any}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '14px 16px',
            maxHeight,
            overflow: 'auto',
            fontSize: 12.5,
            lineHeight: 1.55,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
          codeTagProps={{
            style: {
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
          wrapLongLines
          showLineNumbers={false}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

