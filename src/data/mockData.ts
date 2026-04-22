import { Message } from '../types';

/**
 * 데모 시나리오: 사용자가 C 이중 포인터를 물으면
 * `data/정보처리기사_실기_기출문제.jsonl`에 대응하는 기출을 세로 카드 목록으로 보여 줍니다.
 */
export const mockMessages: Message[] = [
  {
    id: 'm1',
    role: 'user',
    text: 'C언어 이중 포인터 문제 나온 기출 좀 알려줘.',
    timestamp: '오전 10:12',
  },
  {
    id: 'm2',
    role: 'ai',
    aiContent: {
      badgeType: 'curate',
      title: '이중 포인터와 닮은 실기 문항',
      summary:
        'int**, **pp, **parr처럼 이중 간접 참조가 나오는 흐름을 기준으로, 실기·복원 기출에서 연습하기 좋은 문항만 골라 두었어요. 스포일러 없이 지문만 보여 드릴게요.',
      dataSourceNote: '데이터: 정보처리기사 실기 기출 모음(jsonl)과 같은 연도·회차·문항 번호예요.',
      problemCards: [
        {
          problemId: '2024_03_16',
          year: 2024,
          round: 3,
          questionNumber: 16,
          examTitle: '[2024년 3회] 정보처리기사 실기 복원 문제',
          stemPreview:
            '16. 다음은 C언어에 대한 문제이다. 아래 코드를 확인하여 알맞는 출력값을 작성하시오.\nvoid func(int** arr, int size) … int** pp = &p; …',
          matchLabel: 'int** 직결',
          accent: 'violet',
        },
        {
          problemId: '2025_02_14',
          year: 2025,
          round: 2,
          questionNumber: 14,
          examTitle: '[2025년 2회] 정보처리기사 실기 복원 문제',
          stemPreview:
            '14. 다음은 C언어의 문제이다. … struct dat** pptr = &ptr; (*pptr)[1] = (*pptr)[2]; …',
          matchLabel: '구조체 **',
          accent: 'rose',
        },
        {
          problemId: '2021_03_12',
          year: 2021,
          round: 3,
          questionNumber: 12,
          examTitle: '[2021년 3회] 정보처리기사 실기 기출문제',
          stemPreview:
            '12. 다음 C언어에 대한 알맞는 출력값을 쓰시오.\nint *arr[3]; … printf("%d\\n", *arr[1] + **arr + 1);',
          matchLabel: '**arr 패턴',
          accent: 'cyan',
        },
        {
          problemId: '2024_02_13',
          year: 2024,
          round: 2,
          questionNumber: 13,
          examTitle: '[2024년 2회] 정보처리기사 실기 복원 문제',
          stemPreview:
            '13. 다음은 C언어에 대한 문제이다. … int* parr[2] = {arr[1], arr[2]}; … + **parr',
          matchLabel: '**parr / 배열',
          accent: 'amber',
        },
      ],
      tags: [
        { label: '#정보처리기사', variant: 'blue' },
        { label: '#실기기출', variant: 'green' },
        { label: '#C언어', variant: 'orange' },
        { label: '#이중포인터', variant: 'purple' },
      ],
    },
    timestamp: '오전 10:12',
  },
];
