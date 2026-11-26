import { Fragment } from 'react';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import { MOOD_STAGES } from '../utils/potatoLogic';
import { getRevealDelay } from '../utils/revealLogic';

const DEADLINE_NUDGE_BUBBLES = [
  {
    timing: '오늘 마감',
    speech: "'춘천여행 SNS 공모전' 오늘 마감이야! 지금 내면 돼.",
    badgeClass: 'bg-[#FDECE8] text-[#A43E2E] border-[#E4A89B]',
  },
  {
    timing: '1일 전',
    speech: "'…' 내일 마감! 지원서 5분이면 써.",
    badgeClass: 'bg-[#FFF2CC] text-[#7D5310] border-[#E5C97B]',
  },
  {
    timing: '2~3일 전',
    speech: "'…' 2일 남았어. 스크랩만 하고 끝낼 거야?",
    badgeClass: 'bg-[#FAF3E1] text-[#735320] border-[#DFC690]',
  },
  {
    timing: '4~7일 전',
    speech: "'…' 찜만 해 둔 거 아니지? 5일 남았어.",
    badgeClass: 'bg-[#E9F3DF] text-[#2F6B38] border-[#9FD09A]',
  },
] as const;

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

        {/* 스크랩 기회 마감 임박 재촉 안내 */}
        <Reveal delayMs={120} className="mt-12 sm:mt-14">
          <div
            data-testid="deadline-nudge-card"
            className="rounded-[28px] bg-[#FAF8F2] border-2 border-[#3A2A20] p-6 sm:p-8 shadow-[0_5px_0_#3A2A20] space-y-6"
          >
            <div className="max-w-3xl space-y-2">
              <p className="text-sm font-medium text-[#3D7D47]">
                스크랩 기회 마감 재촉
              </p>
              <h3 className="font-display text-2xl sm:text-3xl text-[#3A2A20] leading-snug">
                접속해도 지원을 미루면, 감자가 콕 집어 졸라요.
              </h3>
              <p className="text-sm sm:text-base text-[#1F1712] leading-relaxed">
                스크랩만 하고 지원하지 않은 기회의 마감이 7일 안으로 다가오면,
                홈 감자가 그 기회 이름을 직접 말하며 시무룩한 표정으로 조릅니다.
                &lsquo;지원했어요&rsquo;를 누르면 더 이상 조르지 않고 마감
                알림에서도 빠져요.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {DEADLINE_NUDGE_BUBBLES.map((item) => (
                <article
                  key={item.timing}
                  className="rounded-2xl bg-[#FFFDF7] border-2 border-[#3A2A20]/20 p-4 flex flex-col gap-3 shadow-[0_3px_0_rgba(58,42,32,0.12)]"
                >
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-display ${item.badgeClass}`}
                    >
                      {item.timing}
                    </span>
                  </div>
                  <p className="text-sm text-[#1F1712] leading-relaxed">
                    “{item.speech}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
