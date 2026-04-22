export type MessageRole = 'user' | 'ai';
export type BadgeType = 'concept' | 'debug' | 'recommend' | 'curate' | 'trace';
export type TagVariant = 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red';

/** `data/정보처리기사_실기_기출문제.jsonl` 기반 기출 카드 (목 응답용) */
export type ProblemCardAccent = 'violet' | 'cyan' | 'amber' | 'rose';

export interface ExamProblemCard {
  /** jsonl `id` (예: 2024_03_16) */
  problemId: string;
  year: number;
  round: number;
  questionNumber: number;
  examTitle: string;
  stemPreview: string;
  officialAnswer?: string;
  /** 카드 상단 작은 라벨 (매칭 이유 등) */
  matchLabel: string;
  accent: ProblemCardAccent;

  /** --- 확장 상세 정보 (백엔드 curation 이벤트에서 내려올 수 있음) --- */
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  similarityScore?: number;
  question?: string;
  code?: string | null;
  codeLanguage?: string | null;
  answer?: string;
  explanation?: string;
}

export interface Tag {
  label: string;
  variant: TagVariant;
}

export interface ContentSection {
  heading: string;
  items?: string[];
  content?: string;
}

export interface CodeBlock {
  language: string;
  filename?: string;
  code: string;
}

export interface AIContent {
  badgeType: BadgeType;
  title: string;
  summary: string;
  sections?: ContentSection[];
  codeBlock?: CodeBlock;
  /** 정보처리기사 실기 기출 — 카드형 추천 */
  problemCards?: ExamProblemCard[];
  dataSourceNote?: string;
  tags: Tag[];
}

export interface ConceptImageData {
  letter: string;
  letterColor: string;
  bgColor: string;
}

// --- Tracer types (mirrors backend schemas/tracer.py) ---
export interface MemoryCell {
  address: string;
  value: unknown;
  type: string;
  points_to: string;
}

export interface HeapObject {
  id: string;
  class_name: string;
  fields: Record<string, unknown>;
}

export interface ExecutionStep {
  step: number;
  line: number;
  code: string;
  variables: Record<string, unknown>;
  memory: MemoryCell[];
  heap: HeapObject[];
  call_stack: string[];
  changed_vars: string[];
  note: string;
}

export interface TracerOutput {
  language: 'c' | 'java' | 'python';
  original_code: string;
  steps: ExecutionStep[];
  title: string;
  final_output: string;
  summary: string;
}
// --- End Tracer types ---

export interface Message {
  id: string;
  role: MessageRole;
  text?: string;
  conceptImage?: ConceptImageData;
  codeImage?: CodeBlock;
  uploadedImageUrl?: string;
  aiContent?: AIContent;
  tracerOutput?: TracerOutput;
  timestamp: string;
}
