export const BASIC_CURSOR_PATH = '/cursor%20basic.png';
export const EVENT_CURSOR_PATH = '/cursor%20event.png';
export const CURSOR_SIZE = 36;
export const CURSOR_HOTSPOT = 18;
export const WHITE_THRESHOLD = 240;

/**
 * RGBA 픽셀 배열에서 R, G, B 모두 threshold(기본 240) 이상인 흰색 픽셀을 투명(alpha = 0) 처리합니다.
 */
export function removeWhiteBackground(
  rgba: Uint8ClampedArray,
  threshold: number = WHITE_THRESHOLD
): Uint8ClampedArray {
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    if (r >= threshold && g >= threshold && b >= threshold) {
      rgba[i + 3] = 0;
    }
  }
  return rgba;
}

/**
 * PNG Data URL과 hotspot(기본 18 18), fallback(auto | pointer)으로 CSS cursor 속성 값을 생성합니다.
 */
export function buildCursorCssValue(
  dataUrl: string | null,
  fallback: 'auto' | 'pointer',
  hotspot: number = CURSOR_HOTSPOT
): string {
  if (!dataUrl || !dataUrl.startsWith('data:image/png')) {
    return fallback;
  }
  return `url("${dataUrl}") ${hotspot} ${hotspot}, ${fallback}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`커서 이미지 로드 실패: ${src}`));
    img.src = src;
  });
}

/**
 * 1) 원본 이미지의 흰색 배경(R,G,B >= 240)을 투명하게 처리하고
 * 2) 36x36px 크기로 리사이즈한 PNG Data URL을 반환합니다.
 */
export async function createProcessedCursorDataUrl(
  src: string,
  size: number = CURSOR_SIZE,
  threshold: number = WHITE_THRESHOLD
): Promise<string | null> {
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return null;
  }

  try {
    const img = await loadImage(src);
    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;
    if (naturalW <= 0 || naturalH <= 0) {
      return null;
    }

    // 1) 원본 해상도 캔버스에서 흰색 배경 투명화
    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = naturalW;
    sourceCanvas.height = naturalH;
    const sourceCtx = sourceCanvas.getContext('2d', {
      willReadFrequently: true,
    });
    if (!sourceCtx) {
      return null;
    }

    sourceCtx.drawImage(img, 0, 0, naturalW, naturalH);
    const imageData = sourceCtx.getImageData(0, 0, naturalW, naturalH);
    removeWhiteBackground(imageData.data, threshold);
    sourceCtx.putImageData(imageData, 0, 0);

    // 2) 36x36px 크기로 고품질 리사이즈 후 PNG Data URL 생성
    const targetCanvas = document.createElement('canvas');
    targetCanvas.width = size;
    targetCanvas.height = size;
    const targetCtx = targetCanvas.getContext('2d');
    if (!targetCtx) {
      return null;
    }

    targetCtx.clearRect(0, 0, size, size);
    targetCtx.imageSmoothingEnabled = true;
    targetCtx.imageSmoothingQuality = 'high';
    targetCtx.drawImage(sourceCanvas, 0, 0, size, size);

    return targetCanvas.toDataURL('image/png');
  } catch {
    return null;
  }
}

/**
 * PC 환경(pointer: fine)에서만 두 커서 이미지를 가공해 CSS 변수(--cursor-basic, --cursor-event)에 적용합니다.
 */
export function applyCustomPotatoCursors(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const finePointerQuery = window.matchMedia?.('(pointer: fine)');
  if (finePointerQuery && !finePointerQuery.matches) {
    return () => {};
  }

  let cancelled = false;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--cursor-basic', 'auto');
  rootStyle.setProperty('--cursor-event', 'pointer');

  Promise.all([
    createProcessedCursorDataUrl(BASIC_CURSOR_PATH),
    createProcessedCursorDataUrl(EVENT_CURSOR_PATH),
  ]).then(([basicDataUrl, eventDataUrl]) => {
    if (cancelled) return;
    rootStyle.setProperty(
      '--cursor-basic',
      buildCursorCssValue(basicDataUrl, 'auto')
    );
    rootStyle.setProperty(
      '--cursor-event',
      buildCursorCssValue(eventDataUrl, 'pointer')
    );
  });

  return () => {
    cancelled = true;
  };
}
