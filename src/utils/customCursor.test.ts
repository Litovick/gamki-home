import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASIC_CURSOR_SVG,
  CURSOR_HOTSPOT_X,
  CURSOR_HOTSPOT_Y,
  CURSOR_SIZE,
  EVENT_CURSOR_SVG,
  buildCursorCssValue,
  encodeSvgDataUrl,
} from './customCursor';

test('defines 54x54 SVG cursor size and 27 33 hotspot', () => {
  assert.equal(CURSOR_SIZE, 54);
  assert.equal(CURSOR_HOTSPOT_X, 27);
  assert.equal(CURSOR_HOTSPOT_Y, 33);
  assert.ok(BASIC_CURSOR_SVG.includes('width="54" height="54"'));
  assert.ok(EVENT_CURSOR_SVG.includes('width="54" height="54"'));
  assert.ok(EVENT_CURSOR_SVG.includes('#C6EA9F'));
});

test('encodes SVG safely with encodeURIComponent so raw # never appears in CSS url', () => {
  const basicUrl = encodeSvgDataUrl(BASIC_CURSOR_SVG);
  const eventUrl = encodeSvgDataUrl(EVENT_CURSOR_SVG);

  assert.ok(basicUrl.startsWith('data:image/svg+xml;charset=utf-8,'));
  assert.ok(eventUrl.startsWith('data:image/svg+xml;charset=utf-8,'));
  assert.ok(!basicUrl.includes('#'));
  assert.ok(!eventUrl.includes('#'));
  assert.ok(basicUrl.includes('%23CFA75C'));
  assert.ok(eventUrl.includes('%23C6EA9F'));
});

test('builds CSS cursor values with 27 33 hotspot and safe fallback', () => {
  const basicCss = buildCursorCssValue(BASIC_CURSOR_SVG, 'auto');
  const eventCss = buildCursorCssValue(EVENT_CURSOR_SVG, 'pointer');

  assert.ok(basicCss.startsWith('url("data:image/svg+xml;charset=utf-8,'));
  assert.ok(basicCss.endsWith('") 27 33, auto'));
  assert.ok(eventCss.startsWith('url("data:image/svg+xml;charset=utf-8,'));
  assert.ok(eventCss.endsWith('") 27 33, pointer'));
  assert.equal(buildCursorCssValue(null, 'auto'), 'auto');
  assert.equal(buildCursorCssValue('', 'pointer'), 'pointer');
});
