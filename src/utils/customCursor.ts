export const CURSOR_SIZE = 54;
export const CURSOR_HOTSPOT_X = 27;
export const CURSOR_HOTSPOT_Y = 33;

export const BASIC_CURSOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 100 100"><path d="M48 32 C66 32 82 48 84 65 C85 78 74 88 52 88 C30 88 17 83 17 67 C17 48 30 32 48 32 Z" fill="#CFA75C" stroke="#111111" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="73" cy="69" rx="3.2" ry="4.5" transform="rotate(28 73 69)" fill="#111111"/><ellipse cx="64" cy="77" rx="2.6" ry="3.8" transform="rotate(38 64 77)" fill="#111111"/></svg>`;

export const EVENT_CURSOR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 100 100"><path d="M48 32 C66 32 82 48 84 65 C85 78 74 88 52 88 C30 88 17 83 17 67 C17 48 30 32 48 32 Z" fill="#CFA75C" stroke="#111111" stroke-width="4.5" stroke-linejoin="round"/><ellipse cx="73" cy="69" rx="3.2" ry="4.5" transform="rotate(28 73 69)" fill="#111111"/><ellipse cx="64" cy="77" rx="2.6" ry="3.8" transform="rotate(38 64 77)" fill="#111111"/><path d="M50 32 C50 25 50 22 50 18" stroke="#628E4C" stroke-width="3.2" stroke-linecap="round" fill="none"/><path d="M50 19 C44 11 33 10 32 17 C31 23 42 24 50 19 Z" fill="#C6EA9F" stroke="#628E4C" stroke-width="2.6" stroke-linejoin="round"/><path d="M50 19 C56 11 67 10 68 17 C69 23 58 24 50 19 Z" fill="#C6EA9F" stroke="#628E4C" stroke-width="2.6" stroke-linejoin="round"/></svg>`;

/**
 * SVG 문자열의 #, 따옴표, 공백 등을 encodeURIComponent로 안전하게 인코딩해 SVG Data URL을 생성합니다.
 */
export function encodeSvgDataUrl(svg: string): string {
  const trimmed = svg.trim();
  if (!trimmed) return '';
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(trimmed)}`;
}

/**
 * SVG Data URL과 hotspot(기본 42 51), fallback(auto | pointer)으로 CSS cursor 속성 값을 생성합니다.
 */
export function buildCursorCssValue(
  svg: string | null,
  fallback: 'auto' | 'pointer',
  hotspotX: number = CURSOR_HOTSPOT_X,
  hotspotY: number = CURSOR_HOTSPOT_Y
): string {
  if (!svg || !svg.trim()) {
    return fallback;
  }
  const dataUrl = encodeSvgDataUrl(svg);
  return `url("${dataUrl}") ${hotspotX} ${hotspotY}, ${fallback}`;
}

/**
 * PC 환경(pointer: fine)에서만 84x84 SVG 커서를 CSS 변수(--cursor-basic, --cursor-event)에 적용합니다.
 */
export function applyCustomPotatoCursors(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const finePointerQuery = window.matchMedia?.('(pointer: fine)');
  if (finePointerQuery && !finePointerQuery.matches) {
    return () => {};
  }

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty(
    '--cursor-basic',
    buildCursorCssValue(BASIC_CURSOR_SVG, 'auto')
  );
  rootStyle.setProperty(
    '--cursor-event',
    buildCursorCssValue(EVENT_CURSOR_SVG, 'pointer')
  );

  return () => {
    rootStyle.removeProperty('--cursor-basic');
    rootStyle.removeProperty('--cursor-event');
  };
}
