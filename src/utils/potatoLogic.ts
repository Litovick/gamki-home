export const APP_LIVE_URL = 'https://gamja-kiugi.vercel.app/';

export type MoodType = 'happy' | 'neutral' | 'annoyed' | 'angry';

export type GrowthStage = 0 | 1 | 2 | 3 | 4;

export type GradeNumber = 1 | 2 | 3 | 4;

export type CareActionId = 'water' | 'sun' | 'fertilizer';

export interface MoodInfo {
  mood: MoodType;
  label: string;
  dayRangeLabel: string;
  shortButtonLabel: string;
  quickDayValue: number;
  imageSrc: string;
  speechPlaceholder: string;
  descriptionPlaceholder: string;
  accentBg: string;
}

export interface GrowthStageInfo {
  stage: GrowthStage;
  name: string;
  shortName: string;
  minEnergy: number;
  stemTop: number;
}

export interface CareActionItem {
  id: CareActionId;
  title: string;
  energyGain: number;
  descriptionPlaceholder: string;
  feedbackText: string;
}

export interface GradeRoadmap {
  grade: GradeNumber;
  label: string;
  growthStage: GrowthStage;
  growthLabel: string;
  slots: string[];
}

export const STEM_TOP: readonly number[] = [134, 110, 98, 84, 76] as const;

export const MOOD_STAGES: readonly MoodInfo[] = [
  {
    mood: 'happy',
    label: '웃음',
    dayRangeLabel: '오늘 (0~1일)',
    shortButtonLabel: '오늘',
    quickDayValue: 0,
    imageSrc: '/mascot/happy.webp',
    speechPlaceholder: '감자가 오늘도 성장 중!',
    descriptionPlaceholder:
      '매일 들르면 감자가 환하게 웃어요. 하루 한 번 앱을 열면 물도 한 개 생겨요.',
    accentBg: '#F4F9EC',
  },
  {
    mood: 'neutral',
    label: '무표정',
    dayRangeLabel: '2일 (2~3일)',
    shortButtonLabel: '2일',
    quickDayValue: 2,
    imageSrc: '/mascot/neutral.webp',
    speechPlaceholder: '감자가 멈춰 있어요.',
    descriptionPlaceholder: '이틀만 안 와도 표정이 굳어요. 이날 첫 알림이 가요.',
    accentBg: '#FBF7EA',
  },
  {
    mood: 'annoyed',
    label: '짜증',
    dayRangeLabel: '4일 (4~6일)',
    shortButtonLabel: '4일',
    quickDayValue: 4,
    imageSrc: '/mascot/annoyed.webp',
    speechPlaceholder: '2학년 할 일 아직이야? 이대로 졸업할 거야?',
    descriptionPlaceholder:
      '지금 학년에 남은 할 일을 콕 집어 재촉해요. 맑은 낮이면 하늘이 누렇게 변해요.',
    accentBg: '#FDF1E6',
  },
  {
    mood: 'angry',
    label: '분노',
    dayRangeLabel: '7일 이상',
    shortButtonLabel: '7일',
    quickDayValue: 7,
    imageSrc: '/mascot/angry.webp',
    speechPlaceholder: '감자가 화났다. 새 기회 확인하러 와.',
    descriptionPlaceholder:
      '일주일 넘게 안 오면 감자가 화내고 하늘도 붉어져요. 이후엔 주 1회만 알림을 보내요.',
    accentBg: '#FCECEB',
  },
] as const;

export const GROWTH_STAGES: readonly GrowthStageInfo[] = [
  { stage: 0, name: '씨감자', shortName: '씨감자', minEnergy: 0, stemTop: STEM_TOP[0] },
  { stage: 1, name: '새싹 감자', shortName: '새싹', minEnergy: 25, stemTop: STEM_TOP[1] },
  { stage: 2, name: '잎 난 감자', shortName: '잎', minEnergy: 50, stemTop: STEM_TOP[2] },
  { stage: 3, name: '꽃봉오리 감자', shortName: '꽃봉오리', minEnergy: 75, stemTop: STEM_TOP[3] },
  { stage: 4, name: '꽃 핀 감자', shortName: '꽃', minEnergy: 100, stemTop: STEM_TOP[4] },
] as const;

export const CARE_ACTIONS: readonly CareActionItem[] = [
  {
    id: 'water',
    title: '하루 한 번, 물 주기',
    energyGain: 25,
    descriptionPlaceholder: '[기능 설명 입력 예정]',
    feedbackText: '시원한 물을 듬뿍 줬어요!',
  },
  {
    id: 'sun',
    title: '햇빛 받기',
    energyGain: 25,
    descriptionPlaceholder: '[기능 설명 입력 예정]',
    feedbackText: '춘천 호숫가 햇살을 듬뿍 받았어요!',
  },
  {
    id: 'fertilizer',
    title: '거름 주기',
    energyGain: 35,
    descriptionPlaceholder: '[기능 설명 입력 예정]',
    feedbackText: '영양 가득 거름으로 쑥쑥 자라나요!',
  },
] as const;

export const GRADE_ROADMAPS: readonly GradeRoadmap[] = [
  {
    grade: 1,
    label: '1학년',
    growthStage: 1,
    growthLabel: '새싹',
    slots: [
      '[1학년 할 일 1 입력 예정]',
      '[1학년 할 일 2 입력 예정]',
      '[1학년 할 일 3 입력 예정]',
    ],
  },
  {
    grade: 2,
    label: '2학년',
    growthStage: 2,
    growthLabel: '잎',
    slots: [
      '[2학년 할 일 1 입력 예정]',
      '[2학년 할 일 2 입력 예정]',
      '[2학년 할 일 3 입력 예정]',
    ],
  },
  {
    grade: 3,
    label: '3학년',
    growthStage: 3,
    growthLabel: '꽃봉오리',
    slots: [
      '[3학년 할 일 1 입력 예정]',
      '[3학년 할 일 2 입력 예정]',
      '[3학년 할 일 3 입력 예정]',
    ],
  },
  {
    grade: 4,
    label: '4학년',
    growthStage: 4,
    growthLabel: '꽃',
    slots: [
      '[4학년 할 일 1 입력 예정]',
      '[4학년 할 일 2 입력 예정]',
      '[4학년 할 일 3 입력 예정]',
    ],
  },
] as const;

export function clampAbsentDays(days: number): number {
  if (!Number.isFinite(days)) return 0;
  return Math.max(0, Math.min(10, Math.round(days)));
}

export function getMoodByAbsentDays(days: number): MoodInfo {
  const safeDays = Math.max(0, Math.floor(Number.isFinite(days) ? days : 0));
  if (safeDays <= 1) return MOOD_STAGES[0];
  if (safeDays <= 3) return MOOD_STAGES[1];
  if (safeDays <= 6) return MOOD_STAGES[2];
  return MOOD_STAGES[3];
}

export function getGrowthStageByEnergy(energy: number): GrowthStage {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(energy) ? energy : 0));
  if (clamped >= 100) return 4;
  if (clamped >= 75) return 3;
  if (clamped >= 50) return 2;
  if (clamped >= 25) return 1;
  return 0;
}

export function getGrowthStageInfo(stage: GrowthStage): GrowthStageInfo {
  return GROWTH_STAGES[stage];
}

export function applyCareAction(
  currentEnergy: number,
  actionId: CareActionId
): { energy: number; stage: GrowthStage; delta: number; feedback: string } {
  const action = CARE_ACTIONS.find((item) => item.id === actionId);
  const gain = action ? action.energyGain : 0;
  const safeCurrent = Math.max(0, Math.min(100, currentEnergy));
  const nextEnergy = Math.min(100, safeCurrent + gain);
  return {
    energy: nextEnergy,
    stage: getGrowthStageByEnergy(nextEnergy),
    delta: nextEnergy - safeCurrent,
    feedback: action ? action.feedbackText : '',
  };
}

export function getRoadmapByGrade(grade: GradeNumber): GradeRoadmap {
  return GRADE_ROADMAPS[grade - 1];
}

export function getMascotHeight(size: number): number {
  return Math.round(size * 1.16 * 100) / 100;
}
