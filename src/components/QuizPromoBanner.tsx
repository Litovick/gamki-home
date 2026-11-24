import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';

interface QuizPromoBannerProps {
  onStartQuiz: () => void;
}

export function QuizPromoBanner({ onStartQuiz }: QuizPromoBannerProps) {
  return (
    <section
      aria-label="감자 유형 테스트 안내"
      className="py-10 sm:py-12 bg-[#FAF8F2] border-t-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-6 py-6 sm:px-8 sm:py-7 shadow-[0_5px_0_#3A2A20] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4 sm:gap-5 min-w-0">
              {/* 작은 감자 미리보기 장식 */}
              <div
                aria-hidden="true"
                className="hidden sm:flex items-center -space-x-3 shrink-0"
              >
                <span className="w-12 h-12 rounded-2xl bg-[#EEF6E5] border-2 border-[#3A2A20] flex items-center justify-center p-1 shadow-[0_2px_0_#3A2A20]">
                  <img
                    src="/calm%20potato.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </span>
                <span className="w-12 h-12 rounded-2xl bg-[#FFF6D6] border-2 border-[#3A2A20] flex items-center justify-center p-1 shadow-[0_2px_0_#3A2A20]">
                  <img
                    src="/cheerful%20potato.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </span>
                <span className="w-12 h-12 rounded-2xl bg-[#F1EBFF] border-2 border-[#3A2A20] flex items-center justify-center p-1 shadow-[0_2px_0_#3A2A20]">
                  <img
                    src="/creative%20potato.png"
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </span>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="text-xs font-medium text-[#3D7D47]">
                  미니 테스트 · 감자 유형 찾기
                </div>
                <p className="font-display text-lg sm:text-[22px] text-[#3A2A20] leading-snug">
                  잠깐! 나는 어떤 감자일까? — 8개 질문으로 알아보는 나의 캠퍼스
                  감자 유형
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onStartQuiz}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-base sm:text-lg border-2 border-[#3A2A20] shadow-[0_4px_0_#3A2A20] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
            >
              <span>나의 감자 유형은?</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
