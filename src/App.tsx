import { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/SettingsModal';
import { CodeBlock, Message, TracerOutput } from './types';
import { defaultTheme, type Theme } from './data/themes';

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
if (!API_BASE) {
  throw new Error(
    'VITE_API_URL 환경변수가 설정되지 않았습니다. (예: .env에 VITE_API_URL=https://api.example.com)'
  );
}

export const STATUS_MESSAGES = {
  PREPARING_REQUEST: import.meta.env.VITE_STATUS_PREPARING_REQUEST || '요청을 준비하는 중이에요...',
  EXECUTING_TOOL: import.meta.env.VITE_STATUS_EXECUTING_TOOL || '도구를 실행하는 중이에요...',
  ANALYZING_IMAGE: import.meta.env.VITE_STATUS_ANALYZING_IMAGE || '이미지를 분석하는 중이에요...',
  ANALYZING_INPUT: import.meta.env.VITE_STATUS_ANALYZING_INPUT || '입력을 분석하는 중이에요...',
  CLEANING_QUERY: import.meta.env.VITE_STATUS_CLEANING_QUERY || '질문을 정리하는 중이에요...',
  REFINING_QUERY: import.meta.env.VITE_STATUS_REFINING_QUERY || '질문을 더 잘 이해하도록 다듬는 중이에요...',
  IDENTIFYING_INTENT: import.meta.env.VITE_STATUS_IDENTIFYING_INTENT || '질문 의도를 파악하는 중이에요...',
  PREPARING_SOLVER: import.meta.env.VITE_STATUS_PREPARING_SOLVER || '풀이를 준비하는 중이에요...',
  GENERATING_ANSWER: import.meta.env.VITE_STATUS_GENERATING_ANSWER || '답변을 생성하는 중이에요...',
  EMBEDDING_QUERY: import.meta.env.VITE_STATUS_EMBEDDING_QUERY || '질문을 임베딩하는 중이에요...',
  ANALYZING_WEAKNESS: import.meta.env.VITE_STATUS_ANALYZING_WEAKNESS || '약점을 분석하는 중이에요...',
  SELECTING_RECOMMENDATION: import.meta.env.VITE_STATUS_SELECTING_RECOMMENDATION || '추천 문제를 고르는 중이에요...',
  FILTERING_RECOMMENDATION: import.meta.env.VITE_STATUS_FILTERING_RECOMMENDATION || '추천 결과를 필터링하는 중이에요...',
  SEARCHING_PROBLEMS: import.meta.env.VITE_STATUS_SEARCHING_PROBLEMS || '관련 문제를 검색하는 중이에요...',
  SEARCHING_RESOURCES: import.meta.env.VITE_STATUS_SEARCHING_RESOURCES || '관련 기출/자료를 검색하는 중이에요...',
  PREPARING_CURATION: import.meta.env.VITE_STATUS_PREPARING_CURATION || '추천 문제를 분석 중이에요...',
  REFINING_PROBLEMS: import.meta.env.VITE_STATUS_REFINING_PROBLEMS || '문제를 다듬는 중이에요...',
  ORGANIZING_RESULTS: import.meta.env.VITE_STATUS_ORGANIZING_RESULTS || '결과를 보기 좋게 정리하는 중이에요...',
  EXTRACTING_CODE_INPUT: import.meta.env.VITE_STATUS_EXTRACTING_CODE_INPUT || '분석할 코드를 추출하는 중이에요...',
  DETECTING_LANGUAGE: import.meta.env.VITE_STATUS_DETECTING_LANGUAGE || '언어를 감지하는 중이에요...',
  PREPARING_VISUALIZATION: import.meta.env.VITE_STATUS_PREPARING_VISUALIZATION || '시각화 순서를 준비하는 중이에요...',
  ANALYZING_FLOW: import.meta.env.VITE_STATUS_ANALYZING_FLOW || '코드 실행 분석 중이에요...',
  PROCESSING_REQUEST: import.meta.env.VITE_STATUS_PROCESSING_REQUEST || '요청을 처리하는 중이에요...',
  FINISHING: import.meta.env.VITE_STATUS_FINISHING || '마무리하는 중이에요...',
};

export default function App() {
  const [activeNav, setActiveNav] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingStarted, setStreamingStarted] = useState(false);
  const [statusText, setStatusText] = useState<string>('');
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [showSettings, setShowSettings] = useState(false);
  const hasImageRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const humanizeStatus = (data: any): string => {
    const rawMsg = typeof data?.message === 'string' ? data.message : '';
    const rawNode = String(data?.node_name ?? data?.node ?? '');
    const rawStep = String(data?.step_name ?? data?.step ?? '');
    const rawTool = String(data?.tool_name ?? '');
    const hint = `${rawMsg} ${rawNode} ${rawStep} ${rawTool}`.toLowerCase();

    if (rawMsg === 'started') return STATUS_MESSAGES.PREPARING_REQUEST;
    if (rawTool && rawTool !== 'undefined') return `${STATUS_MESSAGES.EXECUTING_TOOL} (${rawTool})`;

    // Workflow nodes (backend/smart_learning_agent/agent.py edges 기준)
    if (hint.includes('image_preprocess')) return hasImageRef.current ? STATUS_MESSAGES.ANALYZING_IMAGE : STATUS_MESSAGES.ANALYZING_INPUT;
    if (hint.includes('query_preprocess')) return STATUS_MESSAGES.CLEANING_QUERY;
    if (hint.includes('query_rewrite')) return STATUS_MESSAGES.REFINING_QUERY;
    if (hint.includes('intent') && hint.includes('class')) return STATUS_MESSAGES.IDENTIFYING_INTENT;
    if (hint.includes('intent_router') || hint.includes('router')) return STATUS_MESSAGES.IDENTIFYING_INTENT;

    if (hint.includes('solver_preprocess')) return STATUS_MESSAGES.PREPARING_SOLVER;
    if (hint.includes('solver_agent') || hint.includes('solver')) return STATUS_MESSAGES.GENERATING_ANSWER;

    if (hint.includes('embed_query')) return STATUS_MESSAGES.EMBEDDING_QUERY;
    if (hint.includes('analyze_weakness')) return STATUS_MESSAGES.ANALYZING_WEAKNESS;
    if (hint.includes('rec_join') || hint.includes('rec_merge')) return STATUS_MESSAGES.SELECTING_RECOMMENDATION;
    if (hint.includes('filter_agent') || hint.includes('filter')) return STATUS_MESSAGES.FILTERING_RECOMMENDATION;
    if (hint.includes('vertex_search')) return STATUS_MESSAGES.SEARCHING_PROBLEMS;
    if (hint.includes('faiss_search') || hint.includes('faiss')) return STATUS_MESSAGES.SEARCHING_RESOURCES;
    if (hint.includes('curator_intro')) return STATUS_MESSAGES.PREPARING_CURATION;
    if (hint.includes('build_curator_output') || hint.includes('curator_output')) return STATUS_MESSAGES.ORGANIZING_RESULTS;
    if (hint.includes('curator_agent')) return STATUS_MESSAGES.PREPARING_CURATION;
    if (hint.includes('question_refine')) return STATUS_MESSAGES.REFINING_PROBLEMS;

    if (hint.includes('prepare_tracer_input')) return STATUS_MESSAGES.PREPARING_VISUALIZATION;
    if (hint.includes('tracer_input')) return STATUS_MESSAGES.EXTRACTING_CODE_INPUT;
    if (hint.includes('language_detect')) return STATUS_MESSAGES.DETECTING_LANGUAGE;
    if (hint.includes('tracer_intro')) return STATUS_MESSAGES.ANALYZING_FLOW;
    if (hint.includes('tracer_agent')) return STATUS_MESSAGES.ANALYZING_FLOW;
    if (hint.includes('fallback')) return STATUS_MESSAGES.PROCESSING_REQUEST;

    if (hint.includes('final') || hint.includes('is_final_response')) return STATUS_MESSAGES.FINISHING;
    return STATUS_MESSAGES.GENERATING_ANSWER;
  };

  const handleSendMessage = async (text: string, image?: File, codeImage?: CodeBlock) => {
    const stamp = () =>
      new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text || undefined,
      codeImage,
      uploadedImageUrl: image ? URL.createObjectURL(image) : undefined,
      timestamp: stamp(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingStarted(false);
    setStatusText(STATUS_MESSAGES.PREPARING_REQUEST);
    hasImageRef.current = !!image;

    try {
      const form = new FormData();
      const queryText = codeImage?.code
        ? `${text}\n\n\`\`\`${codeImage.language || ''}\n${codeImage.code.trim()}\n\`\`\``
        : text;
      form.append('query', queryText);
      form.append('session_id', sessionIdRef.current);
      if (image) form.append('image', image);

      const aiMessageId = `msg-${Date.now()}-ai`;
      let messageCreated = false;

      const res = await fetch(`${API_BASE}/chat/stream`, { method: 'POST', body: form, signal: controller.signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      if (!res.body) {
        throw new Error('스트림 응답(body)이 없습니다.');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      const ensureMessage = () => {
        if (messageCreated) return;
        messageCreated = true;
        setStreamingStarted(true);
        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            role: 'ai' as const,
            aiContent: { badgeType: 'concept' as const, title: '', summary: '', tags: [] },
            timestamp: stamp(),
          },
        ]);
      };

      const applyDelta = (delta: string) => {
        if (!delta) return;
        ensureMessage();
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== aiMessageId) return m;
            const current = m.aiContent?.summary ?? '';
            return {
              ...m,
              aiContent: {
                ...(m.aiContent ?? { badgeType: 'concept', title: '', tags: [], summary: '' }),
                summary: current + delta,
              },
            };
          }),
        );
      };

      const applyFinal = (finalText: string) => {
        ensureMessage();
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== aiMessageId) return m;
            return {
              ...m,
              aiContent: {
                ...(m.aiContent ?? { badgeType: 'concept', title: '', tags: [], summary: '' }),
                summary: finalText || m.aiContent?.summary || '응답을 생성하지 못했습니다.',
              },
            };
          }),
        );
      };

      const updateStatus = (data: any) => {
        const humanized = humanizeStatus(data);
        setStatusText(humanized);
        // 새 노드가 시작될 때 streamingStarted를 리셋해 로딩 말풍선을 즉시 표시
        // (예: tracer_intro_agent 텍스트 스트림 완료 후 tracer_agent 시작 사이의 공백 구간)
        setStreamingStarted(false);
      };

      const handleEvent = (eventName: string, data: any) => {
        // Backend sends {"type":"..."} in data without SSE event: field
        const type = eventName !== 'message' ? eventName : (data?.type ?? eventName);

        if (type === 'status' || type === 'state') { updateStatus(data); return; }
        if (type === 'stream_end') { setStreamingStarted(false); return; }
        if (type === 'chunk') { applyDelta(String(data?.text ?? '')); return; }
        if (type === 'delta') { applyDelta(String(data?.delta ?? '')); return; }
        if (type === 'final') { applyFinal(String(data?.response ?? '')); return; }
        if (type === 'done') { return; }
        if (type === 'curation') {
          const render = () => {
            setStreamingStarted(true);
            setStatusText('');
            const nextCards = Array.isArray(data?.problemCards) ? data.problemCards : [];
            const friendlyEmpty =
              '지금 조건에 맞는 추천 문제가 없어요.\n\n' +
              '- 검색 범위를 넓혀서 다시 요청해보세요 (예: “최근 3개”, “난이도 상관없이”).\n' +
              '- 과목/유형을 조금 바꿔보세요 (예: C 포인터 → 구조체 포인터/이중 포인터).\n' +
              '- 원하시면 제가 비슷한 유형으로 1~3개를 직접 구성해드릴게요.';
            const messageText =
              typeof data?.message === 'string' && data.message.trim().length > 0
                ? data.message
                : nextCards.length === 0
                  ? friendlyEmpty
                  : '';
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${Date.now()}-curation`,
                role: 'ai' as const,
                aiContent: {
                  badgeType: 'curate' as const,
                  title: String(data?.title ?? '맞춤 추천'),
                  summary: messageText,
                  tags: [],
                  problemCards: nextCards,
                },
                timestamp: stamp(),
              },
            ]);
          };
          render();
          return;
        }
        if (type === 'tracer') {
          const render = () => {
            setStreamingStarted(true);
            setStatusText('');
            setMessages((prev) => [
              ...prev,
              {
                id: `msg-${Date.now()}-tracer`,
                role: 'ai',
                tracerOutput: data?.data as TracerOutput,
                timestamp: stamp(),
              },
            ]);
          };
          render();
          return;
        }
        if (type === 'error') {
          const errorText = String(data?.message ?? '알 수 없는 오류가 발생했습니다.');
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}-error`,
              role: 'ai' as const,
              aiContent: {
                badgeType: 'debug' as const,
                title: '오류',
                summary: errorText,
                tags: [],
              },
              timestamp: stamp(),
            },
          ]);
          return;
        }
      };

      const parseAndHandle = (raw: string) => {
        // SSE event block: lines separated by \n, blocks separated by \n\n
        const lines = raw.split('\n');
        let eventName = 'message';
        const dataLines: string[] = [];
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventName = line.slice('event:'.length).trim() || 'message';
          } else if (line.startsWith('data:')) {
            dataLines.push(line.slice('data:'.length).trimStart());
          }
        }
        const dataText = dataLines.join('\n');
        let data: any = dataText;
        try {
          data = dataText ? JSON.parse(dataText) : {};
        } catch {
          // ignore json parse error; treat as string
        }
        handleEvent(eventName, data);
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // 마지막 블록이 구분자 없이 끝나는 경우를 대비해 잔여 버퍼도 처리
          if (buffer.trim().length > 0) {
            parseAndHandle(buffer);
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });
        // 브라우저/프록시 환경별 CRLF 차이를 흡수해 블록 경계를 안정적으로 파싱
        buffer = buffer.replace(/\r\n/g, '\n');

        let idx: number;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const block = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          if (block.trim().length === 0) continue;
          parseAndHandle(block);
        }
      }
    } catch (err: any) {
      if (controller.signal.aborted || err?.name === 'AbortError') {
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          role: 'ai',
          aiContent: {
            badgeType: 'concept',
            title: '오류',
            summary: '서버에 연결하지 못했습니다. 백엔드가 실행 중인지 확인해주세요.',
            tags: [],
          },
          timestamp: stamp(),
        },
      ]);
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setIsLoading(false);
        setStreamingStarted(false);
        setStatusText('');
      }
    }
  };

  const handleNewChat = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    sessionIdRef.current = crypto.randomUUID();
    setMessages([]);
    setIsLoading(false);
    setStreamingStarted(false);
    setStatusText('');
    hasImageRef.current = false;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeItem={activeNav}
        onItemClick={setActiveNav}
        theme={theme}
        onOpenSettings={() => setShowSettings(true)}
      />
      {showSettings && (
        <SettingsModal
          currentThemeId={theme.id}
          onSelect={(t) => setTheme(t)}
          onClose={() => setShowSettings(false)}
        />
      )}
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        isLoading={isLoading}
        streamingStarted={streamingStarted}
        statusText={statusText}
        theme={theme}
      />
    </div>
  );
}
