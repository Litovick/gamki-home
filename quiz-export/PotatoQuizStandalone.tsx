import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ExternalLink,
  Home,
  Link2,
  RotateCcw,
  X,
} from 'lucide-react';

/**
 * 감자 키우기 — "나는 어떤 감자일까?" 감자 유형 테스트 (단일 파일 독립 버전)
 *
 * 사용 방법:
 * 1) public 폴더에 아래 5개 이미지 파일을 배치하세요.
 *    - calm potato.png
 *    - cheerful potato.png
 *    - searching potato.png
 *    - creative potato.png
 *    - dependable potato.png
 * 2) React + Tailwind 프로젝트에 이 파일 하나만 복사한 뒤 `<PotatoQuizStandalone />`로 렌더링하세요.
 *    (필요 시 `onGoHome`, `appUrl`, `imageBasePath` props를 전달할 수 있습니다.)
 */

export type PotatoTypeId =
  | 'calm'
  | 'cheerful'
  | 'searching'
  | 'creative'
  | 'dependable';

export interface QuizChoice {
  readonly text: string;
  readonly type: PotatoTypeId;
}

export interface QuizQuestion {
  readonly id: number;
  readonly question: string;
  readonly choices: readonly QuizChoice[];
}

export interface PotatoResultProfile {
  readonly id: PotatoTypeId;
  readonly name: string;
  readonly imageFile: string;
  readonly oneLiner: string;
  readonly traits: readonly [string, string, string];
  readonly partnerId: PotatoTypeId;
  readonly partnerName: string;
  readonly badgeBg: string;
  readonly stageBg: string;
}

export interface PotatoQuizStandaloneProps {
  /** 기존 홈페이지로 돌아가기 버튼 클릭 핸들러 (미전달 시 인트로 화면으로 이동) */
  onGoHome?: () => void;
  /** 결과 화면 하단 CTA의 실제 앱 주소 */
  appUrl?: string;
  /** 5종 감자 PNG가 위치한 기본 경로 (기본값: '') */
  imageBasePath?: string;
  /** 주소창 해시(#quiz, #quiz/result=calm) 자동 동기화 여부 (기본값: true) */
  syncUrlHash?: boolean;
}

type QuizStage = 'intro' | 'play' | 'loading' | 'result';

const DEFAULT_APP_URL = 'https://gamja-kiugi.vercel.app/';
const POINTS_PER_CHOICE = 2;
const CIRCLED_NUMBERS = ['①', '②', '③'] as const;

export const POTATO_TYPE_ORDER: readonly PotatoTypeId[] = [
  'calm',
  'cheerful',
  'searching',
  'creative',
  'dependable',
] as const;

export const POTATO_RESULTS: Record<PotatoTypeId, PotatoResultProfile> = {
  calm: {
    id: 'calm',
    name: '차분한 감자',
    imageFile: 'calm%20potato.png',
    oneLiner: '신중하고 꼼꼼하게 생각한 뒤 움직이는 유형',
    traits: [
      '결정 전 조건과 디테일을 빠짐없이 체크함',
      '급한 상황에서도 중심을 잡아주는 팀의 브레이크',
      '나만의 페이스로 알짜 경험을 차곡차곡 쌓음',
    ],
    partnerId: 'cheerful',
    partnerName: '활발한 감자',
    badgeBg: '#E9F3DF',
    stageBg: '#F1F7EA',
  },
  cheerful: {
    id: 'cheerful',
    name: '활발한 감자',
    imageFile: 'cheerful%20potato.png',
    oneLiner: '에너지가 넘치고 사람들과 어울리는 걸 좋아하는 유형',
    traits: [
      '어색한 첫 조별과제 분위기를 5분 만에 녹임',
      '서포터즈·축제·대외활동 현장에서 에너지를 얻음',
      '사람들과 부딪히며 새로운 기회를 가장 먼저 발견함',
    ],
    partnerId: 'calm',
    partnerName: '차분한 감자',
    badgeBg: '#FFF2CC',
    stageBg: '#FFF9E6',
  },
  searching: {
    id: 'searching',
    name: '탐구하는 감자',
    imageFile: 'searching%20potato.png',
    oneLiner: '궁금한 걸 깊이 파고들고 새로운 지식을 찾는 유형',
    traits: [
      '관심 분야가 생기면 레퍼런스부터 끝까지 파고듦',
      '근거와 논리가 탄탄한 자료 조사 능력자',
      '숨겨진 공고나 알짜 정보를 남들보다 빠르게 찾아냄',
    ],
    partnerId: 'creative',
    partnerName: '창의적인 감자',
    badgeBg: '#E6F1F8',
    stageBg: '#F1F7FB',
  },
  creative: {
    id: 'creative',
    name: '창의적인 감자',
    imageFile: 'creative%20potato.png',
    oneLiner: '남다른 아이디어와 표현으로 새로운 걸 만드는 유형',
    traits: [
      '뻔한 과제 주제도 색다른 컨셉으로 뒤집어 버림',
      '발표 자료나 결과물에 자기만의 감각을 담아냄',
      '"없으면 만들지 뭐!" 실행력으로 새 프로젝트를 엶',
    ],
    partnerId: 'dependable',
    partnerName: '든든한 감자',
    badgeBg: '#F1EBFF',
    stageBg: '#F7F3FF',
  },
  dependable: {
    id: 'dependable',
    name: '든든한 감자',
    imageFile: 'dependable%20potato.png',
    oneLiner: '책임감 있고 꾸준하게 맡은 일을 해내는 유형',
    traits: [
      '마감일과 체크리스트는 절대 놓치지 않는 일정 마스터',
      '맡은 일은 끝까지 마무리해 팀원들의 신뢰 1순위',
      '학년별 할 일을 하나씩 채워 이력서를 완성하는 성실파',
    ],
    partnerId: 'creative',
    partnerName: '창의적인 감자',
    badgeBg: '#F8ECD8',
    stageBg: '#FDF6EA',
  },
};

export const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    id: 1,
    question: '새 학기 첫 조별과제 단톡방, 내가 가장 먼저 하는 행동은?',
    choices: [
      {
        text: '모두의 의견을 다 들어본 뒤 빠진 부분만 조용히 짚어준다',
        type: 'calm',
      },
      {
        text: '"안녕하세요!! 오늘 점심 같이 드실 분?" 분위기부터 띄운다',
        type: 'cheerful',
      },
      {
        text: '주제와 관련된 자료·레퍼런스 링크를 먼저 찾아 모아둔다',
        type: 'searching',
      },
      {
        text: '남들 다 하는 뻔한 PPT 말고 색다른 발표 컨셉을 던져본다',
        type: 'creative',
      },
      {
        text: '회의 일정표랑 역할 분담 체크리스트부터 정리해 올린다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 2,
    question: '수업 사이 공강이 3시간이나 생겼다! 나의 선택은?',
    choices: [
      {
        text: '조용한 카페 구석에서 따뜻한 차 마시며 밀린 생각을 정리한다',
        type: 'calm',
      },
      {
        text: '공강 겹치는 친구들한테 바로 연락해서 같이 밥 먹고 수다 떤다',
        type: 'cheerful',
      },
      {
        text: '도서관이나 유튜브에서 요즘 꽂힌 분야를 끝까지 파고든다',
        type: 'searching',
      },
      {
        text: '문득 떠오른 아이디어를 메모장이나 노트에 끄적이며 구상한다',
        type: 'creative',
      },
      {
        text: '이번 주 할 일 목록을 꺼내서 과제 하나를 미리 끝내버린다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 3,
    question: '"춘천에는 할 게 없다"는 친구의 말에 내 속마음은?',
    choices: [
      {
        text: "'일단 내가 뭘 하고 싶은지부터 차근차근 정리해 봐야겠는데'",
        type: 'calm',
      },
      {
        text: "'에이, 동아리나 축제 서포터즈 같이 해보면 재밌을 텐데!'",
        type: 'cheerful',
      },
      {
        text: "'진짜 없나? 온라인이랑 지역 공고부터 싹 다 검색해 봐야지'",
        type: 'searching',
      },
      {
        text: "'없으면 우리가 재밌는 프로젝트 하나 만들어 버리면 되지!'",
        type: 'creative',
      },
      {
        text: "'지금 학년에 꼭 해야 할 것부터 하나씩 챙겨 두는 게 먼저야'",
        type: 'dependable',
      },
    ],
  },
  {
    id: 4,
    question: '마음에 드는 공모전 공고를 발견했을 때 나는?',
    choices: [
      {
        text: '자격 요건, 심사 기준, 마감일까지 꼼꼼히 읽고 지원 여부를 결정한다',
        type: 'calm',
      },
      {
        text: '같이 나갈 팀원부터 신나게 모집해서 브레인스토밍을 시작한다',
        type: 'cheerful',
      },
      {
        text: '역대 수상작들을 전부 찾아보며 어떤 포인트가 먹히는지 분석한다',
        type: 'searching',
      },
      {
        text: '공고 주제를 보자마자 머릿속에 떠오르는 독특한 기획안부터 적는다',
        type: 'creative',
      },
      {
        text: '마감일까지 역산해서 주차별 작업 스케줄표부터 짠다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 5,
    question: '발표 하루 전, 갑자기 기획 일부를 수정해야 한다면?',
    choices: [
      {
        text: '당황하지 않고 침착하게 어디부터 고쳐야 안전할지 우선순위를 정한다',
        type: 'calm',
      },
      {
        text: '"우리 할 수 있어!" 지친 팀원들 텐션을 끌어올리며 함께 해결한다',
        type: 'cheerful',
      },
      {
        text: '왜 문제가 생겼는지 원인을 정확히 파악해서 논리적인 대안을 찾는다',
        type: 'searching',
      },
      {
        text: '위기를 기회로 삼아 아예 더 임팩트 있는 반전 아이디어를 낸다',
        type: 'creative',
      },
      {
        text: '밤을 새우더라도 맡은 파트는 완성도 있게 끝까지 책임지고 마감한다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 6,
    question: '축제 부스나 학과 행사를 준비할 때 맡고 싶은 역할은?',
    choices: [
      {
        text: '전체 동선과 안전, 예산 등을 꼼꼼하게 점검하는 운영 매니저',
        type: 'calm',
      },
      {
        text: '부스 앞에서 지나가는 사람들 시선을 끄는 홍보·MC 담당',
        type: 'cheerful',
      },
      {
        text: '사람들이 뭘 좋아하는지 사전 설문과 트렌드를 조사하는 리서처',
        type: 'searching',
      },
      {
        text: '포스터, 굿즈, 부스 컨셉을 톡톡 튀게 꾸미는 아트·기획 디렉터',
        type: 'creative',
      },
      {
        text: '물품 발주부터 당일 타임테이블까지 빈틈없이 챙기는 총괄 팀장',
        type: 'dependable',
      },
    ],
  },
  {
    id: 7,
    question: '나만의 스펙과 이력서를 채워가는 스타일은?',
    choices: [
      {
        text: '남들 속도 신경 쓰지 않고 내 페이스로 신중하게 알짜배기만 고른다',
        type: 'calm',
      },
      {
        text: '다양한 대외활동과 네트워킹으로 사람들과 부딪히며 경험을 쌓는다',
        type: 'cheerful',
      },
      {
        text: '관심 직무와 전공 지식을 깊이 파서 전문성 있는 기록을 남긴다',
        type: 'searching',
      },
      {
        text: '나만의 색깔이 드러나는 포트폴리오와 독창적인 결과물로 승부한다',
        type: 'creative',
      },
      {
        text: '1학년부터 4학년까지 학년별 할 일을 빠짐없이 성실하게 쌓아간다',
        type: 'dependable',
      },
    ],
  },
  {
    id: 8,
    question: '졸업할 때 내 감자가 어떤 모습이었으면 좋겠어?',
    choices: [
      {
        text: '흔들리지 않는 단단한 내면을 가진 여유로운 감자',
        type: 'calm',
      },
      {
        text: '어디서든 사랑받고 좋은 인연이 가득한 인싸 감자',
        type: 'cheerful',
      },
      {
        text: '자기 분야에 대해서라면 누구보다 잘 아는 박학다식 감자',
        type: 'searching',
      },
      {
        text: '세상에 없던 나만의 무기를 만들어낸 반짝이는 감자',
        type: 'creative',
      },
      {
        text: '어떤 자리든 믿고 맡길 수 있는 프로페셔널한 감자',
        type: 'dependable',
      },
    ],
  },
];

function isPotatoTypeId(value: string | null | undefined): value is PotatoTypeId {
  if (!value) return false;
  return (POTATO_TYPE_ORDER as readonly string[]).includes(value);
}

function calculateQuizResult(
  answers: readonly (PotatoTypeId | null | undefined)[]
): PotatoTypeId {
  const scores: Record<PotatoTypeId, number> = {
    calm: 0,
    cheerful: 0,
    searching: 0,
    creative: 0,
    dependable: 0,
  };
  const lastPickedIndex: Record<PotatoTypeId, number> = {
    calm: -1,
    cheerful: -1,
    searching: -1,
    creative: -1,
    dependable: -1,
  };

  answers.forEach((answer, index) => {
    if (answer && isPotatoTypeId(answer)) {
      scores[answer] += POINTS_PER_CHOICE;
      lastPickedIndex[answer] = index;
    }
  });

  let winner: PotatoTypeId = POTATO_TYPE_ORDER[0];
  let maxScore = -1;
  let winnerLastIndex = -1;

  for (const type of POTATO_TYPE_ORDER) {
    if (
      scores[type] > maxScore ||
      (scores[type] === maxScore && lastPickedIndex[type] > winnerLastIndex)
    ) {
      maxScore = scores[type];
      winnerLastIndex = lastPickedIndex[type];
      winner = type;
    }
  }

  return winner;
}

function readResultTypeFromUrl(): PotatoTypeId | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash.trim().replace(/^#/, '');
  const hashMatch = hash.match(/^(?:quiz\/)?result=([a-z]+)$/i);
  if (hashMatch) {
    const candidate = hashMatch[1].toLowerCase();
    return isPotatoTypeId(candidate) ? candidate : null;
  }

  const params = new URLSearchParams(window.location.search);
  const queryResult = params.get('result')?.toLowerCase() ?? null;
  return isPotatoTypeId(queryResult) ? queryResult : null;
}

function MiniTrackPotatoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="w-8 h-8 shrink-0"
    >
      <path
        d="M48 32 C66 32 82 48 84 65 C85 78 74 88 52 88 C30 88 17 83 17 67 C17 48 30 32 48 32 Z"
        fill="#CFA75C"
        stroke="#3A2A20"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <ellipse
        cx="73"
        cy="69"
        rx="3.2"
        ry="4.5"
        transform="rotate(28 73 69)"
        fill="#3A2A20"
      />
      <ellipse
        cx="64"
        cy="77"
        rx="2.6"
        ry="3.8"
        transform="rotate(38 64 77)"
        fill="#3A2A20"
      />
      <path
        d="M50 32 C50 25 50 22 50 18"
        stroke="#628E4C"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 19 C44 11 33 10 32 17 C31 23 42 24 50 19 Z"
        fill="#C6EA9F"
        stroke="#628E4C"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M50 19 C56 11 67 10 68 17 C69 23 58 24 50 19 Z"
        fill="#C6EA9F"
        stroke="#628E4C"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STANDALONE_ANIMATION_CSS = `
@keyframes pq-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
@keyframes pq-dig-wobble {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  20% { transform: translateY(-8px) rotate(-6deg) scale(1.04, 0.96); }
  45% { transform: translateY(2px) rotate(5deg) scale(0.97, 1.04); }
  70% { transform: translateY(-6px) rotate(-4deg) scale(1.03, 0.98); }
}
@keyframes pq-result-pop {
  0% { opacity: 0; transform: scale(0.65) translateY(16px); }
  55% { opacity: 1; transform: scale(1.08) translateY(-6px); }
  78% { transform: scale(0.96) translateY(2px); }
  100% { opacity: 1; transform: scale(1) translateY(0px); }
}
@keyframes pq-step-in {
  from { opacity: 0; transform: translate3d(0, 10px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
.pq-float { animation: pq-float 2.8s ease-in-out infinite; }
.pq-dig-wobble { animation: pq-dig-wobble 0.65s ease-in-out infinite; }
.pq-result-pop { animation: pq-result-pop 0.58s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
.pq-step-in { animation: pq-step-in 280ms cubic-bezier(0.22, 1, 0.36, 1); }
@media (prefers-reduced-motion: reduce) {
  .pq-float, .pq-dig-wobble, .pq-result-pop, .pq-step-in { animation: none !important; }
}
`;

export function PotatoQuizStandalone({
  onGoHome,
  appUrl = DEFAULT_APP_URL,
  imageBasePath = '',
  syncUrlHash = true,
}: PotatoQuizStandaloneProps) {
  const initialFromUrl = syncUrlHash ? readResultTypeFromUrl() : null;
  const [stage, setStage] = useState<QuizStage>(
    initialFromUrl ? 'result' : 'intro'
  );
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(PotatoTypeId | null)[]>(() =>
    Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [selectedFlashIdx, setSelectedFlashIdx] = useState<number | null>(null);
  const [resultType, setResultType] = useState<PotatoTypeId | null>(
    initialFromUrl
  );
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [dexOpen, setDexOpen] = useState<boolean>(false);
  const [copyToastVisible, setCopyToastVisible] = useState<boolean>(false);

  const transitionTimerRef = useRef<number | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const normalizedBase = imageBasePath.replace(/\/$/, '');
  const getImageSrc = (file: string) => `${normalizedBase}/${file}`;

  useEffect(() => {
    if (!syncUrlHash) return;
    const onHashChange = () => {
      const next = readResultTypeFromUrl();
      if (next) {
        setResultType(next);
        setStage('result');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [syncUrlHash]);

  useEffect(() => {
    if (stage !== 'intro') return;
    const intervalId = window.setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % POTATO_TYPE_ORDER.length);
    }, 1800);
    return () => window.clearInterval(intervalId);
  }, [stage]);

  useEffect(() => {
    if (!dexOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDexOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dexOpen]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
      if (loadingTimerRef.current) window.clearTimeout(loadingTimerRef.current);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const clearTimers = () => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  };

  const syncHash = (type: PotatoTypeId | null) => {
    if (!syncUrlHash || typeof window === 'undefined') return;
    const nextHash = type ? `#quiz/result=${type}` : '#quiz';
    window.history.replaceState(null, '', `${window.location.pathname}${nextHash}`);
  };

  const handleStartQuiz = () => {
    clearTimers();
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setQuestionIndex(0);
    setSelectedFlashIdx(null);
    setResultType(null);
    setStage('play');
    syncHash(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSelectChoice = (choiceType: PotatoTypeId, choiceIdx: number) => {
    if (selectedFlashIdx !== null) return;

    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = choiceType;
    setAnswers(nextAnswers);
    setSelectedFlashIdx(choiceIdx);

    transitionTimerRef.current = window.setTimeout(() => {
      setSelectedFlashIdx(null);
      if (questionIndex < QUIZ_QUESTIONS.length - 1) {
        setQuestionIndex((prev) => prev + 1);
        return;
      }

      const winner = calculateQuizResult(nextAnswers);
      setStage('loading');
      window.scrollTo({ top: 0, behavior: 'auto' });

      loadingTimerRef.current = window.setTimeout(() => {
        setResultType(winner);
        setStage('result');
        syncHash(winner);
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 1200);
    }, 170);
  };

  const handlePrevQuestion = () => {
    if (selectedFlashIdx !== null) return;
    if (questionIndex === 0) {
      setStage('intro');
      return;
    }
    setQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleReturnHome = () => {
    clearTimers();
    if (onGoHome) {
      onGoHome();
      return;
    }
    setStage('intro');
    setResultType(null);
    syncHash(null);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleCopyResultLink = async () => {
    if (!resultType) return;
    const cleanOrigin = window.location.origin.replace(/\/$/, '');
    const shareUrl = `${cleanOrigin}${window.location.pathname}#quiz/result=${resultType}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // 클립보드 권한 제한 시 무시
    }
    setCopyToastVisible(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setCopyToastVisible(false), 2400);
  };

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];
  const currentResult = resultType ? POTATO_RESULTS[resultType] : null;
  const partnerProfile = currentResult
    ? POTATO_RESULTS[currentResult.partnerId]
    : null;
  const progressPercent = Math.round(
    ((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100
  );
  const trackRatio =
    QUIZ_QUESTIONS.length > 1 ? questionIndex / (QUIZ_QUESTIONS.length - 1) : 1;

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#3A2A20] flex flex-col">
      <style>{STANDALONE_ANIMATION_CSS}</style>

      {/* 상단 고정 헤더 */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/94 backdrop-blur-md border-b-2 border-[#3A2A20]/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReturnHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE7D5] border-2 border-[#3A2A20]/30 hover:border-[#3A2A20] text-sm font-display text-[#3A2A20] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>홈으로 돌아가기</span>
          </button>

          <span className="font-display text-base sm:text-lg text-[#3D7D47] truncate">
            감자 유형 테스트
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* 1) 인트로 */}
        {stage === 'intro' && (
          <section className="pq-step-in rounded-[30px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20] px-5 py-8 sm:px-10 sm:py-10 text-center space-y-7">
            <div className="space-y-2.5">
              <p className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#E9F3DF] border border-[#3D7D47]/30 text-xs font-medium text-[#2F6B38]">
                감자 키우기 미니 테스트 · 8문항
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-[#3A2A20] leading-tight">
                나는 어떤 감자일까?
              </h1>
              <p className="text-base sm:text-lg text-[#1F1712] leading-relaxed">
                춘천 캠퍼스 생활로 알아보는 나의 감자 유형 테스트
              </p>
            </div>

            <div className="rounded-3xl bg-[#F4F8EC] border-2 border-[#3A2A20]/15 px-3 py-6 sm:px-6 sm:py-7 space-y-4">
              <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end max-w-xl mx-auto">
                {POTATO_TYPE_ORDER.map((typeId, idx) => {
                  const profile = POTATO_RESULTS[typeId];
                  const isSpotlit = spotlightIndex === idx;
                  return (
                    <div key={typeId} className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl p-1 transition-all duration-300 pq-float ${
                          isSpotlit
                            ? 'scale-105 sm:scale-110 bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20]'
                            : 'scale-95 opacity-85'
                        }`}
                        style={{ animationDelay: `${idx * 240}ms` }}
                      >
                        <img
                          src={getImageSrc(profile.imageFile)}
                          alt={profile.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span
                        className={`text-xs font-display transition-colors duration-300 whitespace-nowrap ${
                          isSpotlit ? 'text-[#3D7D47]' : 'text-[#332720]'
                        }`}
                      >
                        {profile.name.replace(' 감자', '')}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs sm:text-sm text-[#332720]">
                차분 · 활발 · 탐구 · 창의 · 든든 중 나는 어떤 캠퍼스 감자일까요?
              </p>
            </div>

            <div className="pt-1 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleStartQuiz}
                className="w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-xl border-2 border-[#3A2A20] shadow-[0_5px_0_#3A2A20] transition-all cursor-pointer"
              >
                내 감자 캐러 가기
              </button>
              <button
                type="button"
                onClick={() => setDexOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-display text-[#3D7D47] hover:text-[#2C6134] underline underline-offset-4 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>5종 감자 먼저 구경하기</span>
              </button>
            </div>
          </section>
        )}

        {/* 2) 퀴즈 진행 (1~8문항) */}
        {stage === 'play' && currentQuestion && (
          <section className="space-y-5 sm:space-y-6">
            <div className="rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-4 py-4 sm:px-6 sm:py-5 shadow-[0_4px_0_#3A2A20] space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE7D5] border border-[#3A2A20]/25 text-xs sm:text-sm font-display text-[#3A2A20] transition-colors cursor-pointer"
                >
                  <span>← 이전</span>
                </button>
                <div className="font-display text-sm sm:text-base text-[#3D7D47] tabular-nums">
                  {questionIndex + 1} / {QUIZ_QUESTIONS.length}
                </div>
              </div>

              <div
                role="progressbar"
                aria-label="퀴즈 진행도"
                aria-valuemin={1}
                aria-valuemax={QUIZ_QUESTIONS.length}
                aria-valuenow={questionIndex + 1}
                className="relative pt-7 pb-1 px-3"
              >
                <div
                  className="absolute top-0 -translate-x-1/2 transition-all duration-300 ease-out pointer-events-none"
                  style={{ left: `calc(16px + (100% - 32px) * ${trackRatio})` }}
                >
                  <MiniTrackPotatoIcon />
                </div>

                <div className="relative h-3.5 rounded-full bg-[#E8DEC9] border-2 border-[#3A2A20] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A67C52] via-[#8B6239] to-[#6CC070] transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div aria-hidden="true" className="mt-1.5 flex items-center justify-between px-0.5">
                  {QUIZ_QUESTIONS.map((q, idx) => (
                    <span
                      key={q.id}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        idx <= questionIndex ? 'bg-[#3D7D47]' : 'bg-[#3A2A20]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div
              key={currentQuestion.id}
              className="pq-step-in rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_6px_0_#3A2A20] space-y-5"
            >
              <div className="space-y-1.5">
                <div className="text-sm font-display text-[#3D7D47]">
                  Q{currentQuestion.id}.
                </div>
                <h2 className="font-display text-2xl sm:text-3xl text-[#3A2A20] leading-snug">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                {currentQuestion.choices.map((choice, idx) => {
                  const isFlashing = selectedFlashIdx === idx;
                  const wasPicked =
                    selectedFlashIdx === null &&
                    answers[questionIndex] === choice.type;

                  return (
                    <button
                      key={`${currentQuestion.id}-${choice.type}`}
                      type="button"
                      onClick={() => handleSelectChoice(choice.type, idx)}
                      className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 sm:px-5 sm:py-4 flex items-start gap-3 transition-all duration-150 cursor-pointer ${
                        isFlashing
                          ? 'translate-y-0.5 bg-[#3D7D47] text-[#FFFDF7] border-[#3A2A20] shadow-[0_1px_0_#3A2A20]'
                          : wasPicked
                            ? 'bg-[#EDF6E3] text-[#1F1712] border-[#3D7D47] shadow-[0_3px_0_#3D7D47]'
                            : 'bg-[#FAF8F2] hover:bg-[#F1F6E8] active:translate-y-0.5 text-[#1F1712] border-[#3A2A20]/25 hover:border-[#3A2A20] shadow-[0_3px_0_rgba(58,42,32,0.16)]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full border font-display text-xs shrink-0 ${
                          isFlashing
                            ? 'bg-[#FFFDF7] text-[#3D7D47] border-[#FFFDF7]'
                            : wasPicked
                              ? 'bg-[#3D7D47] text-[#FFFDF7] border-[#3D7D47]'
                              : 'bg-[#FFFDF7] text-[#3A2A20] border-[#3A2A20]/30'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-sm sm:text-base leading-relaxed">
                        {choice.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 3) 결과 분석 (1.2초) */}
        {stage === 'loading' && (
          <section
            aria-live="polite"
            className="pq-step-in rounded-[30px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20] px-6 py-14 sm:py-16 text-center space-y-6"
          >
            <div className="relative mx-auto w-36 h-36 rounded-full bg-[#EEF6E5] border-2 border-[#3A2A20]/20 flex items-center justify-center">
              <div className="pq-dig-wobble">
                <img
                  src={getImageSrc('searching%20potato.png')}
                  alt="감자를 캐는 중"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl text-[#3A2A20]">
                춘천 감자밭에서 당신을 캐는 중...
              </h2>
              <p className="text-sm sm:text-base text-[#332720]">
                8가지 답변을 모아 딱 맞는 감자를 찾고 있어요
              </p>
            </div>
          </section>
        )}

        {/* 4) 결과 화면 */}
        {stage === 'result' && currentResult && partnerProfile && (
          <section className="space-y-6">
            <article className="rounded-[30px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20] px-5 py-6 sm:px-8 sm:py-7 space-y-5">
              <div className="text-center space-y-2.5">
                <span
                  className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#3A2A20]/20 text-xs sm:text-sm font-medium text-[#2F6B38]"
                  style={{ backgroundColor: currentResult.badgeBg }}
                >
                  나의 캠퍼스 감자 유형
                </span>

                <div
                  className="mx-auto w-36 h-36 sm:w-44 sm:h-44 rounded-[28px] border-2 border-[#3A2A20]/18 flex items-center justify-center p-3.5"
                  style={{ backgroundColor: currentResult.stageBg }}
                >
                  <img
                    src={getImageSrc(currentResult.imageFile)}
                    alt={currentResult.name}
                    className="w-full h-full object-contain pq-result-pop"
                  />
                </div>

                <h1 className="font-display text-3xl sm:text-4xl text-[#3A2A20] pt-0.5">
                  {currentResult.name}
                </h1>
                <p className="text-base sm:text-lg text-[#1F1712] leading-relaxed max-w-md mx-auto">
                  {currentResult.oneLiner}
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF8F2] border-2 border-[#3A2A20]/15 p-4 sm:p-5 space-y-3">
                <h2 className="font-display text-xl text-[#3A2A20]">
                  캠퍼스 특징 3가지
                </h2>
                <ul className="space-y-2.5">
                  {currentResult.traits.map((trait, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm sm:text-base text-[#1F1712] leading-relaxed"
                    >
                      <span className="font-display text-[#3D7D47] shrink-0">
                        {CIRCLED_NUMBERS[idx]}
                      </span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#F2F8EA] border-2 border-[#3D7D47]/30 px-4 py-4 sm:px-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-medium text-[#3D7D47]">
                    환상의 팀플 파트너
                  </div>
                  <div className="font-display text-xl sm:text-2xl text-[#3A2A20]">
                    {currentResult.partnerName}
                  </div>
                  <p className="text-xs sm:text-sm text-[#332720]">
                    {partnerProfile.oneLiner}
                  </p>
                </div>

                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#3A2A20]/20 flex items-center justify-center p-1.5 shrink-0"
                  style={{ backgroundColor: partnerProfile.stageBg }}
                >
                  <img
                    src={getImageSrc(partnerProfile.imageFile)}
                    alt={partnerProfile.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-lg border-2 border-[#3A2A20] shadow-[0_4px_0_#3A2A20] transition-all"
                >
                  <span>감자 키우기 앱에서 내 기회 찾기</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCopyResultLink}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FFFDF7] hover:bg-[#F5EFE2] active:translate-y-0.5 text-[#3A2A20] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all cursor-pointer"
                  >
                    {copyToastVisible ? (
                      <>
                        <Check className="w-4 h-4 text-[#3D7D47]" aria-hidden="true" />
                        <span>링크 복사 완료</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" aria-hidden="true" />
                        <span>결과 링크 복사</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDexOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF6EC] hover:bg-[#EFE7D5] active:translate-y-0.5 text-[#3A2A20] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>5종 감자 도감 보기</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleStartQuiz}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F2] hover:bg-[#EFE8D8] text-[#1F1712] font-display text-sm sm:text-base border border-[#3A2A20]/25 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>다시 하기</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReturnHome}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F2] hover:bg-[#EFE8D8] text-[#1F1712] font-display text-sm sm:text-base border border-[#3A2A20]/25 transition-colors cursor-pointer"
                  >
                    <Home className="w-4 h-4" aria-hidden="true" />
                    <span>홈페이지로 돌아가기</span>
                  </button>
                </div>
              </div>
            </article>
          </section>
        )}
      </main>

      {/* 복사 토스트 */}
      {copyToastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#3A2A20] text-[#FFFDF7] font-display text-sm sm:text-base shadow-lg border-2 border-[#FFFDF7]/20 whitespace-nowrap pq-step-in"
        >
          링크가 복사되었어요!
        </div>
      )}

      {/* 5종 감자 도감 모달 */}
      {dexOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2A20]/55 backdrop-blur-[2px]"
          onClick={() => setDexOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="standalone-dex-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_8px_0_#3A2A20] p-5 sm:p-7 pq-step-in"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#3A2A20]/15">
              <div>
                <p className="text-xs font-medium text-[#3D7D47]">
                  춘천 캠퍼스 감자 도감
                </p>
                <h2
                  id="standalone-dex-title"
                  className="font-display text-2xl sm:text-3xl text-[#3A2A20] mt-0.5"
                >
                  5종 감자 도감
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDexOpen(false)}
                aria-label="감자 도감 닫기"
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-[#3A2A20]/25 bg-[#FAF8F2] hover:bg-[#EFE8D8] text-[#3A2A20] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ul className="mt-5 space-y-3">
              {POTATO_TYPE_ORDER.map((typeId) => {
                const profile = POTATO_RESULTS[typeId];
                const isMine = resultType === typeId;
                return (
                  <li
                    key={typeId}
                    className={`rounded-2xl border-2 p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 ${
                      isMine
                        ? 'bg-[#F2F9EB] border-[#3D7D47]'
                        : 'bg-[#FAF8F2] border-[#3A2A20]/18'
                    }`}
                  >
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#3A2A20]/20 flex items-center justify-center p-1.5 shrink-0"
                      style={{ backgroundColor: profile.stageBg }}
                    >
                      <img
                        src={getImageSrc(profile.imageFile)}
                        alt={profile.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-lg sm:text-xl text-[#3A2A20]">
                          {profile.name}
                        </h3>
                        {isMine && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#3D7D47] text-[#FFFDF7] text-xs font-medium">
                            내 유형
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#1F1712] leading-snug">
                        {profile.oneLiner}
                      </p>
                      <p className="text-xs text-[#332720]">
                        환상의 팀플 파트너: {profile.partnerName}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setDexOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#3A2A20] hover:bg-[#2A1E17] text-[#FFFDF7] font-display text-base border-2 border-[#3A2A20] cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PotatoQuizStandalone;
