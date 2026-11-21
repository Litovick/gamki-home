import { Fragment, useEffect, useRef, useState } from 'react';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import { CareActionId, GrowthStage } from '../utils/potatoLogic';
import {
  CAREER_CARE_FLOWS,
  RECORD_GROWTH_STEPS,
} from '../utils/careerContent';
import { getRevealDelay } from '../utils/revealLogic';

function CareFlowIcon({ id }: { id: CareActionId }) {
  if (id === 'water') {
    return (
      <svg
        viewBox="0 0 96 96"
        className="w-16 h-16"
        role="img"
        aria-label="손그림 물뿌리개 그림"
      >
        <path
          d="M78 46 C 75 51, 75 56, 78 56 C 81 56, 81 51, 78 46 Z"
          fill="#8ECDF5"
          stroke="#3a2a20"
          strokeWidth="2.8"
        />
        <path
          d="M85 57 C 82 62, 82 66, 85 66 C 88 66, 88 62, 85 57 Z"
          fill="#8ECDF5"
          stroke="#3a2a20"
          strokeWidth="2.8"
        />
        <path
          d="M28 42 C 13 42, 13 66, 28 66"
          fill="none"
          stroke="#3a2a20"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M32 38 C 36 22, 54 22, 56 38"
          fill="none"
          stroke="#3a2a20"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M58 54 L 74 39 L 79 44 L 60 63 Z"
          fill="#9ED3F5"
          stroke="#3a2a20"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <rect
          x="26"
          y="38"
          width="36"
          height="34"
          rx="8"
          fill="#A9DBF8"
          stroke="#3a2a20"
          strokeWidth="3.5"
        />
      </svg>
    );
  }

  if (id === 'sun') {
    return (
      <svg
        viewBox="0 0 96 96"
        className="w-16 h-16"
        role="img"
        aria-label="손그림 따뜻한 해 그림"
      >
        <g stroke="#3a2a20" strokeWidth="3.5" strokeLinecap="round">
          <line x1="48" y1="10" x2="48" y2="20" />
          <line x1="48" y1="76" x2="48" y2="86" />
          <line x1="10" y1="48" x2="20" y2="48" />
          <line x1="76" y1="48" x2="86" y2="48" />
          <line x1="21" y1="21" x2="28" y2="28" />
          <line x1="68" y1="68" x2="75" y2="75" />
          <line x1="75" y1="21" x2="68" y2="28" />
          <line x1="28" y1="68" x2="21" y2="75" />
        </g>
        <circle
          cx="48"
          cy="48"
          r="21"
          fill="#FFE07D"
          stroke="#3a2a20"
          strokeWidth="3.5"
        />
        <circle cx="41" cy="46" r="2.2" fill="#3a2a20" />
        <circle cx="55" cy="46" r="2.2" fill="#3a2a20" />
        <path
          d="M44 53 Q 48 57 52 53"
          fill="none"
          stroke="#3a2a20"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 96 96"
      className="w-16 h-16"
      role="img"
      aria-label="손그림 거름 포대 그림"
    >
      <path
        d="M35 28 L 30 18 Q 48 22 66 18 L 61 28 Z"
        fill="#E6C596"
        stroke="#3a2a20"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M34 30 C 22 42, 18 66, 26 78 C 34 84, 62 84, 70 78 C 78 66, 74 42, 62 30 Z"
        fill="#DFB984"
        stroke="#3a2a20"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <rect
        x="32"
        y="27"
        width="32"
        height="7"
        rx="3.5"
        fill="#A4754B"
        stroke="#3a2a20"
        strokeWidth="3"
      />
      <path
        d="M48 66 V 51"
        stroke="#3a2a20"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M48 58 C 53 51, 61 51, 64 55 C 60 61, 53 62, 48 58 Z"
        fill="#6cc070"
        stroke="#3a2a20"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M48 55 C 43 48, 35 48, 32 52 C 36 58, 43 59, 48 55 Z"
        fill="#6cc070"
        stroke="#3a2a20"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CareerLinkSection() {
  const [selectedStage, setSelectedStage] = useState<GrowthStage>(1);
  const [feedback, setFeedback] = useState<string>(
    '아래 성장 단계를 눌러보거나 위 커리어 활동 카드를 체험해 보세요.'
  );
  const [activeEffect, setActiveEffect] = useState<{
    id: CareActionId;
    key: number;
  } | null>(null);
  const effectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (effectTimerRef.current !== null) {
        window.clearTimeout(effectTimerRef.current);
      }
    };
  }, []);

  const currentStep = RECORD_GROWTH_STEPS[selectedStage];

  const handleSelectStage = (stage: GrowthStage) => {
    setSelectedStage(stage);
    const step = RECORD_GROWTH_STEPS[stage];
    setFeedback(
      `기록 ${step.recordsRequired}개 달성 · ${step.name} 단계예요. ${step.caption}`
    );
  };

  const handleTryFlow = (
    id: CareActionId,
    feedbackText: string,
    addsRecordStep?: boolean
  ) => {
    setActiveEffect({ id, key: Date.now() });
    setFeedback(feedbackText);
    if (addsRecordStep) {
      setSelectedStage((prev) => (prev < 4 ? ((prev + 1) as GrowthStage) : 4));
    }
    if (effectTimerRef.current !== null) {
      window.clearTimeout(effectTimerRef.current);
    }
    effectTimerRef.current = window.setTimeout(() => {
      setActiveEffect(null);
    }, 950);
  };

  return (
    <section
      id="career-link"
      className="scroll-mt-16 py-20 sm:py-24 bg-[#F3F8EB] border-b-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl space-y-3 mb-10">
          <p className="text-sm font-medium text-[#3D7D47]">
            커리어 활동과 감자의 연결 구조
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            진로 활동이 곧 감자 돌보기예요
          </h2>
          <p className="text-base text-[#5B493E] leading-relaxed">
            따로 게임 숙제를 하지 않아도 괜찮아요. 내 진로를 확인하고, 기회를
            찾고, 한 줄 기록을 남기는 순간 감자도 자연스럽게 함께 자라나요.
          </p>
        </Reveal>

        {/* 3개 커리어 ↔ 감자 돌보기 연결 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {CAREER_CARE_FLOWS.map((flow, index) => (
            <Reveal
              key={flow.id}
              delayMs={getRevealDelay(index)}
              className="flex"
            >
              <article className="w-full flex flex-col justify-between rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 shadow-[0_5px_0_#3A2A20] transition-transform hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-[#F8F5EB] border border-[#3A2A20]/12 flex items-center justify-center shrink-0">
                      <CareFlowIcon id={flow.id} />
                    </div>

                    <div className="flex-1 rounded-2xl bg-[#F4F9EC] border border-[#3A2A20]/15 px-3.5 py-2.5 text-center">
                      <div className="text-xs text-[#5B493E] font-medium">
                        {flow.activityTitle}
                      </div>
                      <div
                        aria-hidden="true"
                        className="text-sm text-[#3D7D47] my-0.5 font-display"
                      >
                        ↓
                      </div>
                      <div className="font-display text-lg text-[#3A2A20]">
                        {flow.careTitle}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-xl text-[#3A2A20] mb-2">
                    {flow.activityTitle} → {flow.careTitle}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-[#5B493E] leading-relaxed mb-5">
                    {flow.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleTryFlow(
                      flow.id,
                      flow.feedbackText,
                      flow.addsRecordStep
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE6D2] active:translate-y-0.5 text-[#3A2A20] font-display text-sm sm:text-base border-2 border-[#3A2A20] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                >
                  {flow.buttonLabel}
                </button>
              </article>
            </Reveal>
          ))}
        </div>

        {/* 하단 성장 연결 강조 배너 (기록 0 → 3 → 6 → 9 → 12 인터랙티브 미리보기) */}
        <Reveal delayMs={100}>
          <div className="rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 sm:p-8 shadow-[0_6px_0_#3A2A20]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* 좌측 살아 있는 성장 미리보기 마스코트 */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-[#F4F9EC] border border-[#3A2A20]/12 py-5 px-4">
                <Mascot
                  mood="happy"
                  grow={selectedStage}
                  size={172}
                  animate
                  blink
                  effect={activeEffect?.id ?? null}
                  effectKey={activeEffect?.key ?? 0}
                  alt={`기록 ${currentStep.recordsRequired}개 성장 단계: ${currentStep.name}`}
                />
                <div
                  key={`stage-label-${selectedStage}`}
                  className="tab-panel-fade text-center"
                >
                  <div className="mt-2 font-display text-2xl text-[#3A2A20]">
                    {currentStep.name}
                  </div>
                  <div className="text-xs text-[#3D7D47] font-medium mt-0.5 tabular-nums">
                    누적 한 줄 기록 {currentStep.recordsRequired}개 / 12개
                  </div>
                </div>
              </div>

              {/* 우측 성장 설명 + 5단계 인터랙티브 선택 흐름 */}
              <div className="lg:col-span-8 space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-[#3D7D47]">
                    경쟁 없는 나만의 성장 리듬
                  </p>
                  <h3 className="font-display text-2xl sm:text-[26px] text-[#3A2A20] leading-snug">
                    레벨이나 점수 경쟁은 없어요. 기록이 3개 쌓일 때마다 감자
                    머리 위 싹이 한 단계씩 자라요.
                  </h3>
                  <div
                    key={`stage-panel-${selectedStage}-${feedback}`}
                    role="tabpanel"
                    id={`career-stage-panel-${selectedStage}`}
                    aria-labelledby={`career-stage-tab-${selectedStage}`}
                    data-testid="career-stage-panel"
                    className="tab-panel-fade rounded-xl bg-[#FAF8F2] border border-[#3A2A20]/12 px-4 py-2.5"
                  >
                    <p
                      role="status"
                      aria-live="polite"
                      className="text-sm sm:text-base text-[#5B493E]"
                    >
                      {feedback}
                    </p>
                  </div>
                </div>

                {/* 기록 진행 게이지 바 */}
                <div
                  role="progressbar"
                  aria-label="한 줄 기록 누적 성장"
                  aria-valuemin={0}
                  aria-valuemax={12}
                  aria-valuenow={currentStep.recordsRequired}
                  className="w-full h-5 rounded-full bg-[#ECE7DC] border-2 border-[#3A2A20] overflow-hidden p-0.5"
                >
                  <div
                    className="h-full w-full rounded-full bg-gradient-to-r from-[#87CE7E] via-[#6CC070] to-[#4A9A55] origin-left transition-transform duration-200 ease-out"
                    style={{
                      transform: `scaleX(${currentStep.recordsRequired / 12})`,
                    }}
                  />
                </div>

                {/* 5단계 클릭 가능한 성장 흐름 */}
                <div
                  role="tablist"
                  aria-label="기록 수별 감자 성장 단계 미리보기"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between gap-2.5 pt-1"
                >
                  {RECORD_GROWTH_STEPS.map((step, idx) => {
                    const isSelected = step.stage === selectedStage;
                    const isAdjacentArrowActive =
                      idx === selectedStage || idx + 1 === selectedStage;
                    return (
                      <Fragment key={step.stage}>
                        <button
                          type="button"
                          role="tab"
                          id={`career-stage-tab-${step.stage}`}
                          aria-selected={isSelected}
                          aria-controls={`career-stage-panel-${step.stage}`}
                          onClick={() => handleSelectStage(step.stage)}
                          className={`tab-state-item lg:flex-1 rounded-2xl px-3 py-2.5 border-2 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                            isSelected
                              ? 'relative z-10 opacity-100 scale-[1.04] -translate-y-0.5 bg-[#3D7D47] text-[#FFFDF7] border-[#3A2A20] shadow-[0_4px_0_#3A2A20] ring-2 ring-[#3D7D47]/25'
                              : 'opacity-50 scale-[0.96] bg-[#FAF8F2] text-[#3A2A20] border-[#3A2A20]/20 hover:opacity-85 hover:scale-100 hover:border-[#3A2A20] hover:bg-[#EDF5E3]'
                          }`}
                        >
                          <div
                            className={`text-[11px] tabular-nums transition-colors duration-200 ${
                              isSelected ? 'text-[#E7F6DC]' : 'text-[#6B584B]'
                            }`}
                          >
                            기록 {step.recordsRequired}개
                          </div>
                          <div className="font-display text-sm mt-0.5 whitespace-nowrap">
                            {step.name}
                          </div>
                        </button>

                        {idx < RECORD_GROWTH_STEPS.length - 1 && (
                          <span
                            aria-hidden="true"
                            className={`hidden lg:inline-block text-sm shrink-0 transition-opacity duration-300 ${
                              isAdjacentArrowActive
                                ? 'text-[#3D7D47] opacity-90'
                                : 'text-[#6B584B] opacity-35'
                            }`}
                          >
                            →
                          </span>
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 미접속 연결 요약 한 줄 */}
            <div className="mt-6 pt-5 border-t border-[#3A2A20]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm sm:text-[15px] text-[#4D3B30] leading-relaxed">
                반대로 며칠 동안 진로를 미루고 앱을 안 열면, 감자 표정이{' '}
                <strong className="font-display font-normal text-[#3A2A20]">
                  웃음 → 무표정 → 짜증 → 분노
                </strong>
                로 변하며 다시 불러줘요.
              </p>
              <a
                href="#evolution"
                className="text-sm font-display text-[#3D7D47] hover:text-[#2C6134] underline underline-offset-4 whitespace-nowrap shrink-0"
              >
                감자 변화 보기 →
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
