export interface ObserverEntryLike {
  isIntersecting: boolean;
  intersectionRatio?: number;
}

export function getRevealDelay(
  index: number,
  stepMs = 90,
  maxMs = 360
): number {
  if (!Number.isFinite(index) || index <= 0) return 0;
  return Math.min(maxMs, Math.round(index * stepMs));
}

export function shouldRevealFromEntries(
  entries: ReadonlyArray<ObserverEntryLike>
): boolean {
  return entries.some(
    (entry) =>
      entry.isIntersecting ||
      (typeof entry.intersectionRatio === 'number' &&
        entry.intersectionRatio > 0)
  );
}
