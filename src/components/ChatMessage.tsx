import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, AIContent, CodeBlock, ConceptImageData, ExamProblemCard } from '../types';
import TracerViewer from './TracerViewer';
import CodeSnippetWindow from './CodeSnippetWindow';

const badgeConfig = {
  concept: { label: '개념 설명', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  debug: { label: '코드 분석', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
  recommend: { label: '질문 추천', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  curate: { label: '맞춤 추천', bg: '#faf5ff', color: '#6d28d9', border: '#e9d5ff' },
};

const cardAccent: Record<
  ExamProblemCard['accent'],
  { bar: string; pill: string; pillText: string; ring: string }
> = {
  violet: { bar: '#8b5cf6', pill: '#f5f3ff', pillText: '#5b21b6', ring: 'rgba(139,92,246,0.12)' },
  cyan: { bar: '#06b6d4', pill: '#ecfeff', pillText: '#0e7490', ring: 'rgba(6,182,212,0.12)' },
  amber: { bar: '#f59e0b', pill: '#fffbeb', pillText: '#b45309', ring: 'rgba(245,158,11,0.12)' },
  rose: { bar: '#f43f5e', pill: '#fff1f2', pillText: '#be123c', ring: 'rgba(244,63,94,0.1)' },
};

function stripQuestionCodePreview(raw: string): string {
  if (!raw) return raw;
  const lowered = raw.toLowerCase();
  const idx = lowered.indexOf('[cs]');
  if (idx === -1) return raw.trim();
  return raw.slice(0, idx).trim();
}

function ProblemCardsDeck({ cards }: { cards: ExamProblemCard[] }) {
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const orderedCards = useMemo(() => cards, [cards]);
  return (
    <div className="mt-5 space-y-3">
      <p className="text-xs text-slate-500 leading-relaxed">
        총 <span className="font-semibold text-slate-700">{cards.length}개</span>를 세로로 모았어요. 위에서부터
        천천히 살보면 좋아요.
      </p>
      {orderedCards.map((c, index) => {
        const a = cardAccent[c.accent];
        const isAnswerRevealed = !!revealedAnswers[c.problemId];
        const answerText =
          typeof c.answer === 'string' && c.answer.trim().length > 0
            ? c.answer.trim()
            : typeof c.officialAnswer === 'string'
              ? c.officialAnswer.trim()
              : '';
        const explanationText = typeof c.explanation === 'string' ? c.explanation.trim() : '';
        return (
          <article
            key={c.problemId}
            className="group relative w-full rounded-2xl border border-slate-100 bg-white/90 overflow-hidden transition duration-200 hover:border-slate-200 hover:shadow-md"
            style={{ boxShadow: `0 1px 0 0 ${a.ring}, 0 8px 24px -12px rgba(15,23,42,0.08)` }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: a.bar }} />
            <div className="pl-4 pr-4 py-4 sm:pl-5">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0"
                  style={{ background: a.bar }}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-600 tabular-nums">
                  {c.year}년 제{c.round}회 · 문항 {c.questionNumber}
                </span>
                <span
                  className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                  style={{ background: a.pill, color: a.pillText }}
                >
                  {c.matchLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug mb-2.5 line-clamp-2">{c.examTitle}</p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line line-clamp-[10]">
                {stripQuestionCodePreview(c.stemPreview)}
              </p>

              {(c.code || answerText || explanationText) && (
                <div className="mt-3 space-y-2">
                    {typeof c.code === 'string' && c.code.trim().length > 0 && (
                      <CodeSnippetWindow
                        code={c.code}
                        language={c.codeLanguage || 'text'}
                        title={`${c.year}년 ${c.round}회 · 문항 ${c.questionNumber}`}
                        maxHeight={280}
                      />
                    )}

                    {(answerText || explanationText) && (
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setRevealedAnswers((prev) => ({
                              ...prev,
                              [c.problemId]: !prev[c.problemId],
                            }))
                          }
                          className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition"
                          style={{
                            background: isAnswerRevealed ? '#0f172a' : `${a.bar}20`,
                            color: isAnswerRevealed ? '#e2e8f0' : a.bar,
                            border: `1px solid ${isAnswerRevealed ? 'rgba(226,232,240,0.16)' : 'rgba(148,163,184,0.18)'}`,
                          }}
                        >
                          {isAnswerRevealed ? '정답 숨기기' : '정답 보기'}
                        </button>

                        {isAnswerRevealed && (
                          <div
                            className="mt-2 px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap"
                            style={{
                              background: '#1e1e2e',
                              border: '1px solid rgba(255,255,255,0.06)',
                              color: '#e2e8f0',
                            }}
                          >
                            <div className="font-semibold" style={{ color: '#a6e3a1' }}>
                              [정답]
                            </div>
                            <div className="mt-1">{answerText || '정답 정보가 없습니다.'}</div>

                            {explanationText && (
                              <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="font-semibold" style={{ color: '#a6e3a1' }}>
                                  [해설]
                                </div>
                                <div className="mt-1">{explanationText}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 해설은 정답 토글 내부에서 함께 표시 */}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

const tagStyle: Record<string, { bg: string; color: string; border: string }> = {
  blue: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  green: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  purple: { bg: '#faf5ff', color: '#7c3aed', border: '#e9d5ff' },
  orange: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  yellow: { bg: '#fefce8', color: '#ca8a04', border: '#fef08a' },
  red: { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
};

function ConceptImageCard({ data }: { data: ConceptImageData }) {
  return (
    <div
      className="mt-3 rounded-xl overflow-hidden"
      style={{ width: 170, height: 130, background: data.bgColor }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <span
          style={{
            fontSize: 80,
            color: data.letterColor,
            fontFamily: 'Georgia, serif',
            fontWeight: 900,
            textShadow: `2px 4px 0 rgba(0,0,0,0.5), 0 0 20px rgba(245,158,11,0.4)`,
            lineHeight: 1,
          }}
        >
          {data.letter}
        </span>
      </div>
    </div>
  );
}

function CodeImageCard({ data }: { data: CodeBlock }) {
  return (
    <div className="mt-3" style={{ maxWidth: 360 }}>
      <CodeSnippetWindow
        code={data.code}
        language={data.language || 'text'}
        title={data.filename || 'snippet'}
        maxHeight={220}
      />
    </div>
  );
}

function AICodeBlock({ data }: { data: CodeBlock }) {
  return (
    <div className="mt-4">
      <CodeSnippetWindow
        code={data.code}
        language={data.language || 'text'}
        title={data.filename || 'code'}
        maxHeight={260}
      />
    </div>
  );
}

function AIMessageContent({ content }: { content: AIContent }) {
  const badge = badgeConfig[content.badgeType];

  return (
    <div
      className="rounded-2xl rounded-tl-sm px-5 py-4"
      style={{
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Badge */}
      {content.title && (
        <div className="mb-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-md"
            style={{
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
            }}
          >
            {badge.label}
          </span>
        </div>
      )}

      {/* Summary */}
      {content.summary && (
        <div className="text-sm text-slate-600 leading-relaxed mb-1 markdown-body">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold text-slate-800">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              ul: ({ children }) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              code: ({ children }) => (
                <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#f1f5f9', color: '#7c3aed' }}>{children}</code>
              ),
            }}
          >
            {content.summary}
          </ReactMarkdown>
        </div>
      )}

      {content.problemCards && content.problemCards.length > 0 && (
        <ProblemCardsDeck cards={content.problemCards} />
      )}

      {/* Sections */}
      {content.sections?.map((section, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold"
              style={{ background: '#f1f5f9', color: '#475569' }}
            >
              {idx + 1}
            </span>
            <span className="text-sm font-semibold text-slate-700">{section.heading}</span>
          </div>
          {section.items && (
            <ul className="space-y-1.5 ml-7">
              {section.items.map((item, iIdx) => (
                <li key={iIdx} className="text-sm text-slate-600 leading-relaxed flex gap-2">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          {section.content && (
            <p className="text-sm text-slate-600 leading-relaxed ml-7">{section.content}</p>
          )}
        </div>
      ))}

      {/* Code block */}
      {content.codeBlock && <AICodeBlock data={content.codeBlock} />}

    </div>
  );
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-6">
        <div style={{ maxWidth: 380 }}>
          <div
            className="rounded-2xl rounded-tr-sm px-4 py-3"
            style={{ background: '#7c3aed', color: '#ffffff' }}
          >
            {message.text && (
              <p className="text-sm leading-relaxed">{message.text}</p>
            )}
            {message.uploadedImageUrl && (
              <img
                src={message.uploadedImageUrl}
                alt="첨부 이미지"
                className="mt-2 rounded-xl object-cover"
                style={{ maxWidth: 240, maxHeight: 180 }}
              />
            )}
            {message.conceptImage && <ConceptImageCard data={message.conceptImage} />}
            {message.codeImage && <CodeImageCard data={message.codeImage} />}
          </div>
          <div className="text-right text-xs mt-1 pr-1" style={{ color: '#94a3b8' }}>
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  if (message.tracerOutput) {
    return (
      <div className="flex items-start gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)', boxShadow: '0 0 0 2px rgba(99,102,241,0.2)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="6.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="15" y1="15" x2="21" y2="21" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1, maxWidth: 720 }}>
          <TracerViewer data={message.tracerOutput} />
          <div className="text-xs mt-1 pl-1" style={{ color: '#94a3b8' }}>
            {message.timestamp}
          </div>
        </div>
      </div>
    );
  }

  if (!message.aiContent) return null;

  return (
    <div className="flex items-start gap-3 mb-6">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)', boxShadow: '0 0 0 2px rgba(99,102,241,0.2)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" fill="white" fillOpacity="0.95"/>
        </svg>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 640 }}>
        <AIMessageContent content={message.aiContent} />
        <div className="text-xs mt-1 pl-1" style={{ color: '#94a3b8' }}>
          {message.timestamp}
        </div>
      </div>
    </div>
  );
}
