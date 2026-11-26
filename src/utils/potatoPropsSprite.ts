import { PotatoTypeId, isPotatoTypeId } from './potatoQuizLogic';

export const POTATO_PROPS_IMAGE_PATH = '/potato-props.jpg';
export const POTATO_TYPE_STORAGE_KEY = 'gamja_kiugi_potato_type';

export const SPRITE_COLUMNS = 5;
export const SPRITE_CHARACTER_HEIGHT_RATIO = 0.7;
export const WHITE_BG_THRESHOLD = 240;

/**
 * /potato-props.jpg 가로 5등분 순서 (왼쪽부터 인덱스 0~4)
 * 0: cheerful (활발한 감자 · 노란 머리띠)
 * 1: calm (차분한 감자 · 동그란 안경)
 * 2: searching (탐구하는 감자 · 탐험 모자)
 * 3: creative (창의적인 감자 · 빨간 베레모)
 * 4: dependable (든든한 감자 · 네모 안경)
 */
export const POTATO_PROPS_SPRITE_INDEX: Record<PotatoTypeId, number> = {
  cheerful: 0,
  calm: 1,
  searching: 2,
  creative: 3,
  dependable: 4,
};

export interface PotatoPropMeta {
  readonly id: PotatoTypeId;
  readonly index: number;
  readonly name: string;
  readonly propName: string;
}

export const POTATO_PROP_META: Record<PotatoTypeId, PotatoPropMeta> = {
  cheerful: {
    id: 'cheerful',
    index: 0,
    name: '활발한 감자',
    propName: '노란 머리띠',
  },
  calm: {
    id: 'calm',
    index: 1,
    name: '차분한 감자',
    propName: '동그란 안경',
  },
  searching: {
    id: 'searching',
    index: 2,
    name: '탐구하는 감자',
    propName: '탐험 모자',
  },
  creative: {
    id: 'creative',
    index: 3,
    name: '창의적인 감자',
    propName: '빨간 베레모',
  },
  dependable: {
    id: 'dependable',
    index: 4,
    name: '든든한 감자',
    propName: '네모 안경',
  },
};

export interface CropRect {
  readonly sx: number;
  readonly sy: number;
  readonly sw: number;
  readonly sh: number;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function getDefaultStorage(): StorageLike | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readSavedPotatoType(
  storage: StorageLike | null = getDefaultStorage()
): PotatoTypeId | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(POTATO_TYPE_STORAGE_KEY);
    return isPotatoTypeId(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function savePotatoType(
  typeId: PotatoTypeId,
  storage: StorageLike | null = getDefaultStorage()
): boolean {
  if (!storage || !isPotatoTypeId(typeId)) return false;
  try {
    storage.setItem(POTATO_TYPE_STORAGE_KEY, typeId);
    return true;
  } catch {
    return false;
  }
}

export function clearSavedPotatoType(
  storage: StorageLike | null = getDefaultStorage()
): boolean {
  if (!storage) return false;
  try {
    storage.removeItem(POTATO_TYPE_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * 5등분 스프라이트에서 해당 유형의 1/5 칸 중 상단 70% 캐릭터 영역 좌표를 계산합니다.
 */
export function getPropSpriteCropRect(
  naturalWidth: number,
  naturalHeight: number,
  typeId: PotatoTypeId
): CropRect {
  const index = POTATO_PROPS_SPRITE_INDEX[typeId];
  const cellWidth = naturalWidth / SPRITE_COLUMNS;
  const sx = Math.round(cellWidth * index);
  const nextX = Math.round(cellWidth * (index + 1));
  const sw = Math.max(1, nextX - sx);
  const sh = Math.max(1, Math.round(naturalHeight * SPRITE_CHARACTER_HEIGHT_RATIO));

  return { sx, sy: 0, sw, sh };
}

/**
 * R, G, B 모두 threshold(기본 240) 이상인 흰색 배경 픽셀을 투명 처리합니다.
 */
export function removeWhiteBackgroundFromPixels(
  data: Uint8ClampedArray,
  threshold = WHITE_BG_THRESHOLD
): Uint8ClampedArray {
  for (let i = 0; i < data.length; i += 4) {
    if (
      data[i] >= threshold &&
      data[i + 1] >= threshold &&
      data[i + 2] >= threshold
    ) {
      data[i + 3] = 0;
    }
  }
  return data;
}

/**
 * 투명 배경을 제외한 캐릭터 실제 영역의 바운딩 박스를 계산해 여백을 균일하게 맞춥니다.
 */
export function findOpaqueBoundingBox(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  paddingPx = 4
): CropRect {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return { sx: 0, sy: 0, sw: width, sh: height };
  }

  const sx = Math.max(0, minX - paddingPx);
  const sy = Math.max(0, minY - paddingPx);
  const ex = Math.min(width, maxX + 1 + paddingPx);
  const ey = Math.min(height, maxY + 1 + paddingPx);

  return {
    sx,
    sy,
    sw: Math.max(1, ex - sx),
    sh: Math.max(1, ey - sy),
  };
}

const croppedDataUrlCache = new Map<PotatoTypeId, string>();
let spriteImagePromise: Promise<HTMLImageElement | null> | null = null;

function loadPropsSpriteImage(): Promise<HTMLImageElement | null> {
  if (typeof window === 'undefined' || typeof Image === 'undefined') {
    return Promise.resolve(null);
  }

  if (!spriteImagePromise) {
    spriteImagePromise = new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          resolve(img);
        } else {
          spriteImagePromise = null;
          resolve(null);
        }
      };
      img.onerror = () => {
        spriteImagePromise = null;
        resolve(null);
      };
      img.src = POTATO_PROPS_IMAGE_PATH;
    });
  }

  return spriteImagePromise;
}

/**
 * /potato-props.jpg에서 특정 유형의 소품 감자(상단 70%)를 Canvas로 크롭하고
 * 흰색 배경(R,G,B >= 240)을 투명 처리한 PNG Data URL을 반환합니다.
 * 로드 실패 시 null을 반환하여 기본 감자로 안전하게 fallback합니다.
 */
export async function loadCroppedPropPotatoDataUrl(
  typeId: PotatoTypeId
): Promise<string | null> {
  const cached = croppedDataUrlCache.get(typeId);
  if (cached) return cached;

  const img = await loadPropsSpriteImage();
  if (!img || typeof document === 'undefined') return null;

  try {
    const rect = getPropSpriteCropRect(
      img.naturalWidth,
      img.naturalHeight,
      typeId
    );
    const workCanvas = document.createElement('canvas');
    workCanvas.width = rect.sw;
    workCanvas.height = rect.sh;

    const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });
    if (!workCtx) return null;

    workCtx.drawImage(
      img,
      rect.sx,
      rect.sy,
      rect.sw,
      rect.sh,
      0,
      0,
      rect.sw,
      rect.sh
    );

    const imageData = workCtx.getImageData(0, 0, rect.sw, rect.sh);
    removeWhiteBackgroundFromPixels(imageData.data, WHITE_BG_THRESHOLD);
    workCtx.putImageData(imageData, 0, 0);

    // 투명 여백을 깔끔히 트리밍해 메인 감자 영역 중앙에 균형 있게 배치
    const bounds = findOpaqueBoundingBox(
      imageData.data,
      rect.sw,
      rect.sh,
      Math.max(4, Math.round(Math.min(rect.sw, rect.sh) * 0.03))
    );

    const outCanvas = document.createElement('canvas');
    outCanvas.width = bounds.sw;
    outCanvas.height = bounds.sh;
    const outCtx = outCanvas.getContext('2d');
    if (!outCtx) return null;

    outCtx.drawImage(
      workCanvas,
      bounds.sx,
      bounds.sy,
      bounds.sw,
      bounds.sh,
      0,
      0,
      bounds.sw,
      bounds.sh
    );

    const dataUrl = outCanvas.toDataURL('image/png');
    croppedDataUrlCache.set(typeId, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}
