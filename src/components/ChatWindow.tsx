import { useRef, useEffect } from 'react';
import { Plus, BookOpen, GitBranch, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import CodeSnippetWindow from './CodeSnippetWindow';
import InputArea from './InputArea';
import { CodeBlock, Message } from '../types';
import { type Theme } from '../data/themes';
import { STATUS_MESSAGES } from '../App';

const SAMPLE_QUESTIONS = [
  {
    icon: BookOpen,
    text: 'OSI 7계층이 뭔지 설명해줘',
    sendText: 'OSI 7계층이 뭔지 설명해줘',
    gradient: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
    iconBg: '#2563eb',
  },
  {
    icon: Sparkles,
    text: 'C언어 이중 포인터 관련 문제 찾아줘',
    sendText: 'C언어 이중 포인터 관련 문제 찾아줘',
    gradient: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    iconBg: '#7c3aed',
  },
  {
    icon: GitBranch,
    text: '아래 코드 실행 순서 알려줘',
    sendText: '아래 코드 실행 순서 알려줘',
    codeImage: {
      language: 'java',
      filename: 'Main.java',
      code: `class Parent {
  Parent() {
    System.out.println("Parent()");
  }

  void hello() {
    System.out.println("Parent.hello()");
  }
}

class Child extends Parent {
  Child() {
    System.out.println("Child()");
  }

  @Override
  void hello() {
    System.out.println("Child.hello()");
  }
}

public class Main {
  public static void main(String[] args) {
    Parent p = new Child();
    p.hello();
  }
}
`,
    } satisfies CodeBlock,
    gradient: 'linear-gradient(135deg, #ecfeff, #cffafe)',
    iconBg: '#0891b2',
  },
];

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string, image?: File, codeImage?: CodeBlock) => void;
  onNewChat?: () => void;
  isLoading?: boolean;
  streamingStarted?: boolean;
  statusText?: string;
  theme: Theme;
}

export default function ChatWindow({
  messages,
  onSendMessage,
  onNewChat,
  isLoading = false,
  streamingStarted = false,
  statusText,
  theme,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, streamingStarted, statusText]);

  return (
    <div className="flex flex-col h-screen flex-1 overflow-hidden" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div
        className="flex items-center justify-end px-6 py-3 flex-shrink-0"
        style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}
      >
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
          style={{
            background: theme.gradient,
            color: '#ffffff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          새 대화
        </button>
      </div>


      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              <BookOpen size={26} color="#fff" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#1e293b' }}>
              정보처리기사 AI 튜터
            </h2>
            <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>
              무엇이든 물어보세요. 개념·코드·문제 풀이까지 도와드려요.
            </p>
            <div className="w-full max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Left: 2 stacked text samples */}
                <div className="md:col-span-1 flex flex-col gap-3 h-full">
                  {SAMPLE_QUESTIONS.slice(0, 2).map(({ icon: Icon, text, sendText, codeImage, gradient, iconBg }) => (
                    <button
                      key={text}
                      onClick={() => onSendMessage(sendText, undefined, codeImage)}
                      className="w-full flex-1 flex flex-col justify-between gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                      style={{
                        background: gradient,
                        border: '1.5px solid transparent',
                        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.11)';
                        el.style.transform = 'translateY(-3px)';
                        el.style.borderColor = iconBg + '55';
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
                        el.style.transform = 'translateY(0)';
                        el.style.borderColor = 'transparent';
                      }}
                    >
                      <div className="flex-1 flex items-center">
                        <p className="text-sm font-semibold leading-snug" style={{ color: '#1e293b' }}>{text}</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center self-end"
                        style={{ background: iconBg }}
                      >
                        <Icon size={15} color="#fff" strokeWidth={2} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: code sample card */}
                {SAMPLE_QUESTIONS.slice(2, 3).map(({ icon: Icon, text, sendText, codeImage, gradient, iconBg }) => (
                  <button
                    key={text}
                    onClick={() => onSendMessage(sendText, undefined, codeImage)}
                    className="md:col-span-2 w-full h-full flex flex-col justify-between gap-4 p-4 rounded-2xl text-left transition-all duration-200"
                    style={{
                      background: gradient,
                      border: '1.5px solid transparent',
                      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.boxShadow = '0 6px 24px rgba(0,0,0,0.11)';
                      el.style.transform = 'translateY(-3px)';
                      el.style.borderColor = iconBg + '55';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
                      el.style.transform = 'translateY(0)';
                      el.style.borderColor = 'transparent';
                    }}
                  >
                    <div className="flex flex-col gap-3">
                      <p className="text-sm font-semibold leading-snug" style={{ color: '#1e293b' }}>{text}</p>
                      {codeImage?.code?.trim() && (
                        <CodeSnippetWindow
                          code={codeImage.code}
                          language={codeImage.language || 'text'}
                          title={codeImage.filename || 'code'}
                          maxHeight={190}
                          className="shadow-none w-full"
                        />
                      )}
                    </div>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center self-end"
                      style={{ background: iconBg }}
                    >
                      <Icon size={15} color="#fff" strokeWidth={2} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {/* 로딩 말풍선: 스트리밍 시작 전 또는 스트리밍 중이라도 특별한 상태 메시지가 있는 경우에만 표시 */}
        {isLoading && (!streamingStarted || (statusText && statusText !== STATUS_MESSAGES.GENERATING_ANSWER)) && (
          <div className="flex items-start gap-2 mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2.5" style={{ background: '#ffffff', border: '1px solid #f1f5f9' }}>
              <div className="flex gap-1.5 items-end">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-big-bounce"
                    style={{ background: '#a78bfa', animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
              {statusText?.trim() && (
                <span className="text-xs font-medium" style={{ color: '#1e293b' }}>{statusText}</span>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea onSend={onSendMessage} isLoading={isLoading} theme={theme} />
    </div>
  );
}
