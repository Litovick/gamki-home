import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Check,
  ExternalLink,
  Home,
  Link2,
  RotateCcw,
} from 'lucide-react';
import { APP_LIVE_URL } from '../utils/potatoLogic';
import {
  POTATO_RESULTS,
  POTATO_TYPE_ORDER,
  PotatoTypeId,
  QUIZ_QUESTIONS,
  buildShareableResultUrl,
  calculateQuizResult,
  getQuizProgressPercent,
} from '../utils/potatoQuizLogic';
import { PotatoEncyclopediaModal } from './PotatoEncyclopediaModal';
import { savePotatoType } from '../utils/potatoPropsSprite';

type QuizStage = 'intro' | 'play' | 'loading' | 'result';

const CIRCLED_NUMBERS = ['①', '②', '③'] as const;

interface PotatoQuizViewProps {
  initialResultType: PotatoTypeId | null;
  onSyncResultRoute: (resultType: PotatoTypeId | null) => void;
  onResultSaved?: (resultType: PotatoTypeId) => void;
  onGoHome: () => void;
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

export function PotatoQuizView({
  initialResultType,
  onSyncResultRoute,
  onResultSaved,
  onGoHome,
}: PotatoQuizViewProps) {
  const [stage, setStage] = useState<QuizStage>(
    initialResultType ? 'result' : 'intro'
  );
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<(PotatoTypeId | null)[]>(() =>
    Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [selectedFlashIdx, setSelectedFlashIdx] = useState<number | null>(null);
  const [resultType, setResultType] = useState<PotatoTypeId | null>(
    initialResultType
  );
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [dexOpen, setDexOpen] = useState<boolean>(false);
  const [copyToastVisible, setCopyToastVisible] = useState<boolean>(false);

  const transitionTimerRef = useRef<number | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const prevInitialResultRef = useRef<PotatoTypeId | null>(initialResultType);

  // 외부 해시/쿼리 변경(뒤로가기·직접 URL 이동 등)만 안전하게 동기화
  useEffect(() => {
    if (prevInitialResultRef.current === initialResultType) return;
    prevInitialResultRef.current = initialResultType;

    if (initialResultType) {
      setResultType(initialResultType);
      setStage('result');
    } else if (stage === 'result') {
      setResultType(null);
      setStage('intro');
    }
  }, [initialResultType, stage]);

  // 인트로 화면에서 5종 감자 하이라이트 순환
  useEffect(() => {
    if (stage !== 'intro') return;
    const intervalId = window.setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % POTATO_TYPE_ORDER.length);
    }, 1800);
    return () => window.clearInterval(intervalId);
  }, [stage]);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
      if (loadingTimerRef.current) {
        window.clearTimeout(loadingTimerRef.current);
      }
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const clearPendingTimers = () => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (loadingTimerRef.current) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  };

  const handleStartQuiz = () => {
    clearPendingTimers();
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setQuestionIndex(0);
    setSelectedFlashIdx(null);
    setResultType(null);
    setStage('play');
    prevInitialResultRef.current = null;
    onSyncResultRoute(null);
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
      const isLastQuestion = questionIndex >= QUIZ_QUESTIONS.length - 1;

      if (!isLastQuestion) {
        setQuestionIndex((prev) => prev + 1);
        return;
      }

      // 8문항 완료 → 1.2초 분석 연출 후 결과 화면 전환
      const { winner } = calculateQuizResult(nextAnswers);
      setStage('loading');
      window.scrollTo({ top: 0, behavior: 'auto' });

      loadingTimerRef.current = window.setTimeout(() => {
        savePotatoType(winner);
        onResultSaved?.(winner);
        setResultType(winner);
        setStage('result');
        prevInitialResultRef.current = winner;
        onSyncResultRoute(winner);
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

  const handleRestart = () => {
    handleStartQuiz();
  };

  const handleCopyResultLink = async () => {
    if (!resultType) return;
    const shareUrl = buildShareableResultUrl(
      window.location.origin,
      window.location.pathname,
      resultType
    );

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    } catch {
      // 클립보드 권한이 제한되어도 안내 토스트 표시
    }

    setCopyToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setCopyToastVisible(false);
    }, 2400);
  };

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];
  const currentResult = resultType ? POTATO_RESULTS[resultType] : null;
  const partnerProfile = currentResult
    ? POTATO_RESULTS[currentResult.partnerId]
    : null;
  const progressPercent = getQuizProgressPercent(
    questionIndex,
    QUIZ_QUESTIONS.length
  );
  const trackRatio =
    QUIZ_QUESTIONS.length > 1
      ? questionIndex / (QUIZ_QUESTIONS.length - 1)
      : 1;

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#3A2A20] flex flex-col">
      {/* 상단 고정 미니 헤더: 언제든 홈으로 돌아가기 */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/94 backdrop-blur-md border-b-2 border-[#3A2A20]/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE7D5] border-2 border-[#3A2A20]/30 hover:border-[#3A2A20] text-sm font-display text-[#3A2A20] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
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
        {/* 1) 인트로 화면 (Start) */}
        {stage === 'intro' && (
          <section
            data-testid="quiz-intro"
            className="quiz-step-in rounded-[30px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20] px-5 py-8 sm:px-10 sm:py-10 text-center space-y-7"
          >
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

            {/* 5종 감자 둥둥 미리보기 영역 */}
            <div className="rounded-3xl bg-[#F4F8EC] border-2 border-[#3A2A20]/15 px-3 py-6 sm:px-6 sm:py-7 space-y-4">
              <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end max-w-xl mx-auto">
                {POTATO_TYPE_ORDER.map((typeId, idx) => {
                  const profile = POTATO_RESULTS[typeId];
                  const isSpotlit = spotlightIndex === idx;
                  return (
                    <div
                      key={typeId}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div
                        className={`w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center rounded-2xl p-1 transition-all duration-300 quiz-float ${
                          isSpotlit
                            ? 'scale-105 sm:scale-110 bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20]'
                            : 'scale-95 opacity-85'
                        }`}
                        style={{
                          animationDelay: `${idx * 240}ms`,
                        }}
                      >
                        <img
                          src={profile.imagePath}
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
                className="w-full sm:w-auto min-w-[240px] px-8 py-4 rounded-2xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-xl border-2 border-[#3A2A20] shadow-[0_5px_0_#3A2A20] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
              >
                내 감자 캐러 가기
              </button>
              <button
                type="button"
                onClick={() => setDexOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-display text-[#3D7D47] hover:text-[#2C6134] underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] rounded-sm"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>5종 감자 먼저 구경하기</span>
              </button>
            </div>
          </section>
        )}

        {/* 2) 퀴즈 진행 화면 (Play — 총 8문항) */}
        {stage === 'play' && currentQuestion && (
          <section
            data-testid="quiz-play"
            className="space-y-5 sm:space-y-6"
          >
            {/* 상단 진행도 바 (흙길 라인 + 이동하는 감자 아이콘 + 이전 버튼) */}
            <div className="rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-4 py-4 sm:px-6 sm:py-5 shadow-[0_4px_0_#3A2A20] space-y-3.5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handlePrevQuestion}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE7D5] border border-[#3A2A20]/25 text-xs sm:text-sm font-display text-[#3A2A20] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                >
                  <span>← 이전</span>
                </button>

                <div
                  className="font-display text-sm sm:text-base text-[#3D7D47] tabular-nums"
                  aria-live="polite"
                >
                  {questionIndex + 1} / {QUIZ_QUESTIONS.length}
                </div>
              </div>

              {/* 흙길 트랙 & 이동 감자 */}
              <div
                role="progressbar"
                aria-label="퀴즈 진행도"
                aria-valuemin={1}
                aria-valuemax={QUIZ_QUESTIONS.length}
                aria-valuenow={questionIndex + 1}
                className="relative pt-7 pb-1 px-3"
              >
                {/* 이동하는 감자 아이콘 */}
                <div
                  className="absolute top-0 -translate-x-1/2 transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    left: `calc(16px + (100% - 32px) * ${trackRatio})`,
                  }}
                >
                  <MiniTrackPotatoIcon />
                </div>

                {/* 흙길 라인 */}
                <div className="relative h-3.5 rounded-full bg-[#E8DEC9] border-2 border-[#3A2A20] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#A67C52] via-[#8B6239] to-[#6CC070] transition-all duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* 8단계 스텝 점 */}
                <div
                  aria-hidden="true"
                  className="mt-1.5 flex items-center justify-between px-0.5"
                >
                  {QUIZ_QUESTIONS.map((q, idx) => (
                    <span
                      key={q.id}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        idx <= questionIndex
                          ? 'bg-[#3D7D47]'
                          : 'bg-[#3A2A20]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 질문 & 선택지 5개 카드 */}
            <div
              key={currentQuestion.id}
              className="quiz-step-in rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-5 py-6 sm:px-8 sm:py-8 shadow-[0_6px_0_#3A2A20] space-y-5"
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
                  const wasPreviouslyPicked =
                    selectedFlashIdx === null &&
                    answers[questionIndex] === choice.type;

                  return (
                    <button
                      key={`${currentQuestion.id}-${choice.type}`}
                      type="button"
                      onClick={() => handleSelectChoice(choice.type, idx)}
                      className={`w-full text-left rounded-2xl border-2 px-4 py-3.5 sm:px-5 sm:py-4 flex items-start gap-3 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                        isFlashing
                          ? 'translate-y-0.5 bg-[#3D7D47] text-[#FFFDF7] border-[#3A2A20] shadow-[0_1px_0_#3A2A20]'
                          : wasPreviouslyPicked
                            ? 'bg-[#EDF6E3] text-[#1F1712] border-[#3D7D47] shadow-[0_3px_0_#3D7D47]'
                            : 'bg-[#FAF8F2] hover:bg-[#F1F6E8] active:translate-y-0.5 text-[#1F1712] border-[#3A2A20]/25 hover:border-[#3A2A20] shadow-[0_3px_0_rgba(58,42,32,0.16)]'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full border font-display text-xs shrink-0 ${
                          isFlashing
                            ? 'bg-[#FFFDF7] text-[#3D7D47] border-[#FFFDF7]'
                            : wasPreviouslyPicked
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

        {/* 3) 결과 분석 연출 (Loading — 1.2초) */}
        {stage === 'loading' && (
          <section
            data-testid="quiz-loading"
            aria-live="polite"
            className="quiz-step-in rounded-[30px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20] px-6 py-14 sm:py-16 text-center space-y-6"
          >
            <div className="relative mx-auto w-36 h-36 rounded-full bg-[#EEF6E5] border-2 border-[#3A2A20]/20 flex items-center justify-center">
              <div className="quiz-dig-wobble">
                <img
                  src="/searching%20potato.png"
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

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-2 pt-1"
            >
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="w-3 h-3 rounded-full bg-[#6CC070] border border-[#3A2A20] quiz-float"
                  style={{ animationDelay: `${dot * 180}ms` }}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4) 결과 화면 (Result) */}
        {stage === 'result' && currentResult && partnerProfile && (
          <section
            data-testid="quiz-result"
            className="space-y-6"
          >
            <article className="rounded-[30px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20] px-5 py-6 sm:px-8 sm:py-7 space-y-5">
              {/* 결과 타이틀 + 퉁퉁 튀며 등장하는 감자 이미지 */}
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
                    src={currentResult.imagePath}
                    alt={currentResult.name}
                    className="w-full h-full object-contain quiz-result-pop"
                  />
                </div>

                <h1 className="font-display text-3xl sm:text-4xl text-[#3A2A20] pt-0.5">
                  {currentResult.name}
                </h1>
                <p className="text-base sm:text-lg text-[#1F1712] leading-relaxed max-w-md mx-auto">
                  {currentResult.oneLiner}
                </p>
              </div>

              {/* 캠퍼스 특징 3가지 */}
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

              {/* 환상의 팀플 파트너 */}
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
                    src={partnerProfile.imagePath}
                    alt={partnerProfile.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 하단 액션 버튼 영역 */}
              <div className="pt-2 space-y-3">
                <p className="text-center text-xs sm:text-sm text-[#332720] leading-relaxed">
                  앱에서 테스트하면 내 감자가 유형 소품을 쓰고, 유형에 맞는 춘천
                  기회를 바로 추천해 줘요.
                </p>

                {/* 1. 감자 키우기 앱 바로가기 */}
                <a
                  href={APP_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-lg border-2 border-[#3A2A20] shadow-[0_4px_0_#3A2A20] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
                >
                  <span>감자 키우기 앱에서 내 기회 찾기</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>

                {/* 2 & 3. 결과 링크 복사 + 5종 감자 도감 보기 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCopyResultLink}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FFFDF7] hover:bg-[#F5EFE2] active:translate-y-0.5 text-[#3A2A20] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                  >
                    {copyToastVisible ? (
                      <>
                        <Check
                          className="w-4 h-4 text-[#3D7D47]"
                          aria-hidden="true"
                        />
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
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF6EC] hover:bg-[#EFE7D5] active:translate-y-0.5 text-[#3A2A20] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>5종 감자 도감 보기</span>
                  </button>
                </div>

                {/* 4. 다시 하기 / 홈페이지로 돌아가기 */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F2] hover:bg-[#EFE8D8] text-[#1F1712] font-display text-sm sm:text-base border border-[#3A2A20]/25 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>다시 하기</span>
                  </button>

                  <button
                    type="button"
                    onClick={onGoHome}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF8F2] hover:bg-[#EFE8D8] text-[#1F1712] font-display text-sm sm:text-base border border-[#3A2A20]/25 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
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

      {/* 링크 복사 토스트 */}
      {copyToastVisible && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#3A2A20] text-[#FFFDF7] font-display text-sm sm:text-base shadow-lg border-2 border-[#FFFDF7]/20 whitespace-nowrap quiz-step-in"
        >
          링크가 복사되었어요!
        </div>
      )}

      {/* 5종 감자 도감 모달 */}
      <PotatoEncyclopediaModal
        open={dexOpen}
        currentTypeId={resultType}
        onClose={() => setDexOpen(false)}
      />
    </div>
  );
}
