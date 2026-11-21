import { useState } from 'react';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import {
  GRADE_ROADMAPS,
  GradeNumber,
  getGrowthStageInfo,
  getRoadmapByGrade,
} from '../utils/potatoLogic';

export function RoadmapSection() {
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(1);
  const currentRoadmap = getRoadmapByGrade(selectedGrade);
  const currentGrowthInfo = getGrowthStageInfo(currentRoadmap.growthStage);

  return (
    <section id="roadmap" className="py-20 sm:py-24 bg-[#FFFDF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl space-y-3 mb-10">
          <p className="text-sm font-medium text-[#3D7D47]">
            대학 생활 성장 여정
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            내 4개 학년 로드맵
          </h2>
          <p className="text-base text-[#5B493E] leading-relaxed">
            1학년 새싹부터 4학년 활짝 핀 감자꽃까지, 학년별 목표와 함께
            감자도 나란히 성장해요.
          </p>
        </Reveal>

        {/* 상단 성장 단계 연동 표시 + 학년 전환 탭 */}
        <Reveal delayMs={100}>
          <div className="rounded-[28px] bg-[#FAF6EC] border-2 border-[#3A2A20] p-6 sm:p-8 shadow-[0_6px_0_#3A2A20]">
          {/* 성장 단계 연동 바 */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#3A2A20]/12">
            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-[#FFFDF7] border-2 border-[#3A2A20]/20 px-4 py-2 shrink-0">
                <Mascot
                  mood="happy"
                  grow={currentRoadmap.growthStage}
                  size={104}
                  animate
                  alt={`${currentRoadmap.label} 연계 성장 단계: ${currentGrowthInfo.name}`}
                />
              </div>

              <div className="space-y-1">
                <div className="text-sm text-[#3D7D47] font-medium">
                  {currentRoadmap.label} 성장 단계
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[#3A2A20]">
                  {currentGrowthInfo.name}
                </h3>
                <p className="text-sm text-[#5B493E]">
                  새싹 → 잎 → 꽃봉오리 → 꽃 단계가 학년과 함께 이어져요
                </p>
              </div>
            </div>

            {/* 4단계 시각적 연동 표시 */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 flex-wrap"
              aria-label="학년별 감자 성장 흐름"
            >
              {GRADE_ROADMAPS.map((item, idx) => {
                const isSelected = item.grade === selectedGrade;
                const isPassed = item.grade <= selectedGrade;
                return (
                  <div key={item.grade} className="flex items-center gap-1.5 sm:gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-sm font-display border transition-colors duration-150 whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#3D7D47] text-[#FFFDF7] border-[#3A2A20] shadow-[0_2px_0_#3A2A20]'
                          : isPassed
                          ? 'bg-[#E6F4DB] text-[#3A2A20] border-[#3A2A20]/30'
                          : 'bg-[#FFFDF7] text-[#8A796D] border-[#3A2A20]/15'
                      }`}
                    >
                      {item.growthLabel}
                    </span>
                    {idx < GRADE_ROADMAPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="text-sm text-[#6B584B]"
                      >
                        →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1학년~4학년 전환 탭 */}
          <div
            role="tablist"
            aria-label="학년 선택"
            className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5"
          >
            {GRADE_ROADMAPS.map((item) => {
              const isSelected = item.grade === selectedGrade;
              return (
                <button
                  key={item.grade}
                  type="button"
                  role="tab"
                  id={`grade-tab-${item.grade}`}
                  aria-selected={isSelected}
                  aria-controls={`grade-panel-${item.grade}`}
                  onClick={() => setSelectedGrade(item.grade)}
                  className={`py-3 px-4 rounded-2xl border-2 font-display text-lg transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                    isSelected
                      ? 'bg-[#3A2A20] text-[#FFFDF7] border-[#3A2A20] shadow-[0_3px_0_#1e140e]'
                      : 'bg-[#FFFDF7] text-[#3A2A20] border-[#3A2A20]/25 hover:border-[#3A2A20] hover:bg-[#F2ECE0]'
                  }`}
                >
                  {item.label} · {item.growthLabel}
                </button>
              );
            })}
          </div>

          {/* 선택된 학년의 할 일 카드 슬롯 3개 */}
          <div
            role="tabpanel"
            id={`grade-panel-${currentRoadmap.grade}`}
            aria-labelledby={`grade-tab-${currentRoadmap.grade}`}
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {currentRoadmap.slots.map((slotText, slotIdx) => (
              <div
                key={`${currentRoadmap.grade}-${slotIdx}`}
                className="rounded-2xl bg-[#FFFDF7] border-2 border-dashed border-[#3A2A20]/30 p-5 flex flex-col justify-between min-h-[144px] transition-colors hover:border-[#3A2A20]/60"
              >
                <div className="flex items-center justify-between text-xs text-[#6B584B] mb-3">
                  <span className="font-display text-sm text-[#3D7D47]">
                    {currentRoadmap.label} 목표 {slotIdx + 1}
                  </span>
                  <span>할 일 공란</span>
                </div>
                <p className="text-base text-[#4D3B30] leading-relaxed">
                  {slotText}
                </p>
              </div>
            ))}
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
