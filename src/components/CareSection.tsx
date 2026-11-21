import { useState } from 'react';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import {
  CARE_ACTIONS,
  CareActionId,
  GROWTH_STAGES,
  applyCareAction,
  getGrowthStageByEnergy,
  getGrowthStageInfo,
} from '../utils/potatoLogic';
import { getRevealDelay } from '../utils/revealLogic';

function CareIllustration({ id }: { id: CareActionId }) {
  if (id === 'water') {
    return (
      <svg
        viewBox="0 0 96 96"
        className="w-20 h-20"
        role="img"
        aria-label="손그림 물뿌리개 그림"
      >
        {/* 물방울 */}
        <path
          d="M78 46 C 75 51, 75 56, 78 56 C 81 56, 81 51, 78 46 Z"
          fill="#8ECDF5"
          stroke="#3a2a20"
          strokeWidth="2.5"
        />
        <path
          d="M85 57 C 82 62, 82 66, 85 66 C 88 66, 88 62, 85 57 Z"
          fill="#8ECDF5"
          stroke="#3a2a20"
          strokeWidth="2.5"
        />
        {/* 손잡이 */}
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
        {/* 물뿌리개 주둥이 */}
        <path
          d="M58 54 L 74 39 L 79 44 L 60 63 Z"
          fill="#9ED3F5"
          stroke="#3a2a20"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* 물뿌리개 몸통 */}
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
        {/* 장식 띠 */}
        <path
          d="M26 52 H 62"
          stroke="#3a2a20"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  if (id === 'sun') {
    return (
      <svg
        viewBox="0 0 96 96"
        className="w-20 h-20"
        role="img"
        aria-label="손그림 따뜻한 해 그림"
      >
        {/* 햇살 광선 */}
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
        {/* 해 몸통 */}
        <circle
          cx="48"
          cy="48"
          r="21"
          fill="#FFE07D"
          stroke="#3a2a20"
          strokeWidth="3.5"
        />
        {/* 해의 귀여운 표정 */}
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
      className="w-20 h-20"
      role="img"
      aria-label="손그림 거름 포대 그림"
    >
      {/* 포대 윗부분 주름 */}
      <path
        d="M35 28 L 30 18 Q 48 22 66 18 L 61 28 Z"
        fill="#E6C596"
        stroke="#3a2a20"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* 포대 본체 */}
      <path
        d="M34 30 C 22 42, 18 66, 26 78 C 34 84, 62 84, 70 78 C 78 66, 74 42, 62 30 Z"
        fill="#DFB984"
        stroke="#3a2a20"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* 묶은 끈 */}
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
      {/* 포대 앞 새싹 무늬 */}
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

export function CareSection() {
  const [energy, setEnergy] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>(
    '아래 돌보기 버튼을 눌러 감자 머리 위 싹을 키워보세요!'
  );
  const [lastAction, setLastAction] = useState<CareActionId | null>(null);

  const stage = getGrowthStageByEnergy(energy);
  const stageInfo = getGrowthStageInfo(stage);

  const handleCare = (actionId: CareActionId) => {
    const result = applyCareAction(energy, actionId);
    setEnergy(result.energy);
    setLastAction(actionId);

    if (energy >= 100) {
      setFeedback('감자꽃이 활짝 피었어요! 처음부터 다시 키워볼 수도 있어요.');
    } else if (result.energy >= 100) {
      setFeedback('축하해요! 감자 머리 위에 보랏빛 감자꽃이 활짝 피었어요!');
    } else {
      setFeedback(`${result.feedback} (기운 +${result.delta})`);
    }
  };

  const handleReset = () => {
    setEnergy(0);
    setLastAction(null);
    setFeedback('씨감자부터 다시 정성껏 키워볼까요?');
  };

  return (
    <section
      id="care"
      className="py-20 sm:py-24 bg-[#F3F8EB] border-y-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl space-y-3 mb-10">
          <p className="text-sm font-medium text-[#3D7D47]">핵심 돌보기 기능</p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            감자 돌보기 기능
          </h2>
          <p className="text-base text-[#5B493E] leading-relaxed">
            물 주기, 햇빛 받기, 거름 주기를 직접 체험해 보세요. 기운이 쌓일수록
            감자 머리 위 싹이 씨감자에서 꽃 핀 감자까지 자라납니다.
          </p>
        </Reveal>

        {/* 상단: 지금 내 감자 기운 게이지 + 성장 마스코트 미리보기 */}
        <Reveal delayMs={80} className="mb-8">
          <div className="rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 sm:p-8 shadow-[0_6px_0_#3A2A20]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* 마스코트 성장 미리보기 */}
            <div className="md:col-span-4 flex flex-col items-center justify-center rounded-2xl bg-[#F4F9EC] border border-[#3A2A20]/12 py-5 px-4">
              <Mascot
                mood="happy"
                grow={stage}
                size={168}
                animate
                alt={`현재 성장 단계: ${stageInfo.name}`}
              />
              <div className="mt-2 font-display text-xl text-[#3A2A20]">
                {stageInfo.name}
              </div>
              <div className="text-xs text-[#6B584B] mt-0.5 tabular-nums">
                성장 {stage + 1}단계 / 5단계
              </div>
            </div>

            {/* 기운 게이지 + 5단계 진행 표시 */}
            <div className="md:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-[#3A2A20]">
                    지금 내 감자 기운
                  </h3>
                  <p
                    role="status"
                    aria-live="polite"
                    className="text-sm sm:text-base text-[#5B493E] mt-1"
                  >
                    {feedback}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className="font-display text-2xl text-[#3D7D47] tabular-nums"
                    data-testid="care-energy-value"
                  >
                    {energy} / 100
                  </span>
                  {energy > 0 && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3.5 py-2 rounded-xl border-2 border-[#3A2A20]/30 hover:border-[#3A2A20] bg-[#FFFDF7] hover:bg-[#F7F1E4] text-xs font-medium text-[#3A2A20] transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                    >
                      처음부터 다시 키우기
                    </button>
                  )}
                </div>
              </div>

              {/* 게이지 바 */}
              <div
                role="progressbar"
                aria-label="지금 내 감자 기운"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={energy}
                className="w-full h-6 rounded-full bg-[#ECE7DC] border-2 border-[#3A2A20] overflow-hidden p-0.5"
              >
                <div
                  className="h-full w-full rounded-full bg-gradient-to-r from-[#87CE7E] via-[#6CC070] to-[#4A9A55] origin-left transition-transform duration-200 ease-out"
                  style={{ transform: `scaleX(${energy / 100})` }}
                />
              </div>

              {/* 5단계 성장 단계 트랙 */}
              <ol
                className="grid grid-cols-5 gap-2 pt-1"
                aria-label="감자 성장 5단계"
              >
                {GROWTH_STAGES.map((item) => {
                  const reached = stage >= item.stage;
                  const isCurrent = stage === item.stage;
                  return (
                    <li
                      key={item.stage}
                      className={`rounded-xl px-2 py-2 text-center border transition-colors ${
                        isCurrent
                          ? 'bg-[#E6F4DB] border-[#3A2A20] text-[#3A2A20] font-medium'
                          : reached
                          ? 'bg-[#F6FAF0] border-[#6CC070]/60 text-[#3D7D47]'
                          : 'bg-[#FAF8F2] border-[#3A2A20]/12 text-[#8A796D]'
                      }`}
                    >
                      <div className="text-[11px] tabular-nums">
                        {item.stage + 1}단계
                      </div>
                      <div className="font-display text-xs sm:text-sm mt-0.5 truncate">
                        {item.name}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          </div>
        </Reveal>

        {/* 3개의 돌보기 기능 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARE_ACTIONS.map((action, index) => {
            const isRecent = lastAction === action.id;
            return (
              <Reveal key={action.id} delayMs={getRevealDelay(index)} className="flex">
                <article
                  className={`w-full flex flex-col justify-between rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 shadow-[0_5px_0_#3A2A20] transition-transform hover:-translate-y-1 ${
                    isRecent ? 'ring-3 ring-[#6CC070]/60' : ''
                  }`}
                >
                  <div>
                    <div className="w-24 h-24 rounded-2xl bg-[#F8F5EB] border border-[#3A2A20]/12 flex items-center justify-center mb-5">
                      <CareIllustration id={action.id} />
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <h3 className="font-display text-2xl text-[#3A2A20]">
                        {action.title}
                      </h3>
                      <span className="text-xs font-medium text-[#3D7D47] whitespace-nowrap shrink-0 tabular-nums">
                        기운 +{action.energyGain}
                      </span>
                    </div>

                    <p className="rounded-xl bg-[#FAF8F2] border border-[#3A2A20]/12 px-4 py-3 text-sm text-[#5B493E] leading-relaxed mb-6">
                      {action.descriptionPlaceholder}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCare(action.id)}
                    aria-label={`${action.title} 체험해보기`}
                    className="w-full py-3 px-5 rounded-xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
                  >
                    체험해보기
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
