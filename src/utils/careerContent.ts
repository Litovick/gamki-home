import { CareActionId, GrowthStage } from './potatoLogic';

export type CoreFeatureTabId = 'opportunities' | 'roadmap' | 'community';

export type OpportunityCategory = '전체' | '공모전' | '서포터즈' | '인턴·실습';

export type OpportunityStatus = '마감 임박' | '모집 중' | '곧 열려요' | '수시·정기';

export interface OpportunityPreviewItem {
  id: string;
  category: Exclude<OpportunityCategory, '전체'>;
  status: OpportunityStatus;
  title: string;
  organization: string;
  deadlineLabel: string;
}

export type CommunityBoard = '선배 조언' | '질문' | '후기' | '자유';
export type CommunitySort = '최신순' | '공감순' | '우리 계열만';

export interface CommunityPostItem {
  id: string;
  board: CommunityBoard;
  pinned?: boolean;
  authorMeta: string;
  sameMajorField: boolean;
  title: string;
  excerpt: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

export interface CareerCareFlowItem {
  id: CareActionId;
  activityTitle: string;
  careTitle: string;
  description: string;
  buttonLabel: string;
  feedbackText: string;
  addsRecordStep?: boolean;
}

export interface RecordGrowthStep {
  stage: GrowthStage;
  recordsRequired: number;
  name: string;
  shortLabel: string;
  caption: string;
}

export const OPPORTUNITY_STATUS_ORDER: readonly OpportunityStatus[] = [
  '마감 임박',
  '모집 중',
  '곧 열려요',
  '수시·정기',
] as const;

export const OPPORTUNITY_SAMPLES: readonly OpportunityPreviewItem[] = [
  {
    id: 'policy-idea-contest',
    category: '공모전',
    status: '마감 임박',
    title: '대학생 정책 아이디어 공모전',
    organization: '한국정책분석평가학회',
    deadlineLabel: '11.26 마감',
  },
  {
    id: 'mime-festival',
    category: '공모전',
    status: '곧 열려요',
    title: '춘천마임축제 국내참가작 공모',
    organization: '춘천마임축제',
    deadlineLabel: '매년 11월~1월 접수',
  },
  {
    id: 'kto-youth-intern',
    category: '인턴·실습',
    status: '곧 열려요',
    title: '한국관광공사 체험형 청년인턴',
    organization: '한국관광공사(본사 원주)',
    deadlineLabel: '해마다 여러 차례',
  },
  {
    id: 'chuncheon-scholarship',
    category: '서포터즈',
    status: '수시·정기',
    title: '춘천인재육성장학재단 서포터즈',
    organization: '(재)춘천인재육성장학재단',
    deadlineLabel: '매년 6월 모집',
  },
] as const;

export const COMMUNITY_SAMPLES: readonly CommunityPostItem[] = [
  {
    id: 'senior-1',
    board: '선배 조언',
    pinned: true,
    authorMeta: '익명 감자 · 춘천 소재 대학 · 경영·경제계열 · 4학년',
    sameMajorField: true,
    title: '2학년 때 춘천 지역 서포터즈 하나만 끝까지 해봐도 자소서 소재가 달라져요',
    excerpt:
      '처음엔 거창한 대외활동만 찾았는데, 로드맵 1단계부터 차근차근 채우며 한 줄 기록을 모아두니 졸업 학기에 정리하기가 훨씬 수월했어요.',
    likes: 34,
    comments: 9,
    timeAgo: '선배 이야기',
  },
  {
    id: 'qna-1',
    board: '질문',
    authorMeta: '익명 감자 · 춘천 소재 대학 · 인문·사회계열 · 2학년',
    sameMajorField: true,
    title: '전공 무관으로 지원할 수 있는 춘천 공모전 준비 팁 있을까요?',
    excerpt:
      '방학 동안 팀 프로젝트 경험을 쌓고 싶은데 첫 공모전이라 막막하네요. 경험 있으신 분들 조언 부탁드려요!',
    likes: 18,
    comments: 6,
    timeAgo: '15분 전',
  },
  {
    id: 'review-1',
    board: '후기',
    authorMeta: '익명 감자 · 춘천 소재 대학 · 공학·정보계열 · 3학년',
    sameMajorField: false,
    title: '강원 청년 현장실습 8주 마치고 이력서 초안까지 정리한 후기',
    excerpt:
      '매주 마친 일을 한 줄씩 기록해 뒀더니 마지막에 한 번에 복사해서 포트폴리오에 바로 넣을 수 있었어요.',
    likes: 27,
    comments: 5,
    timeAgo: '1시간 전',
  },
  {
    id: 'free-1',
    board: '자유',
    authorMeta: '익명 감자 · 춘천 소재 대학 · 자연·생명계열 · 1학년',
    sameMajorField: false,
    title: '오늘 드디어 내 감자 머리 위에 새싹이 돋았어요!',
    excerpt:
      '1학년 로드맵 첫 할 일 마치고 기록 남겼더니 싹이 올라와서 괜히 뿌듯하네요. 다들 이번 학기 파이팅!',
    likes: 22,
    comments: 7,
    timeAgo: '3시간 전',
  },
] as const;

export const CAREER_CARE_FLOWS: readonly CareerCareFlowItem[] = [
  {
    id: 'water',
    activityTitle: '앱 열기',
    careTitle: '물 주기',
    description:
      "하루 한 번 앱을 열어 내 진로를 확인하면 감자에게 '물'을 줘요.",
    buttonLabel: '물 주기 체험',
    feedbackText: '오늘의 진로를 확인하며 감자에게 시원한 물을 줬어요!',
  },
  {
    id: 'sun',
    activityTitle: '기회 탐색·스크랩',
    careTitle: '햇빛 받기',
    description:
      "기회 원문을 처음 열거나 스크랩하면 감자에게 '햇빛'이 들어가요.",
    buttonLabel: '햇빛 받기 체험',
    feedbackText: '관심 기회를 스크랩해 감자가 따뜻한 햇빛을 듬뿍 받았어요!',
  },
  {
    id: 'fertilizer',
    activityTitle: '로드맵 한 줄 기록',
    careTitle: '거름 주기',
    description:
      "학년별 할 일을 마치고 기록을 남기면 감자에게 '거름'을 줘요.",
    buttonLabel: '거름 주기 체험',
    feedbackText: '한 줄 기록이 쌓여 감자 머리 위 싹이 쑥 자라났어요!',
    addsRecordStep: true,
  },
] as const;

export const RECORD_GROWTH_STEPS: readonly RecordGrowthStep[] = [
  {
    stage: 0,
    recordsRequired: 0,
    name: '씨감자',
    shortLabel: '씨감자(0)',
    caption: '진로 여정을 막 시작한 첫 번째 감자예요.',
  },
  {
    stage: 1,
    recordsRequired: 3,
    name: '새싹 감자',
    shortLabel: '새싹 감자(3)',
    caption: '기록 3개가 모여 귀여운 첫 새싹이 돋아났어요.',
  },
  {
    stage: 2,
    recordsRequired: 6,
    name: '잎 난 감자',
    shortLabel: '잎 난 감자(6)',
    caption: '기록 6개가 쌓여 튼튼한 양쪽 잎이 활짝 펴졌어요.',
  },
  {
    stage: 3,
    recordsRequired: 9,
    name: '꽃봉오리 감자',
    shortLabel: '꽃봉오리 감자(9)',
    caption: '기록 9개가 모여 연보랏빛 꽃봉오리가 맺혔어요.',
  },
  {
    stage: 4,
    recordsRequired: 12,
    name: '꽃 핀 감자',
    shortLabel: '꽃 핀 감자(12)',
    caption: '12단계 기록을 모두 채워 감자꽃이 활짝 피었어요!',
  },
] as const;

export function getGrowthStageFromRecords(records: number): GrowthStage {
  if (!Number.isFinite(records) || records < 3) return 0;
  if (records < 6) return 1;
  if (records < 9) return 2;
  if (records < 12) return 3;
  return 4;
}

export function filterOpportunities(
  items: readonly OpportunityPreviewItem[],
  category: OpportunityCategory
): OpportunityPreviewItem[] {
  const filtered =
    category === '전체'
      ? [...items]
      : items.filter((item) => item.category === category);

  return filtered.sort(
    (a, b) =>
      OPPORTUNITY_STATUS_ORDER.indexOf(a.status) -
      OPPORTUNITY_STATUS_ORDER.indexOf(b.status)
  );
}

export function filterCommunityPosts(
  items: readonly CommunityPostItem[],
  board: CommunityBoard,
  sort: CommunitySort
): CommunityPostItem[] {
  let list = items.filter((item) => item.board === board);
  if (sort === '우리 계열만') {
    const majorOnly = list.filter((item) => item.sameMajorField);
    list = majorOnly.length > 0 ? majorOnly : list;
  }
  if (sort === '공감순') {
    list = [...list].sort((a, b) => b.likes - a.likes);
  }
  return list;
}
