import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASIC_CURSOR_PATH,
  CURSOR_HOTSPOT,
  CURSOR_SIZE,
  EVENT_CURSOR_PATH,
  WHITE_THRESHOLD,
  buildCursorCssValue,
  removeWhiteBackground,
} from './customCursor';

test('uses URL-encoded paths and 36x36 center hotspot (18 18)', () => {
  assert.equal(BASIC_CURSOR_PATH, '/cursor%20basic.png');
  assert.equal(EVENT_CURSOR_PATH, '/cursor%20event.png');
  assert.equal(CURSOR_SIZE, 36);
  assert.equal(CURSOR_HOTSPOT, 18);
  assert.equal(WHITE_THRESHOLD, 240);
});

test('makes near-white pixels (R,G,B >= 240) transparent while keeping potato colors opaque', () => {
  const pixels = new Uint8ClampedArray([
    255, 255, 255, 255, // pure white -> transparent
    240, 240, 240, 255, // threshold boundary -> transparent
    239, 255, 255, 255, // below threshold on R -> stays opaque
    214, 174, 108, 255, // potato body -> stays opaque
    58, 42, 32, 255, // dark outline -> stays opaque
  ]);

  removeWhiteBackground(pixels);

  assert.equal(pixels[3], 0);
  assert.equal(pixels[7], 0);
  assert.equal(pixels[11], 255);
  assert.equal(pixels[15], 255);
  assert.equal(pixels[19], 255);
});

test('builds CSS cursor values with center hotspot (18 18) and safe fallback', () => {
  const sampleDataUrl = 'data:image/png;base64,iVBORw0KGgo=';
  assert.equal(
    buildCursorCssValue(sampleDataUrl, 'auto'),
    'url("data:image/png;base64,iVBORw0KGgo=") 18 18, auto'
  );
  assert.equal(
    buildCursorCssValue(sampleDataUrl, 'pointer'),
    'url("data:image/png;base64,iVBORw0KGgo=") 18 18, pointer'
  );
  assert.equal(buildCursorCssValue(null, 'auto'), 'auto');
  assert.equal(buildCursorCssValue('', 'pointer'), 'pointer');
});
