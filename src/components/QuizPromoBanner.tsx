import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Reveal } from './Reveal';
import { POTATO_PROPS_IMAGE_PATH } from '../utils/potatoPropsSprite';

interface QuizPromoBannerProps {
  onStartQuiz: () => void;
}

const TYPE_OPPORTUNITY_MATCHES = [
  {
    typeName: '차분한 감자',
    imagePath: '/calm%20potato.png',
    opportunity: '인턴 · 프로젝트',
    reason: '조건을 꼼꼼히 따져 고른 한 곳에서 오래 배우는 경험이 잘 맞아요.',
    chipBg: '#E9F3DF',
  },
  {
    typeName: '활발한 감자',
    imagePath: '/cheerful%20potato.png',
    opportunity: '서포터즈',
    reason: '사람을 만나고 현장을 뛰는 서포터즈에서 제일 빛나요.',
    chipBg: '#FFF2CC',
  },
  {
    typeName: '탐구하는 감자',
    imagePath: '/searching%20potato.png',
    opportunity: '프로젝트 · 현장실습',
    reason: '한 주제를 깊게 파 보는 프로젝트·현장실습이 잘 맞아요.',
    chipBg: '#E6F1F8',
  },
  {
    typeName: '창의적인 감자',
    imagePath: '/creative%20potato.png',
    opportunity: '공모전',
    reason: '아이디어 하나로 승부하는 공모전에서 실력이 드러나요.',
    chipBg: '#F1EBFF',
  },
  {
    typeName: '든든한 감자',
    imagePath: '/dependable%20potato.png',
    opportunity: '현장실습 · 취업',
    reason: '맡은 일을 끝까지 해내는 힘은 현장실습과 채용에서 바로 보여요.',
    chipBg: '#F8ECD8',
  },
] as const;

export function QuizPromoBanner({ onStartQuiz }: QuizPromoBannerProps) {
  const [propsImageFailed, setPropsImageFailed] = useState(false);

  return (
    <section
      aria-label="감자 유형 테스트 안내"
      className="py-10 sm:py-14 bg-[#FAF8F2] border-t-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-5 py-6 sm:px-8 sm:py-7 shadow-[0_5px_0_#3A2A20] space-y-6">
            {/* 상단 진입 배너 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
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

                <div className="space-y-1.5 min-w-0">
                  <div className="text-xs font-medium text-[#3D7D47]">
                    미니 테스트 · 감자 유형 찾기
                  </div>
                  <p className="font-display text-lg sm:text-[22px] text-[#3A2A20] leading-snug">
                    잠깐! 나는 어떤 감자일까? — 8개 질문으로 알아보는 나의 캠퍼스
                    감자 유형
                  </p>
                  <p className="text-sm text-[#1F1712] leading-relaxed">
                    앱에서 테스트하면 내 감자가 유형 소품을 쓰고, 유형에 맞는
                    춘천 기회를 바로 추천해 줘요.
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

            {/* 소품 감자 5종 전체 이미지 */}
            <div
              data-testid="potato-props-lineup"
              className="pt-5 border-t-2 border-dashed border-[#3A2A20]/15 space-y-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg sm:text-xl text-[#3A2A20]">
                  유형별 소품 감자 5종
                </h3>
                <span className="text-xs text-[#332720]">
                  테스트 결과에 따라 내 감자가 유형 소품을 써요
                </span>
              </div>

              {!propsImageFailed ? (
                <div className="rounded-2xl bg-white border-2 border-[#3A2A20]/15 px-2.5 py-3 sm:px-5 sm:py-4 overflow-hidden">
                  <img
                    src={POTATO_PROPS_IMAGE_PATH}
                    alt="유형별 소품 감자 5종 — 활발한 감자(노란 머리띠), 차분한 감자(동그란 안경), 탐구하는 감자(탐험 모자), 창의적인 감자(빨간 베레모), 든든한 감자(네모 안경)"
                    onError={() => setPropsImageFailed(true)}
                    className="w-full h-auto block rounded-xl mix-blend-multiply"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-[#FAF8F2] border-2 border-dashed border-[#3A2A20]/20 px-4 py-5 text-center space-y-1">
                  <p className="font-display text-sm sm:text-base text-[#3A2A20]">
                    활발한 감자 · 차분한 감자 · 탐구하는 감자 · 창의적인 감자 ·
                    든든한 감자
                  </p>
                  <p className="text-xs text-[#332720]">
                    소품 감자 5종 이미지(<code>/potato-props.jpg</code>)가
                    업로드되면 이곳에 표시돼요.
                  </p>
                </div>
              )}
            </div>

            {/* 하단 유형별 잘 맞는 기회 표 */}
            <div
              data-testid="type-opportunity-table"
              className="pt-5 border-t-2 border-dashed border-[#3A2A20]/15 space-y-3.5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-xl text-[#3A2A20]">
                  유형별 잘 맞는 기회
                </h3>
                <span className="text-xs text-[#332720]">
                  감자 유형에 따라 춘천·온라인 추천 기회가 달라져요
                </span>
              </div>

              {/* 데스크톱·태블릿 표 */}
              <div className="hidden md:block overflow-hidden rounded-2xl border-2 border-[#3A2A20]/20 bg-[#FAF8F2]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#EEF5E4] border-b-2 border-[#3A2A20]/15 text-xs font-display text-[#3A2A20]">
                      <th scope="col" className="py-3 px-4 w-[180px]">
                        감자 유형
                      </th>
                      <th scope="col" className="py-3 px-4 w-[190px]">
                        잘 맞는 기회
                      </th>
                      <th scope="col" className="py-3 px-4">
                        추천 포인트
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3A2A20]/12 bg-[#FFFDF7]">
                    {TYPE_OPPORTUNITY_MATCHES.map((row) => (
                      <tr key={row.typeName} className="align-middle">
                        <th
                          scope="row"
                          className="py-3 px-4 font-display font-normal text-base text-[#3A2A20] whitespace-nowrap"
                        >
                          <div className="inline-flex items-center gap-2.5">
                            <span
                              className="w-9 h-9 rounded-xl border border-[#3A2A20]/18 flex items-center justify-center p-1 shrink-0"
                              style={{ backgroundColor: row.chipBg }}
                            >
                              <img
                                src={row.imagePath}
                                alt=""
                                aria-hidden="true"
                                className="w-full h-full object-contain"
                              />
                            </span>
                            <span>{row.typeName}</span>
                          </div>
                        </th>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full border border-[#3A2A20]/20 font-display text-xs text-[#3A2A20]"
                            style={{ backgroundColor: row.chipBg }}
                          >
                            {row.opportunity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#1F1712] leading-relaxed">
                          {row.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 모바일(375px 포함) 카드 리스트 */}
              <ul className="md:hidden space-y-2.5">
                {TYPE_OPPORTUNITY_MATCHES.map((row) => (
                  <li
                    key={row.typeName}
                    className="rounded-2xl bg-[#FAF8F2] border border-[#3A2A20]/18 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 min-w-0">
                        <span
                          className="w-8 h-8 rounded-xl border border-[#3A2A20]/18 flex items-center justify-center p-1 shrink-0"
                          style={{ backgroundColor: row.chipBg }}
                        >
                          <img
                            src={row.imagePath}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-contain"
                          />
                        </span>
                        <span className="font-display text-base text-[#3A2A20] whitespace-nowrap">
                          {row.typeName}
                        </span>
                      </div>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-[#3A2A20]/20 font-display text-xs text-[#3A2A20] whitespace-nowrap shrink-0"
                        style={{ backgroundColor: row.chipBg }}
                      >
                        {row.opportunity}
                      </span>
                    </div>
                    <p className="text-sm text-[#1F1712] leading-relaxed">
                      {row.reason}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
