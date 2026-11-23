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
  assert.equal(all.length, 4);
  assert.equal(all[0].status, '마감 임박');
  assert.equal(all[0].title, '대학생 정책 아이디어 공모전');
  assert.equal(all[0].organization, '한국정책분석평가학회');
  assert.equal(all[0].deadlineLabel, '11.26 마감');
  assert.equal(all[1].status, '곧 열려요');
  assert.equal(all[1].title, '춘천마임축제 국내참가작 공모');
  assert.equal(all[2].status, '곧 열려요');
  assert.equal(all[2].organization, '한국관광공사(본사 원주)');
  assert.equal(all[3].status, '수시·정기');
  assert.equal(all[3].organization, '(재)춘천인재육성장학재단');

  const contests = filterOpportunities(OPPORTUNITY_SAMPLES, '공모전');
  assert.equal(contests.length, 2);
  assert.equal(contests[0].status, '마감 임박');

  const supporters = filterOpportunities(OPPORTUNITY_SAMPLES, '서포터즈');
  assert.equal(supporters.length, 1);
  assert.equal(supporters[0].status, '수시·정기');
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
