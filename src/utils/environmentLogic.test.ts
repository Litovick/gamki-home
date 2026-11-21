import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getScenePalette,
  getTimePhaseFromHour,
  isSleepingCondition,
  mapWmoWeatherCode,
} from './environmentLogic';

test('maps hours to the 4 Chuncheon time phases accurately', () => {
  assert.equal(getTimePhaseFromHour(5), 'dawn');
  assert.equal(getTimePhaseFromHour(6), 'dawn');
  assert.equal(getTimePhaseFromHour(7), 'day');
  assert.equal(getTimePhaseFromHour(16), 'day');
  assert.equal(getTimePhaseFromHour(17), 'sunset');
  assert.equal(getTimePhaseFromHour(19), 'sunset');
  assert.equal(getTimePhaseFromHour(20), 'night');
  assert.equal(getTimePhaseFromHour(23), 'night');
  assert.equal(getTimePhaseFromHour(4), 'night');
});

test('maps Open-Meteo WMO weather codes to 4 Korean weather types', () => {
  assert.equal(mapWmoWeatherCode(0), 'clear');
  assert.equal(mapWmoWeatherCode(1), 'clear');
  assert.equal(mapWmoWeatherCode(2), 'cloudy');
  assert.equal(mapWmoWeatherCode(45), 'cloudy');
  assert.equal(mapWmoWeatherCode(61), 'rain');
  assert.equal(mapWmoWeatherCode(95), 'rain');
  assert.equal(mapWmoWeatherCode(73), 'snow');
  assert.equal(mapWmoWeatherCode(85), 'snow');
});

test('triggers sleeping only for happy/neutral moods at night or 23:00~07:00', () => {
  assert.equal(isSleepingCondition('night', 14, 'happy'), true);
  assert.equal(isSleepingCondition('night', 14, 'neutral'), true);
  assert.equal(isSleepingCondition('night', 14, 'annoyed'), false);
  assert.equal(isSleepingCondition('night', 14, 'angry'), false);

  assert.equal(isSleepingCondition('now', 23, 'happy'), true);
  assert.equal(isSleepingCondition('now', 3, 'neutral'), true);
  assert.equal(isSleepingCondition('now', 6, 'happy'), true);
  assert.equal(isSleepingCondition('now', 7, 'happy'), false);
  assert.equal(isSleepingCondition('now', 21, 'happy'), false);
  assert.equal(isSleepingCondition('day', 23, 'happy'), false);
});

test('tints clear-day sky subtly by mood and turns hills snow-white when snowing', () => {
  const happyDay = getScenePalette('day', 'clear', 'happy');
  const neutralDay = getScenePalette('day', 'clear', 'neutral');
  const annoyedDay = getScenePalette('day', 'clear', 'annoyed');
  const angryDay = getScenePalette('day', 'clear', 'angry');

  assert.notEqual(happyDay.skyTop, neutralDay.skyTop);
  assert.notEqual(neutralDay.skyTop, annoyedDay.skyTop);
  assert.notEqual(annoyedDay.skyTop, angryDay.skyTop);

  const snowyDay = getScenePalette('day', 'snow', 'happy');
  assert.equal(snowyDay.hillFront, '#F2F7FB');
  assert.equal(snowyDay.hillForeground, '#FAFDFE');

  const nightClear = getScenePalette('night', 'clear', 'happy');
  assert.equal(nightClear.isDarkSky, true);
  assert.equal(nightClear.showStars, true);
});
