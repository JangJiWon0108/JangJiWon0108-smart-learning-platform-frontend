import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Keyboard } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TracerOutput } from '../types';

const LANG_LABEL: Record<string, string> = { c: 'C', java: 'Java', python: 'Python' };
const LANG_COLOR: Record<string, string> = {
  c: '#06b6d4',
  java: '#f59e0b',
  python: '#3b82f6',
};

interface Props {
  data: TracerOutput;
}

export default function TracerViewer({ data }: Props) {
  const [stepIdx, setStepIdx] = useState(0);
  const [expandedVars, setExpandedVars] = useState<Set<string>>(new Set());
  const [revealedOutput, setRevealedOutput] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data?.steps?.length) {
    return (
      <div className="rounded-2xl p-6 text-sm text-slate-500 text-center" style={{ border: '1px solid #e2e8f0' }}>
        실행 흐름 데이터를 불러오지 못했습니다.
      </div>
    );
  }

  const step = data.steps[stepIdx];
  const total = data.steps.length;
  const langColor = LANG_COLOR[data.language] ?? '#6366f1';
  const currentLineText = data.original_code.split('\n')[step.line - 1]?.trim() ?? '';
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === total - 1;

  const goNext = useCallback(() => setStepIdx((s) => Math.min(total - 1, s + 1)), [total]);
  const goPrev = useCallback(() => setStepIdx((s) => Math.max(0, s - 1)), []);

  // 키보드 네비게이션
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
    };
    el.addEventListener('keydown', handler);
    return () => el.removeEventListener('keydown', handler);
  }, [goNext, goPrev]);

  const toggleVar = (key: string) => {
    setExpandedVars((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const progress = ((stepIdx + 1) / total) * 100;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="rounded-2xl rounded-tl-sm overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-md"
            style={{ background: langColor + '18', color: langColor, border: `1px solid ${langColor}30` }}
          >
            {LANG_LABEL[data.language]}
          </span>
          <span className="text-xs font-semibold text-slate-600">{data.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Keyboard size={11} />
            <span>← →</span>
          </span>
          <span className="text-xs text-slate-400">{total}단계</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: '#f1f5f9' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${langColor}, ${langColor}aa)`,
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      <div className="flex" style={{ minHeight: 320 }}>
        {/* ── Code panel (CodeSnippetWindow 디자인 통일) ── */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            background: '#0b1020',
            borderRight: '1px solid rgba(148,163,184,0.16)',
          }}
        >
          {/* macOS traffic lights title bar */}
          <div
            className="flex items-center gap-3 px-3 py-2 flex-shrink-0"
            style={{
              background: 'linear-gradient(180deg, rgba(36,41,59,0.92), rgba(20,24,35,0.92))',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ width: 10, height: 10, borderRadius: 999, background: '#ff5f57', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)', display: 'inline-block' }} aria-hidden />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: '#febc2e', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)', display: 'inline-block' }} aria-hidden />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: '#28c840', boxShadow: '0 0 0 1px rgba(0,0,0,0.25)', display: 'inline-block' }} aria-hidden />
            </div>
            <span
              className="text-[10px] font-mono uppercase flex-1"
              style={{ color: 'rgba(148,163,184,0.55)', letterSpacing: '0.08em' }}
            >
              {data.language}
            </span>
            <span
              className="text-[10px] font-mono"
              style={{ color: 'rgba(148,163,184,0.4)' }}
            >
              line {step.line}
            </span>
          </div>

          {/* Syntax-highlighted code with active line */}
          <div className="flex-1 overflow-auto" style={{ background: '#0b1020' }}>
            <SyntaxHighlighter
              language={data.language}
              style={oneDark as any}
              showLineNumbers
              wrapLines
              lineProps={(lineNumber) => {
                const isActive = lineNumber === step.line;
                return {
                  'data-active-line': isActive ? 'true' : undefined,
                  style: {
                    display: 'block',
                    background: isActive ? 'rgba(251,191,36,0.22)' : 'transparent',
                    borderLeft: isActive ? '3px solid #fbbf24' : '3px solid transparent',
                    boxShadow: isActive ? 'inset 0 0 0 1px rgba(251,191,36,0.15)' : undefined,
                  },
                } as React.HTMLAttributes<HTMLElement> & { 'data-active-line'?: string };
              }}
              customStyle={{
                margin: 0,
                background: 'transparent',
                padding: '14px 0',
                fontSize: 12.5,
                lineHeight: 1.6,
                fontFamily:
                  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              }}
              codeTagProps={{
                style: {
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
              lineNumberStyle={{
                color: 'rgba(148,163,184,0.3)',
                minWidth: '2.5em',
                paddingRight: '1em',
                userSelect: 'none',
              }}
            >
              {data.original_code}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* ── State panel ── */}
        <div className="flex flex-col overflow-auto" style={{ width: 240, flexShrink: 0 }}>
          <div className="flex-1 p-3 space-y-3">
            {/* Call stack - shown first */}
            {step.call_stack.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  콜스택
                </p>
                <div className="flex flex-col-reverse gap-0.5">
                  {step.call_stack.map((fn, i) => {
                    const isTop = i === step.call_stack.length - 1;
                    return (
                      <div
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1"
                        style={{
                          background: isTop ? '#ede9fe' : '#f1f5f9',
                          color: isTop ? '#6d28d9' : '#64748b',
                          borderLeft: isTop ? '2px solid #7c3aed' : '2px solid transparent',
                          marginLeft: i * 6,
                        }}
                      >
                        {fn}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Current code line */}
            {currentLineText && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  현재 실행
                </p>
                <div
                  className="text-[10px] font-mono px-2 py-1.5 rounded-md truncate"
                  style={{ background: '#1e1e2e', color: '#fef3c7', border: '1px solid rgba(255,255,255,0.06)' }}
                  title={currentLineText}
                >
                  {currentLineText}
                </div>
              </div>
            )}

            {/* Variables */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                변수 상태
              </p>
              {Object.keys(step.variables).length === 0 ? (
                <p className="text-xs text-slate-400">—</p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(step.variables).map(([k, v]) => {
                    const changed = step.changed_vars.includes(k);
                    const valStr = JSON.stringify(v);
                    const isLong = valStr.length > 12;
                    const expanded = expandedVars.has(k);
                    return (
                      <div
                        key={k}
                        className="rounded-md px-2 py-1"
                        style={{
                          background: changed ? '#dcfce7' : '#f8fafc',
                          border: changed ? '1px solid #86efac' : '1px solid #f1f5f9',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-slate-600">{k}</span>
                          <div className="flex items-center gap-1">
                            {changed && (
                              <span className="text-[9px] font-bold px-1 rounded" style={{ background: '#bbf7d0', color: '#15803d' }}>
                                변경
                              </span>
                            )}
                            <span
                              className={`text-xs font-mono font-semibold ml-1 ${isLong && !expanded ? 'truncate' : ''}`}
                              style={{
                                color: changed ? '#16a34a' : '#475569',
                                maxWidth: isLong && !expanded ? 70 : undefined,
                                cursor: isLong ? 'pointer' : 'default',
                                display: 'block',
                              }}
                              onClick={() => isLong && toggleVar(k)}
                              title={isLong ? (expanded ? '접기' : '펼치기') : undefined}
                            >
                              {expanded ? valStr : valStr.length > 12 ? valStr.slice(0, 12) + '…' : valStr}
                            </span>
                          </div>
                        </div>
                        {isLong && expanded && (
                          <div className="mt-1 text-[10px] font-mono break-all" style={{ color: changed ? '#15803d' : '#64748b' }}>
                            {valStr}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Memory (C) */}
            {step.memory.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  메모리
                </p>
                <div className="space-y-1">
                  {step.memory.map((m, i) => (
                    <div
                      key={i}
                      className="text-[10px] font-mono rounded px-2 py-1"
                      style={{ background: '#fef3c7', border: '1px solid #fde68a' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-amber-600">{m.address}</span>
                        {m.type && <span className="text-[9px] text-amber-500 font-semibold">{m.type}</span>}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-amber-800 font-semibold">{JSON.stringify(m.value)}</span>
                        {m.points_to && <span className="text-amber-500">➜ {m.points_to}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Heap (Java/Python) */}
            {step.heap.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">
                  힙
                </p>
                <div className="space-y-1">
                  {step.heap.map((obj) => (
                    <div
                      key={obj.id}
                      className="text-[10px] font-mono rounded px-2 py-1"
                      style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600 font-semibold">{obj.class_name}</span>
                        <span className="text-blue-400">#{obj.id}</span>
                      </div>
                      {Object.entries(obj.fields).map(([fk, fv]) => (
                        <div key={fk} className="ml-2 text-blue-700 mt-0.5">
                          {fk}: {JSON.stringify(fv)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note + Navigation */}
      <div style={{ borderTop: '1px solid #e2e8f0' }}>
        <div className="px-5 py-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-700">Step {step.step}. </span>
            {step.note}
          </p>
        </div>

        {data.final_output && (
          <div className="mx-5 mb-3">
            <button
              type="button"
              onClick={() => setRevealedOutput((v) => !v)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition"
              style={{
                background: revealedOutput ? '#0f172a' : langColor + '20',
                color: revealedOutput ? '#e2e8f0' : langColor,
                border: `1px solid ${revealedOutput ? 'rgba(226,232,240,0.16)' : 'rgba(148,163,184,0.18)'}`,
              }}
            >
              {revealedOutput ? '출력 숨기기' : '출력 보기'}
            </button>

            {revealedOutput && (
              <div
                className="mt-2 px-3 py-2 rounded-xl text-xs font-mono whitespace-pre-wrap"
                style={{ background: '#1e1e2e', color: '#a6e3a1', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {data.final_output}
              </div>
            )}
          </div>
        )}

        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid #f1f5f9' }}
        >
          {/* Step dots */}
          <div className="flex items-center gap-1 flex-wrap" style={{ maxWidth: 200 }}>
            {total <= 12 ? (
              Array.from({ length: total }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStepIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === stepIdx ? 16 : 6,
                    height: 6,
                    background: i === stepIdx ? langColor : i < stepIdx ? langColor + '60' : '#e2e8f0',
                  }}
                  aria-label={`${i + 1}단계로 이동`}
                />
              ))
            ) : (
              <span className="text-xs text-slate-400">{stepIdx + 1} / {total} 단계</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            <button
              onClick={goPrev}
              disabled={isFirst}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: isFirst ? '#f1f5f9' : '#e2e8f0', color: isFirst ? '#cbd5e1' : '#475569' }}
              aria-label="이전 단계"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={goNext}
              disabled={isLast}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: isLast ? '#f1f5f9' : '#e2e8f0', color: isLast ? '#cbd5e1' : '#475569' }}
              aria-label="다음 단계"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
