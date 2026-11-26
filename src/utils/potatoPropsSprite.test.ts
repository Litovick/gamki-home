import test from 'node:test';
import assert from 'node:assert/strict';
import {
  POTATO_PROPS_SPRITE_INDEX,
  POTATO_TYPE_STORAGE_KEY,
  StorageLike,
  clearSavedPotatoType,
  findOpaqueBoundingBox,
  getPropSpriteCropRect,
  readSavedPotatoType,
  removeWhiteBackgroundFromPixels,
  savePotatoType,
} from './potatoPropsSprite';

function createMemoryStorage(): StorageLike {
  const store = new Map<string, string>();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
    removeItem: (key) => {
      store.delete(key);
    },
  };
}

test('maps 5 potato types to the exact left-to-right indices in /potato-props.jpg', () => {
  assert.deepEqual(POTATO_PROPS_SPRITE_INDEX, {
    cheerful: 0,
    calm: 1,
    searching: 2,
    creative: 3,
    dependable: 4,
  });
});

test('crops each 1/5 column and top 70% character area without bottom text', () => {
  const rect0 = getPropSpriteCropRect(1500, 500, 'cheerful');
  assert.deepEqual(rect0, { sx: 0, sy: 0, sw: 300, sh: 350 });

  const rect1 = getPropSpriteCropRect(1500, 500, 'calm');
  assert.deepEqual(rect1, { sx: 300, sy: 0, sw: 300, sh: 350 });

  const rect4 = getPropSpriteCropRect(1500, 500, 'dependable');
  assert.deepEqual(rect4, { sx: 1200, sy: 0, sw: 300, sh: 350 });
});

test('removes white background pixels (R, G, B >= 240) and preserves character pixels', () => {
  const pixels = new Uint8ClampedArray([
    255, 255, 255, 255, // pure white -> transparent
    240, 240, 240, 255, // threshold white -> transparent
    239, 255, 255, 255, // R < 240 -> keep opaque
    207, 167, 92, 255,  // potato tan -> keep opaque
  ]);

  removeWhiteBackgroundFromPixels(pixels, 240);

  assert.equal(pixels[3], 0);
  assert.equal(pixels[7], 0);
  assert.equal(pixels[11], 255);
  assert.equal(pixels[15], 255);
});

test('finds tight opaque bounding box with padding and handles empty buffers safely', () => {
  const width = 10;
  const height = 10;
  const data = new Uint8ClampedArray(width * height * 4);

  // Empty transparent buffer falls back to full area
  assert.deepEqual(findOpaqueBoundingBox(data, width, height, 1), {
    sx: 0,
    sy: 0,
    sw: 10,
    sh: 10,
  });

  // Paint opaque pixels at (3,4) and (6,7)
  data[(4 * width + 3) * 4 + 3] = 255;
  data[(7 * width + 6) * 4 + 3] = 255;

  assert.deepEqual(findOpaqueBoundingBox(data, width, height, 1), {
    sx: 2,
    sy: 3,
    sw: 6,
    sh: 6,
  });
});

test('saves, reads, validates, and clears saved potato type in storage', () => {
  const storage = createMemoryStorage();
  assert.equal(readSavedPotatoType(storage), null);

  assert.equal(savePotatoType('creative', storage), true);
  assert.equal(storage.getItem(POTATO_TYPE_STORAGE_KEY), 'creative');
  assert.equal(readSavedPotatoType(storage), 'creative');

  storage.setItem(POTATO_TYPE_STORAGE_KEY, 'unknown-type');
  assert.equal(readSavedPotatoType(storage), null);

  assert.equal(clearSavedPotatoType(storage), true);
  assert.equal(readSavedPotatoType(storage), null);
});
