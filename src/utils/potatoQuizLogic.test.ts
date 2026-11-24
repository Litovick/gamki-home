import test from 'node:test';
import assert from 'node:assert/strict';
import {
  POINTS_PER_CHOICE,
  POTATO_RESULTS,
  POTATO_TYPE_ORDER,
  QUIZ_QUESTIONS,
  buildQuizHash,
  buildShareableResultUrl,
  calculateQuizResult,
  getQuizProgressPercent,
  parseQuizRoute,
} from './potatoQuizLogic';

test('contains 8 questions with 5 distinct potato type choices and no raw type labels', () => {
  assert.equal(QUIZ_QUESTIONS.length, 8);
  for (const q of QUIZ_QUESTIONS) {
    assert.equal(q.choices.length, 5);
    const types = new Set(q.choices.map((c) => c.type));
    assert.equal(types.size, 5);
    for (const c of q.choices) {
      assert.ok(!c.text.includes('(calm)'));
      assert.ok(!c.text.includes('(cheerful)'));
      assert.ok(!c.text.includes('(searching)'));
      assert.ok(!c.text.includes('(creative)'));
      assert.ok(!c.text.includes('(dependable)'));
    }
  }
});

test('defines URL-encoded public image paths and partner pairings for all 5 potato types', () => {
  assert.equal(POTATO_TYPE_ORDER.length, 5);
  assert.equal(POTATO_RESULTS.calm.imagePath, '/calm%20potato.png');
  assert.equal(POTATO_RESULTS.cheerful.imagePath, '/cheerful%20potato.png');
  assert.equal(POTATO_RESULTS.searching.imagePath, '/searching%20potato.png');
  assert.equal(POTATO_RESULTS.creative.imagePath, '/creative%20potato.png');
  assert.equal(POTATO_RESULTS.dependable.imagePath, '/dependable%20potato.png');

  assert.equal(POTATO_RESULTS.calm.partnerId, 'cheerful');
  assert.equal(POTATO_RESULTS.cheerful.partnerId, 'calm');
  assert.equal(POTATO_RESULTS.searching.partnerId, 'creative');
  assert.equal(POTATO_RESULTS.creative.partnerId, 'dependable');
  assert.equal(POTATO_RESULTS.dependable.partnerId, 'creative');
});

test('awards +2 points per answer and resolves highest score', () => {
  const result = calculateQuizResult([
    'creative',
    'creative',
    'creative',
    'calm',
    'creative',
    'dependable',
    'creative',
    'searching',
  ]);
  assert.equal(result.scores.creative, 5 * POINTS_PER_CHOICE);
  assert.equal(result.scores.calm, 2);
  assert.equal(result.scores.dependable, 2);
  assert.equal(result.scores.searching, 2);
  assert.equal(result.scores.cheerful, 0);
  assert.equal(result.winner, 'creative');
});

test('breaks ties in favor of the most recently selected tied type', () => {
  const tieA = calculateQuizResult([
    'calm',
    'calm',
    'calm',
    'calm',
    'cheerful',
    'cheerful',
    'cheerful',
    'cheerful',
  ]);
  assert.equal(tieA.scores.calm, 8);
  assert.equal(tieA.scores.cheerful, 8);
  assert.equal(tieA.winner, 'cheerful');

  const tieB = calculateQuizResult([
    'cheerful',
    'dependable',
    'cheerful',
    'dependable',
    'searching',
    'creative',
    'dependable',
    'cheerful',
  ]);
  assert.equal(tieB.scores.cheerful, 6);
  assert.equal(tieB.scores.dependable, 6);
  assert.equal(tieB.winner, 'cheerful');
});

test('parses hash and query quiz routes safely without breaking homepage anchors', () => {
  assert.deepEqual(parseQuizRoute(''), { view: 'home' });
  assert.deepEqual(parseQuizRoute('#core-features'), { view: 'home' });
  assert.deepEqual(parseQuizRoute('#project'), { view: 'home' });

  assert.deepEqual(parseQuizRoute('#quiz'), { view: 'quiz', resultType: null });
  assert.deepEqual(parseQuizRoute('#quiz/result=calm'), {
    view: 'quiz',
    resultType: 'calm',
  });
  assert.deepEqual(parseQuizRoute('#quiz/result=unknown'), {
    view: 'quiz',
    resultType: null,
  });

  assert.deepEqual(parseQuizRoute('', '?view=quiz'), {
    view: 'quiz',
    resultType: null,
  });
  assert.deepEqual(parseQuizRoute('', '?view=quiz&result=dependable'), {
    view: 'quiz',
    resultType: 'dependable',
  });
});

test('builds shareable result URLs and progress percentages accurately', () => {
  assert.equal(buildQuizHash(), '#quiz');
  assert.equal(buildQuizHash('searching'), '#quiz/result=searching');
  assert.equal(
    buildShareableResultUrl('https://gamja-home.vercel.app', '/', 'calm'),
    'https://gamja-home.vercel.app/#quiz/result=calm'
  );
  assert.equal(getQuizProgressPercent(0, 8), 13);
  assert.equal(getQuizProgressPercent(7, 8), 100);
});
