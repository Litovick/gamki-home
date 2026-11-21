import test from 'node:test';
import assert from 'node:assert/strict';
import {
  COMMUNITY_SAMPLES,
  OPPORTUNITY_SAMPLES,
  filterCommunityPosts,
  filterOpportunities,
  getGrowthStageFromRecords,
} from './careerContent';

test('maps 0/3/6/9/12 career records to growth stages 0~4', () => {
  assert.equal(getGrowthStageFromRecords(0), 0);
  assert.equal(getGrowthStageFromRecords(2), 0);
  assert.equal(getGrowthStageFromRecords(3), 1);
  assert.equal(getGrowthStageFromRecords(5), 1);
  assert.equal(getGrowthStageFromRecords(6), 2);
  assert.equal(getGrowthStageFromRecords(9), 3);
  assert.equal(getGrowthStageFromRecords(12), 4);
  assert.equal(getGrowthStageFromRecords(18), 4);
});

test('filters opportunities by category and preserves status priority order', () => {
  const all = filterOpportunities(OPPORTUNITY_SAMPLES, '전체');
  assert.equal(all[0].status, '마감 임박');
  assert.equal(all[1].status, '모집 중');
  assert.equal(all[2].status, '곧 열려요');
  assert.equal(all[3].status, '수시·정기');

  const supporters = filterOpportunities(OPPORTUNITY_SAMPLES, '서포터즈');
  assert.equal(supporters.length, 2);
  assert.equal(supporters[0].status, '모집 중');
});

test('filters community posts by board and keeps anonymous metadata format', () => {
  const seniorPosts = filterCommunityPosts(
    COMMUNITY_SAMPLES,
    '선배 조언',
    '최신순'
  );
  assert.equal(seniorPosts.length, 1);
  assert.equal(seniorPosts[0].pinned, true);
  assert.ok(seniorPosts[0].authorMeta.startsWith('익명 감자'));
});
