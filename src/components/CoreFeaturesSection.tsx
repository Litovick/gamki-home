import { useState } from 'react';
import { Bookmark, Check, Copy, Heart, MessageCircle } from 'lucide-react';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import {
  GRADE_ROADMAPS,
  GradeNumber,
  getGrowthStageInfo,
  getRoadmapByGrade,
} from '../utils/potatoLogic';
import {
  COMMUNITY_SAMPLES,
  CommunityBoard,
  CommunitySort,
  CoreFeatureTabId,
  OPPORTUNITY_SAMPLES,
  OpportunityCategory,
  filterCommunityPosts,
  filterOpportunities,
} from '../utils/careerContent';

const FEATURE_TABS: readonly {
  id: CoreFeatureTabId;
  orderLabel: string;
  title: string;
  headline: string;
  description: string;
  points: readonly string[];
}[] = [
  {
    id: 'opportunities',
    orderLabel: '01 · 기회 찾기',
    title: '기회 찾기',
    headline: '“할 게 없다며? 여기 있는데.”',
    description:
      '춘천 지역과 온라인에서 참여할 수 있는 서포터즈·공모전·프로젝트·인턴·현장실습·취업 기회를 내 로드맵에 맞춰 모아 보여줘요. 춘천·온라인 기회 51개, 24개 직무별 맞춤 추천 (2026.11.23 조사)',
    points: [
      '마감 지난 공고는 자동 숨김, 마감 임박 → 모집 중 → 곧 열려요 → 수시·정기 순으로 자동 정리',
      '유형별 필터, 키워드 검색, 온라인·우리 학교 전용 기회 구분',
      '관심 기회를 스크랩하면 마감 3일 전·하루 전, 정기 모집 시작 달 1일에 알림 발송',
    ],
  },
  {
    id: 'roadmap',
    orderLabel: '02 · 학년별 로드맵',
    title: '학년별 로드맵',
    headline: '“학년마다 할 일, 하나씩.”',
    description:
      '12개 계열·24개 직무 중 내가 고른 관심 직무에 맞춰 1학년부터 4학년까지 채워야 할 전공 경험을 단계별로 안내해요.',
    points: [
      '감자 밭 사이 흙길에 1~4학년 정류장, 끝은 "지원서 쓰기" 깃발. 지금 학년 정류장에 감자가 서 있어요',
      '학년마다 할 일 3개(내 직무 1 + 공통 2). 할 일을 한 만큼 길이 초록으로 칠해져요',
      '끝낸 일에 한 줄씩 남기면 이력서 초안으로 바로 복사. 12개를 다 해도 "취업 성공"이 아니라 "이 기록으로 지원서 써 보자"',
    ],
  },
  {
    id: 'community',
    orderLabel: '03 · 대학생 커뮤니티',
    title: '춘천 대학생 커뮤니티',
    headline: '“같이 묻고, 같이 크자.”',
    description:
      '같은 지역 대학생끼리 진로 고민, 활동 후기, 선배 조언을 부담 없이 묻고 답하는 익명 공간이에요.',
    points: [
      '게시판 4개: 선배 조언 · 질문 · 후기 · 자유. 최신순·공감순, 우리 계열만 보기',
      '이름 대신 "익명 감자 · 한림대 · 미디어 · 2학년"처럼 학교·계열·학년만 보여요',
      '신고가 3번 쌓이면 글이 자동으로 숨겨져요. 읽기는 누구나, 쓰기는 로그인한 사람만',
    ],
  },
] as const;

const OPPORTUNITY_CATEGORIES: readonly OpportunityCategory[] = [
  '전체',
  '공모전',
  '서포터즈',
  '인턴·실습',
] as const;

const COMMUNITY_BOARDS: readonly CommunityBoard[] = [
  '선배 조언',
  '질문',
  '후기',
  '자유',
] as const;

const COMMUNITY_SORTS: readonly CommunitySort[] = [
  '최신순',
  '공감순',
  '우리 계열만',
] as const;

const STATUS_STYLE_MAP: Record<string, string> = {
  '마감 임박': 'bg-[#FDECE8] text-[#A43E2E] border-[#E4A89B]',
  '모집 중': 'bg-[#E9F5E3] text-[#2F6B38] border-[#9FD09A]',
  '곧 열려요': 'bg-[#F4EEFD] text-[#5B458B] border-[#C9B6F2]',
  '수시·정기': 'bg-[#FAF3E1] text-[#7D5B26] border-[#DFC690]',
};

const ROADMAP_SLOT_LABELS = [
  { tag: '내 직무 맞춤', linkedNotice: '연결 공고: 춘천·청년 맞춤 일경험 바로가기' },
  { tag: '공통 경험 1', linkedNotice: '연결 공고: 교내·지역 참여 활동 바로가기' },
  { tag: '공통 경험 2', linkedNotice: '연결 공고: 서포터즈·프로젝트 공고 바로가기' },
] as const;

export function CoreFeaturesSection() {
  const [activeTab, setActiveTab] =
    useState<CoreFeatureTabId>('opportunities');

  // ① 기회 찾기 미리보기 상태
  const [oppCategory, setOppCategory] = useState<OpportunityCategory>('전체');
  const [scrappedIds, setScrappedIds] = useState<string[]>([
    'policy-idea-contest',
  ]);

  // ② 학년별 로드맵 미리보기 상태
  const [selectedGrade, setSelectedGrade] = useState<GradeNumber>(1);
  const [copiedResume, setCopiedResume] = useState(false);

  // ③ 커뮤니티 미리보기 상태
  const [communityBoard, setCommunityBoard] =
    useState<CommunityBoard>('선배 조언');
  const [communitySort, setCommunitySort] = useState<CommunitySort>('최신순');

  const activeFeature =
    FEATURE_TABS.find((item) => item.id === activeTab) ?? FEATURE_TABS[0];

  const visibleOpportunities = filterOpportunities(
    OPPORTUNITY_SAMPLES,
    oppCategory
  );
  const currentRoadmap = getRoadmapByGrade(selectedGrade);
  const currentGrowthInfo = getGrowthStageInfo(currentRoadmap.growthStage);
  const visiblePosts = filterCommunityPosts(
    COMMUNITY_SAMPLES,
    communityBoard,
    communitySort
  );

  const handleToggleScrap = (id: string) => {
    setScrappedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResumePreviewCopy = () => {
    setCopiedResume(true);
    window.setTimeout(() => setCopiedResume(false), 1800);
  };

  return (
    <section
      id="core-features"
      className="scroll-mt-16 py-20 sm:py-24 bg-[#FFFDF7] border-b-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl space-y-3 mb-10">
          <p className="text-sm font-medium text-[#3D7D47]">
            직업 · 경험 찾기 핵심 기능
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            감자 키우기의 핵심 커리어 기능 3가지
          </h2>
          <p className="text-base text-[#1F1712] leading-relaxed">
            막막한 진로 준비를 춘천 지역 기회 탐색, 4개 학년 맞춤 로드맵, 그리고
            익명 대학생 커뮤니티로 부담 없이 시작해 보세요.
          </p>
        </Reveal>

        {/* 3가지 핵심 기능 전환 탭 */}
        <Reveal delayMs={60}>
          <div
            role="tablist"
            aria-label="핵심 커리어 기능 선택"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7"
          >
            {FEATURE_TABS.map((tab) => {
              const isSelected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`core-tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`core-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-state-item text-left rounded-2xl border-2 px-5 py-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                    isSelected
                      ? 'relative z-10 opacity-100 scale-[1.02] -translate-y-0.5 bg-[#3A2A20] text-[#FFFDF7] border-[#3A2A20] shadow-[0_4px_0_#1e140e]'
                      : 'opacity-50 scale-[0.98] bg-[#FAF6EC] text-[#3A2A20] border-[#3A2A20]/25 hover:opacity-85 hover:scale-100 hover:border-[#3A2A20] hover:bg-[#F3ECDC]'
                  }`}
                >
                  <div
                    className={`text-xs font-medium ${
                      isSelected ? 'text-[#FFE7A3]' : 'text-[#3D7D47]'
                    }`}
                  >
                    {tab.orderLabel}
                  </div>
                  <div className="font-display text-xl mt-0.5">{tab.title}</div>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* 선택된 기능 상세 설명 + 미니 앱 미리보기 */}
        <Reveal delayMs={120}>
          <div
            role="tabpanel"
            id={`core-panel-${activeFeature.id}`}
            aria-labelledby={`core-tab-${activeFeature.id}`}
            className="rounded-[28px] bg-[#FAF6EC] border-2 border-[#3A2A20] p-6 sm:p-8 shadow-[0_6px_0_#3A2A20]"
          >
            <div
              key={activeFeature.id}
              className="tab-panel-fade grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* 좌측: 기능 핵심 설명 + 주요 포인트 3개 */}
              <div className="lg:col-span-5 space-y-5">
                <div className="space-y-2.5">
                  <div className="text-sm font-medium text-[#3D7D47]">
                    {activeFeature.orderLabel}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl text-[#3A2A20] leading-snug">
                    {activeFeature.headline}
                  </h3>
                  <p className="text-base text-[#1F1712] leading-relaxed">
                    {activeFeature.description}
                  </p>
                </div>

                <ul className="space-y-3 pt-1">
                  {activeFeature.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl bg-[#FFFDF7] border border-[#3A2A20]/15 px-4 py-3.5 text-sm sm:text-[16.5px] text-[#1F1712] leading-relaxed"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#E6F4DB] border border-[#3A2A20]/30 font-display text-xs text-[#2F6B38] shrink-0"
                      >
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 우측: 미니 앱 화면 미리보기 */}
              <div className="lg:col-span-7">
                {activeTab === 'opportunities' && (
                  <div className="rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-5 sm:p-6 shadow-[0_4px_0_#3A2A20]">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#3A2A20]/12">
                      <div>
                        <div className="text-xs text-[#3D7D47] font-medium">
                          앱 기회 목록 미리보기
                        </div>
                        <h4 className="font-display text-xl text-[#3A2A20]">
                          춘천 · 온라인 맞춤 기회
                        </h4>
                      </div>
                      <span className="text-xs text-[#332720]">
                        마감 지난 공고 자동 숨김
                      </span>
                    </div>

                    {/* 유형별 필터 */}
                    <div
                      className="mt-4 flex flex-wrap items-center gap-1.5"
                      role="group"
                      aria-label="기회 유형 필터"
                    >
                      {OPPORTUNITY_CATEGORIES.map((category) => {
                        const active = oppCategory === category;
                        return (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setOppCategory(category)}
                            aria-pressed={active}
                            className={`px-3 py-1.5 rounded-xl border-2 text-xs sm:text-sm font-display transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                              active
                                ? 'bg-[#3D7D47] text-[#FFFDF7] border-[#3A2A20]'
                                : 'bg-[#FAF6EC] text-[#3A2A20] border-[#3A2A20]/20 hover:border-[#3A2A20]'
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>

                    {/* 기회 미니 카드 리스트 */}
                    <div className="mt-4 space-y-3">
                      {visibleOpportunities.map((item) => {
                        const isScrapped = scrappedIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            className="rounded-2xl bg-[#FAF8F2] border border-[#3A2A20]/18 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0 space-y-1">
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span
                                  className={`px-2 py-0.5 rounded-lg border font-medium whitespace-nowrap ${
                                    STATUS_STYLE_MAP[item.status]
                                  }`}
                                >
                                  {item.status}
                                </span>
                                <span className="text-[#332720]">
                                  {item.organization}
                                </span>
                              </div>
                              <div className="font-display text-base sm:text-lg text-[#3A2A20] leading-snug">
                                {item.title}
                              </div>
                              <div className="text-xs text-[#332720]">
                                {item.deadlineLabel}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggleScrap(item.id)}
                              aria-pressed={isScrapped}
                              aria-label={`${item.title} 스크랩`}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-display whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                                isScrapped
                                  ? 'bg-[#FFE7A3] text-[#3A2A20] border-[#3A2A20]'
                                  : 'bg-[#FFFDF7] text-[#1F1712] border-[#3A2A20]/25 hover:border-[#3A2A20]'
                              }`}
                            >
                              <Bookmark
                                className={`w-3.5 h-3.5 ${
                                  isScrapped ? 'fill-[#3A2A20]' : ''
                                }`}
                                aria-hidden="true"
                              />
                              <span>{isScrapped ? '알림 예약됨' : '스크랩'}</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <p className="mt-4 text-xs text-[#1F1712] bg-[#F3F8EB] rounded-xl px-3.5 py-2.5 border border-[#3D7D47]/20">
                      스크랩한 기회는 마감 3일 전·하루 전, 정기 모집 시작 달 1일에
                      알림을 보내드려요. (현재 {scrappedIds.length}개 스크랩됨)
                    </p>
                  </div>
                )}

                {activeTab === 'roadmap' && (
                  <div className="rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-5 sm:p-6 shadow-[0_4px_0_#3A2A20]">
                    {/* 상단 학년 연동 감자 + 성장 단계 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3A2A20]/12">
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-[#F4F9EC] border border-[#3A2A20]/15 px-3 py-1.5 shrink-0">
                          <Mascot
                            mood="happy"
                            grow={currentRoadmap.growthStage}
                            size={82}
                            animate
                            alt={`${currentRoadmap.label} 연계 감자: ${currentGrowthInfo.name}`}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-[#3D7D47]">
                            {currentRoadmap.label} 로드맵 · 총 12단계 중 3단계
                          </div>
                          <h4 className="font-display text-xl sm:text-2xl text-[#3A2A20]">
                            {currentGrowthInfo.name}
                          </h4>
                          <p className="text-xs text-[#332720] mt-0.5">
                            새싹 → 잎 → 꽃봉오리 → 꽃 단계로 이어져요
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResumePreviewCopy}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE6D2] border-2 border-[#3A2A20] text-xs font-display text-[#3A2A20] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                      >
                        {copiedResume ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#3D7D47]" />
                            <span>이력서 초안 복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>이력서 초안 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* 1학년~4학년 전환 탭 */}
                    <div
                      role="tablist"
                      aria-label="로드맵 학년 선택"
                      className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                    >
                      {GRADE_ROADMAPS.map((item) => {
                        const selected = item.grade === selectedGrade;
                        return (
                          <button
                            key={item.grade}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            onClick={() => setSelectedGrade(item.grade)}
                            className={`tab-state-item py-2.5 px-3 rounded-xl border-2 font-display text-sm whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                              selected
                                ? 'relative z-10 opacity-100 scale-[1.04] -translate-y-0.5 bg-[#3A2A20] text-[#FFFDF7] border-[#3A2A20] shadow-[0_3px_0_#1e140e] ring-2 ring-[#3D7D47]/30'
                                : 'opacity-50 scale-[0.96] bg-[#FAF6EC] text-[#3A2A20] border-[#3A2A20]/20 hover:opacity-85 hover:scale-100 hover:border-[#3A2A20]'
                            }`}
                          >
                            {item.label} · {item.growthLabel}
                          </button>
                        );
                      })}
                    </div>

                    {/* 선택된 학년의 3개 할 일 (내 직무 맞춤 1 + 공통 2) */}
                    <div
                      key={currentRoadmap.grade}
                      className="mt-4 space-y-2.5 tab-panel-fade"
                      data-testid="roadmap-preview-panel"
                    >
                      {currentRoadmap.slots.map((slotText, idx) => (
                        <div
                          key={`${currentRoadmap.grade}-${idx}`}
                          className="rounded-2xl bg-[#FAF8F2] border border-[#3A2A20]/18 p-4 space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="font-display text-[#3D7D47]">
                              {ROADMAP_SLOT_LABELS[idx].tag}
                            </span>
                            <span className="text-[#332720]">
                              {currentRoadmap.label} 목표 {idx + 1}
                            </span>
                          </div>
                          <p className="text-sm sm:text-[16.5px] text-[#3A2A20] font-medium">
                            {slotText}
                          </p>
                          <div className="text-xs text-[#332720] pt-1 border-t border-dashed border-[#3A2A20]/15">
                            {ROADMAP_SLOT_LABELS[idx].linkedNotice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'community' && (
                  <div className="rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-5 sm:p-6 shadow-[0_4px_0_#3A2A20]">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#3A2A20]/12">
                      <div>
                        <div className="text-xs text-[#3D7D47] font-medium">
                          앱 커뮤니티 미리보기
                        </div>
                        <h4 className="font-display text-xl text-[#3A2A20]">
                          춘천 대학생 익명 게시판
                        </h4>
                      </div>
                      <span className="text-xs text-[#332720]">
                        이름 없이 안전하게 질문해요
                      </span>
                    </div>

                    {/* 게시판 탭 + 정렬 필터 */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div
                        className="flex flex-wrap items-center gap-1.5"
                        role="group"
                        aria-label="커뮤니티 게시판 선택"
                      >
                        {COMMUNITY_BOARDS.map((board) => {
                          const active = communityBoard === board;
                          return (
                            <button
                              key={board}
                              type="button"
                              onClick={() => setCommunityBoard(board)}
                              aria-pressed={active}
                              className={`px-3 py-1.5 rounded-xl border-2 text-xs sm:text-sm font-display transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                                active
                                  ? 'bg-[#3D7D47] text-[#FFFDF7] border-[#3A2A20]'
                                  : 'bg-[#FAF6EC] text-[#3A2A20] border-[#3A2A20]/20 hover:border-[#3A2A20]'
                              }`}
                            >
                              {board}
                            </button>
                          );
                        })}
                      </div>

                      <div
                        className="flex items-center gap-1.5 text-xs"
                        role="group"
                        aria-label="커뮤니티 정렬 필터"
                      >
                        {COMMUNITY_SORTS.map((sort) => {
                          const active = communitySort === sort;
                          return (
                            <button
                              key={sort}
                              type="button"
                              onClick={() => setCommunitySort(sort)}
                              aria-pressed={active}
                              className={`px-2.5 py-1 rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                                active
                                  ? 'bg-[#3A2A20] text-[#FFFDF7] border-[#3A2A20]'
                                  : 'bg-[#FFFDF7] text-[#1F1712] border-[#3A2A20]/20 hover:border-[#3A2A20]'
                              }`}
                            >
                              {sort}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 게시글 목록 */}
                    <div className="mt-4 space-y-3">
                      {visiblePosts.map((post) => (
                        <article
                          key={post.id}
                          className={`rounded-2xl p-4 border-2 ${
                            post.pinned
                              ? 'bg-[#F4F9EC] border-[#3D7D47]/50'
                              : 'bg-[#FAF8F2] border-[#3A2A20]/15'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#1F1712] mb-1.5">
                            <span className="font-medium text-[#3A2A20]">
                              {post.authorMeta}
                            </span>
                            <span className="text-[#3D7D47] font-medium">
                              {post.timeAgo}
                            </span>
                          </div>
                          <h5 className="font-display text-base sm:text-lg text-[#3A2A20] mb-1">
                            {post.title}
                          </h5>
                          <p className="text-sm text-[#1F1712] leading-relaxed">
                            {post.excerpt}
                          </p>
                          <div className="mt-3 flex items-center gap-4 text-xs text-[#332720] tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                              공감 {post.likes}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle
                                className="w-3.5 h-3.5"
                                aria-hidden="true"
                              />
                              댓글 {post.comments}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
