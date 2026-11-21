import test from 'node:test';
import assert from 'node:assert/strict';
import { getRevealDelay, shouldRevealFromEntries } from './revealLogic';

test('calculates staggered reveal delays and caps at maxMs', () => {
  assert.equal(getRevealDelay(0), 0);
  assert.equal(getRevealDelay(-2), 0);
  assert.equal(getRevealDelay(1), 90);
  assert.equal(getRevealDelay(2), 180);
  assert.equal(getRevealDelay(3), 270);
  assert.equal(getRevealDelay(6), 360);
});

test('detects reveal trigger from IntersectionObserver entries', () => {
  assert.equal(
    shouldRevealFromEntries([{ isIntersecting: false, intersectionRatio: 0 }]),
    false
  );
  assert.equal(
    shouldRevealFromEntries([{ isIntersecting: true, intersectionRatio: 0.2 }]),
    true
  );
  assert.equal(
    shouldRevealFromEntries([
      { isIntersecting: false, intersectionRatio: 0 },
      { isIntersecting: false, intersectionRatio: 0.15 },
    ]),
    true
  );
});
