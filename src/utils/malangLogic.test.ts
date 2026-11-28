import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EASTER_EGG_TAP_WINDOW_MS,
  EASTER_EGG_TARGET_TAPS,
  advanceEasterEggTapCount,
  parseAppRoute,
} from './malangLogic';

test('parses #malang and ?view=malang routes while preserving home and quiz routes', () => {
  assert.deepEqual(parseAppRoute('#malang'), { view: 'malang' });
  assert.deepEqual(parseAppRoute('#malang/'), { view: 'malang' });
  assert.deepEqual(parseAppRoute('#MALANG'), { view: 'malang' });
  assert.deepEqual(parseAppRoute('', '?view=malang'), { view: 'malang' });

  // Existing home anchors and quiz routes stay untouched
  assert.deepEqual(parseAppRoute(''), { view: 'home' });
  assert.deepEqual(parseAppRoute('#intro-video'), { view: 'home' });
  assert.deepEqual(parseAppRoute('#quiz'), { view: 'quiz', resultType: null });
  assert.deepEqual(parseAppRoute('#quiz/result=calm'), {
    view: 'quiz',
    resultType: 'calm',
  });
});

test('triggers malang easter egg on 5 consecutive taps within 2.5s intervals', () => {
  let state = { count: 0, lastTapAt: null as number | null };

  for (let i = 1; i < EASTER_EGG_TARGET_TAPS; i++) {
    const res = advanceEasterEggTapCount(state, i * 500);
    assert.equal(res.triggered, false);
    assert.equal(res.state.count, i);
    state = res.state;
  }

  const fifth = advanceEasterEggTapCount(state, 5 * 500);
  assert.equal(fifth.triggered, true);
  assert.deepEqual(fifth.state, { count: 0, lastTapAt: null });
});

test('resets tap streak when gap exceeds 2.5s window', () => {
  let state = { count: 0, lastTapAt: null as number | null };

  state = advanceEasterEggTapCount(state, 1000).state;
  state = advanceEasterEggTapCount(state, 2000).state;
  state = advanceEasterEggTapCount(state, 3000).state;
  assert.equal(state.count, 3);

  // Gap of 2501ms resets streak back to 1
  const afterPause = advanceEasterEggTapCount(
    state,
    3000 + EASTER_EGG_TAP_WINDOW_MS + 1
  );
  assert.equal(afterPause.triggered, false);
  assert.equal(afterPause.state.count, 1);
});
