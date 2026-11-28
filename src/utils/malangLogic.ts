import {
  PotatoTypeId,
  parseQuizRoute,
} from './potatoQuizLogic';

export const MALANG_HASH = '#malang';
export const EASTER_EGG_TARGET_TAPS = 5;
export const EASTER_EGG_TAP_WINDOW_MS = 2500;

export type AppRouteState =
  | { readonly view: 'home' }
  | { readonly view: 'malang' }
  | { readonly view: 'quiz'; readonly resultType: PotatoTypeId | null };

export interface TapStreakState {
  readonly count: number;
  readonly lastTapAt: number | null;
}

export interface TapStreakResult {
  readonly triggered: boolean;
  readonly state: TapStreakState;
}

/**
 * 해시(`#malang`, `#quiz`, `#quiz/result=...`) 및 쿼리(`?view=malang`, `?view=quiz`)를 통합 파싱합니다.
 */
export function parseAppRoute(hash: string, search = ''): AppRouteState {
  const normalizedHash = hash.trim().replace(/^#/, '').toLowerCase();

  if (normalizedHash === 'malang' || normalizedHash === 'malang/') {
    return { view: 'malang' };
  }

  if (search) {
    const params = new URLSearchParams(search);
    if (params.get('view')?.toLowerCase() === 'malang') {
      return { view: 'malang' };
    }
  }

  return parseQuizRoute(hash, search);
}

/**
 * 2.5초 이내 간격으로 연속 5회 클릭 시 이스터에그 트리거 여부를 계산합니다.
 */
export function advanceEasterEggTapCount(
  current: TapStreakState,
  nowMs: number,
  targetTaps = EASTER_EGG_TARGET_TAPS,
  windowMs = EASTER_EGG_TAP_WINDOW_MS
): TapStreakResult {
  const withinWindow =
    current.lastTapAt !== null &&
    nowMs >= current.lastTapAt &&
    nowMs - current.lastTapAt <= windowMs;

  const nextCount = withinWindow ? current.count + 1 : 1;

  if (nextCount >= targetTaps) {
    return {
      triggered: true,
      state: { count: 0, lastTapAt: null },
    };
  }

  return {
    triggered: false,
    state: { count: nextCount, lastTapAt: nowMs },
  };
}
