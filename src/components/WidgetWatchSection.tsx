import { Reveal } from './Reveal';
import { getRevealDelay } from '../utils/revealLogic';

const MOCKUP_ITEMS = [
  {
    id: 'widget-moods',
    orderLabel: '01 · 홈 화면 위젯',
    title: '홈 화면 위젯',
    src: 'https://raw.githubusercontent.com/Hwangdyoung/gamja-kiugi/main/docs/mockups/widget-moods.svg',
    alt: '홈 화면 위젯 · 미접속 일수별 감자 표정 4단계',
  },
  {
    id: 'watch-moods',
    orderLabel: '02 · Apple Watch',
    title: 'Apple Watch',
    src: 'https://raw.githubusercontent.com/Hwangdyoung/gamja-kiugi/main/docs/mockups/watch-moods.svg',
    alt: 'Apple Watch 앱과 컴플리케이션 · 미접속 일수별 4단계',
  },
] as const;

export function WidgetWatchSection() {
  return (
    <section
      id="widget-watch"
      className="scroll-mt-16 py-20 sm:py-24 bg-[#FAF6EC] border-t-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-3xl space-y-3 mb-12">
          <p className="text-sm font-medium text-[#3D7D47]">
            위젯 · 워치 연동
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            앱을 안 열어도, 감자는 보고 있어요.
          </h2>
          <p className="text-base text-[#5B493E] leading-relaxed">
            iPhone 홈 화면 위젯과 Apple Watch에서도 감자 표정이 마지막 접속일에
            따라 바뀝니다. 발표 시연에서는 슬라이더를 움직이면 워치 표정도 바로
            바뀌어요.
          </p>
        </Reveal>

        <div className="space-y-7">
          {MOCKUP_ITEMS.map((item, idx) => (
            <Reveal key={item.id} delayMs={getRevealDelay(idx)}>
              <article className="rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-5 sm:p-7 shadow-[0_6px_0_#3A2A20]">
                <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 mb-5 border-b border-[#3A2A20]/12">
                  <div>
                    <div className="text-xs font-medium text-[#3D7D47]">
                      {item.orderLabel}
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-[#3A2A20] mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B584B]">{item.alt}</p>
                </div>

                <div className="w-full overflow-x-auto rounded-2xl bg-[#FAF8F2] border border-[#3A2A20]/12 p-3 sm:p-5">
                  <img
                    src={item.src}
                    alt={item.alt}
                    referrerPolicy="no-referrer"
                    className="w-full min-w-[540px] sm:min-w-0 h-auto block mx-auto"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
