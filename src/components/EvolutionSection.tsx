import { Fragment } from 'react';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import { MOOD_STAGES } from '../utils/potatoLogic';
import { getRevealDelay } from '../utils/revealLogic';

export function EvolutionSection() {
  return (
    <section id="evolution" className="py-20 sm:py-24 bg-[#FFFDF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl space-y-3 mb-12">
          <p className="text-sm font-medium text-[#3D7D47]">
            미접속 일자별 감정 변화
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            접속하지 않으면 감자가 변해요
          </h2>
          <p className="text-base text-[#1F1712] leading-relaxed">
            매일 들러주면 환하게 웃고, 오래 비워두면 서운해하는 감자의 4단계
            표정 변화를 살펴보세요.
          </p>
        </Reveal>

        {/* 데스크톱 가로 화살표 연결 / 모바일 2x2 정렬 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-stretch lg:justify-between gap-5 lg:gap-3">
          {MOOD_STAGES.map((stage, index) => (
            <Fragment key={stage.mood}>
              <Reveal
                delayMs={getRevealDelay(index)}
                className="flex-1 flex"
              >
                <article
                  className="w-full flex flex-col items-center text-center rounded-[24px] border-2 border-[#3A2A20] p-6 shadow-[0_5px_0_#3A2A20] transition-transform hover:-translate-y-1"
                  style={{ backgroundColor: stage.accentBg }}
                >
                  <div className="text-sm text-[#1F1712] mb-1">
                    {index + 1}단계 · {stage.label}
                  </div>
                  <h3 className="font-display text-xl text-[#3A2A20] mb-4 whitespace-nowrap">
                    {stage.dayRangeLabel}
                  </h3>

                  <div className="my-2 flex items-center justify-center min-h-[156px]">
                    <Mascot
                      mood={stage.mood}
                      grow={0}
                      size={128}
                      animate
                      alt={`${stage.dayRangeLabel} ${stage.label} 감자`}
                    />
                  </div>

                  <p className="mt-4 w-full rounded-xl bg-[#FFFDF7]/90 border border-[#3A2A20]/15 px-3.5 py-3 text-sm text-[#1F1712] leading-relaxed">
                    {stage.descriptionPlaceholder}
                  </p>
                </article>
              </Reveal>

              {index < MOOD_STAGES.length - 1 && (
                <Reveal
                  delayMs={getRevealDelay(index) + 45}
                  className="hidden lg:flex items-center justify-center px-1 shrink-0 text-[#3A2A20]"
                >
                  <svg
                    width="34"
                    height="24"
                    viewBox="0 0 34 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 12 H 29 M 21 5 L 29 12 L 21 19"
                      stroke="#3A2A20"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Reveal>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
