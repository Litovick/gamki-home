import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STEM_TOP,
  applyCareAction,
  clampAbsentDays,
  getGrowthStageByEnergy,
  getMascotHeight,
  getMoodByAbsentDays,
  getRoadmapByGrade,
} from './potatoLogic';

test('maps absent days to the exact 4 mood images and stages', () => {
  assert.equal(getMoodByAbsentDays(0).mood, 'happy');
  assert.equal(getMoodByAbsentDays(1).imageSrc, '/mascot/happy.webp');
  assert.equal(getMoodByAbsentDays(0).speechPlaceholder, '감자가 오늘도 성장 중!');
  assert.equal(
    getMoodByAbsentDays(0).descriptionPlaceholder,
    '매일 들르면 감자가 환하게 웃어요. 하루 한 번 앱을 열면 물도 한 개 생겨요.'
  );
  assert.equal(getMoodByAbsentDays(2).mood, 'neutral');
  assert.equal(getMoodByAbsentDays(3).imageSrc, '/mascot/neutral.webp');
  assert.equal(getMoodByAbsentDays(2).speechPlaceholder, '감자가 멈춰 있어요.');
  assert.equal(
    getMoodByAbsentDays(2).descriptionPlaceholder,
    '이틀만 안 와도 표정이 굳어요. 이날 첫 알림이 가요.'
  );
  assert.equal(getMoodByAbsentDays(4).mood, 'annoyed');
  assert.equal(getMoodByAbsentDays(6).imageSrc, '/mascot/annoyed.webp');
  assert.equal(
    getMoodByAbsentDays(4).speechPlaceholder,
    '2학년 할 일 아직이야? 이대로 졸업할 거야?'
  );
  assert.equal(
    getMoodByAbsentDays(4).descriptionPlaceholder,
    '지금 학년에 남은 할 일을 콕 집어 재촉해요. 맑은 낮이면 하늘이 누렇게 변해요.'
  );
  assert.equal(getMoodByAbsentDays(7).mood, 'angry');
  assert.equal(getMoodByAbsentDays(10).imageSrc, '/mascot/angry.webp');
  assert.equal(
    getMoodByAbsentDays(7).speechPlaceholder,
    '감자가 화났다. 새 기회 확인하러 와.'
  );
  assert.equal(
    getMoodByAbsentDays(7).descriptionPlaceholder,
    '일주일 넘게 안 오면 감자가 화내고 하늘도 붉어져요. 이후엔 주 1회만 알림을 보내요.'
  );
});

test('clamps absent days within 0 to 10 range', () => {
  assert.equal(clampAbsentDays(-3), 0);
  assert.equal(clampAbsentDays(4.6), 5);
  assert.equal(clampAbsentDays(15), 10);
});

test('computes growth stages 0 to 4 from energy and caps at 100', () => {
  assert.equal(getGrowthStageByEnergy(0), 0);
  assert.equal(getGrowthStageByEnergy(24), 0);
  assert.equal(getGrowthStageByEnergy(25), 1);
  assert.equal(getGrowthStageByEnergy(50), 2);
  assert.equal(getGrowthStageByEnergy(75), 3);
  assert.equal(getGrowthStageByEnergy(100), 4);

  const step1 = applyCareAction(0, 'water');
  assert.equal(step1.energy, 25);
  assert.equal(step1.stage, 1);

  const step2 = applyCareAction(step1.energy, 'sun');
  assert.equal(step2.energy, 50);
  assert.equal(step2.stage, 2);

  const step3 = applyCareAction(step2.energy, 'fertilizer');
  assert.equal(step3.energy, 85);
  assert.equal(step3.stage, 3);

  const step4 = applyCareAction(step3.energy, 'water');
  assert.equal(step4.energy, 100);
  assert.equal(step4.stage, 4);
  assert.equal(step4.delta, 15);
});

test('preserves exact STEM_TOP coordinates and mascot height ratio (300x348)', () => {
  assert.deepEqual([...STEM_TOP], [134, 110, 98, 84, 76]);
  assert.equal(getMascotHeight(100), 116);
  assert.equal(getMascotHeight(200), 232);
});

test('links grade roadmap 1~4 to sprout growth stages 1~4 with 3 task slots', () => {
  const g1 = getRoadmapByGrade(1);
  const g2 = getRoadmapByGrade(2);
  const g3 = getRoadmapByGrade(3);
  const g4 = getRoadmapByGrade(4);

  assert.equal(g1.growthStage, 1);
  assert.equal(g2.growthStage, 2);
  assert.equal(g3.growthStage, 3);
  assert.equal(g4.growthStage, 4);
  assert.equal(g1.slots.length, 3);
  assert.equal(g4.slots[0], '[4학년 할 일 1 입력 예정]');
});
