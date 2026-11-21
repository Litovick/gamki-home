import { MoodType } from './potatoLogic';

export type TimePhase = 'dawn' | 'day' | 'sunset' | 'night';
export type TimeSelection = 'now' | TimePhase;

export type WeatherType = 'clear' | 'cloudy' | 'rain' | 'snow';
export type WeatherSelection = 'chuncheon' | WeatherType;

export interface ScenePalette {
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  mountainFar: string;
  hillMid: string;
  hillFront: string;
  hillForeground: string;
  lakeTop: string;
  lakeBottom: string;
  cloudFill: string;
  cloudStroke: string;
  grassStroke: string;
  schoolWall: string;
  schoolRoof: string;
  schoolWindow: string;
  isDarkSky: boolean;
  showStars: boolean;
  showSun: boolean;
  sunColorOuter: string;
  sunColorInner: string;
  sunY: number;
}

export const CHUNCHEON_API_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=37.8813&longitude=127.7298&current=weather_code';

export const TIME_LABELS: Record<TimeSelection, string> = {
  now: '지금',
  dawn: '새벽',
  day: '낮',
  sunset: '노을',
  night: '밤',
};

export const WEATHER_LABELS: Record<WeatherSelection, string> = {
  chuncheon: '춘천 지금',
  clear: '맑음',
  cloudy: '흐림',
  rain: '비',
  snow: '눈',
};

export function getTimePhaseFromHour(hour: number): TimePhase {
  const normalized = ((Math.floor(hour) % 24) + 24) % 24;
  if (normalized >= 5 && normalized < 7) return 'dawn';
  if (normalized >= 7 && normalized < 17) return 'day';
  if (normalized >= 17 && normalized < 20) return 'sunset';
  return 'night';
}

export function isSleepingCondition(
  timeSelection: TimeSelection,
  hour: number,
  mood: MoodType
): boolean {
  if (mood !== 'happy' && mood !== 'neutral') return false;
  if (timeSelection === 'night') return true;
  if (timeSelection === 'now') {
    const normalized = ((Math.floor(hour) % 24) + 24) % 24;
    return normalized >= 23 || normalized < 7;
  }
  return false;
}

export function mapWmoWeatherCode(code: number): WeatherType {
  if (!Number.isFinite(code)) return 'clear';
  const c = Math.round(code);
  if (c === 0 || c === 1) return 'clear';
  if (c === 2 || c === 3 || c === 45 || c === 48) return 'cloudy';
  if (
    (c >= 71 && c <= 77) ||
    c === 85 ||
    c === 86
  ) {
    return 'snow';
  }
  if (
    (c >= 51 && c <= 67) ||
    (c >= 80 && c <= 82) ||
    c === 95 ||
    c === 96 ||
    c === 99
  ) {
    return 'rain';
  }
  return 'clear';
}

export function getScenePalette(
  time: TimePhase,
  weather: WeatherType,
  mood: MoodType
): ScenePalette {
  const isSnow = weather === 'snow';
  const isRain = weather === 'rain';
  const isCloudy = weather === 'cloudy';

  // 기본 시각별 팔레트
  let palette: ScenePalette;

  if (time === 'dawn') {
    palette = {
      skyTop: '#C9C0EB',
      skyMid: '#ECCFD9',
      skyBottom: '#FCE4CC',
      mountainFar: '#B5B8CE',
      hillMid: '#A9C4A4',
      hillFront: '#BCD7A7',
      hillForeground: '#D8E7C5',
      lakeTop: '#C6CEE8',
      lakeBottom: '#E6D6E4',
      cloudFill: '#FFF4F2',
      cloudStroke: '#D5C3D6',
      grassStroke: '#6B8C61',
      schoolWall: '#FBF0E4',
      schoolRoof: '#D68E7E',
      schoolWindow: '#FFE7A3',
      isDarkSky: false,
      showStars: true,
      showSun: true,
      sunColorOuter: '#FFDCC2',
      sunColorInner: '#FFC89E',
      sunY: 290,
    };
  } else if (time === 'sunset') {
    palette = {
      skyTop: '#D9867B',
      skyMid: '#F5B08B',
      skyBottom: '#FFE0B5',
      mountainFar: '#B49398',
      hillMid: '#A7AE7F',
      hillFront: '#BBC48C',
      hillForeground: '#D7D9AA',
      lakeTop: '#F0AE98',
      lakeBottom: '#F8CCA9',
      cloudFill: '#FFEFE2',
      cloudStroke: '#E3B09A',
      grassStroke: '#737D4F',
      schoolWall: '#FCEAD8',
      schoolRoof: '#C46C5B',
      schoolWindow: '#FFE699',
      isDarkSky: false,
      showStars: false,
      showSun: true,
      sunColorOuter: '#FFB78A',
      sunColorInner: '#FF9A6C',
      sunY: 315,
    };
  } else if (time === 'night') {
    palette = {
      skyTop: '#1A2546',
      skyMid: '#283862',
      skyBottom: '#3D507A',
      mountainFar: '#314461',
      hillMid: '#37545B',
      hillFront: '#446763',
      hillForeground: '#597C72',
      lakeTop: '#263B5E',
      lakeBottom: '#334D73',
      cloudFill: '#4B5E86',
      cloudStroke: '#38496E',
      grassStroke: '#33524A',
      schoolWall: '#C5C8D6',
      schoolRoof: '#7C5757',
      schoolWindow: '#FFE487',
      isDarkSky: true,
      showStars: true,
      showSun: false,
      sunColorOuter: '#FFF4C2',
      sunColorInner: '#FFE899',
      sunY: 120,
    };
  } else {
    // 낮 (day) — 맑음일 때 표정에 따라 하늘색이 미묘하게 변화
    let skyTop = '#CBEAFB';
    let skyMid = '#E9F6F6';
    let skyBottom = '#FFF9EB';

    if (weather === 'clear') {
      if (mood === 'neutral') {
        skyTop = '#DCE9F3';
        skyMid = '#EEF3F1';
        skyBottom = '#FBF7EC';
      } else if (mood === 'annoyed') {
        skyTop = '#E8DFC8';
        skyMid = '#F4E8D0';
        skyBottom = '#FBF0DA';
      } else if (mood === 'angry') {
        skyTop = '#F1C7BE';
        skyMid = '#F7DDD4';
        skyBottom = '#FDF0E7';
      }
    }

    palette = {
      skyTop,
      skyMid,
      skyBottom,
      mountainFar: '#CFE5BE',
      hillMid: '#B7DC9D',
      hillFront: '#C7E4A6',
      hillForeground: '#E3F1CE',
      lakeTop: '#B4DCF4',
      lakeBottom: '#CCE9FA',
      cloudFill: '#FFFFFF',
      cloudStroke: '#C9DFEE',
      grassStroke: '#6EA15D',
      schoolWall: '#FFF6E5',
      schoolRoof: '#E79C7A',
      schoolWindow: '#CFE8FA',
      isDarkSky: false,
      showStars: false,
      showSun: true,
      sunColorOuter: '#FFEAA7',
      sunColorInner: '#FFD97D',
      sunY: 118,
    };
  }

  // 날씨별 보정 (흐림 / 비 / 눈)
  if (isCloudy || isRain) {
    if (time === 'night') {
      palette.skyTop = isRain ? '#151E34' : '#1E2A45';
      palette.skyMid = isRain ? '#222F4C' : '#2C3B5C';
      palette.skyBottom = isRain ? '#334361' : '#3E4F70';
      palette.cloudFill = isRain ? '#3D4B68' : '#4C5C7D';
      palette.cloudStroke = '#2B3750';
      palette.showStars = false;
    } else {
      palette.skyTop = isRain ? '#B9C9D8' : '#CFDCE6';
      palette.skyMid = isRain ? '#D2DCE4' : '#E3EAEF';
      palette.skyBottom = isRain ? '#E6ECEF' : '#F2F4F3';
      palette.cloudFill = isRain ? '#DCE4EC' : '#F1F5F8';
      palette.cloudStroke = isRain ? '#9EB2C4' : '#BDCBD6';
      palette.lakeTop = isRain ? '#9BB6CB' : '#AEC7DB';
      palette.lakeBottom = isRain ? '#B3CADB' : '#C5DAE9';
      palette.showSun = !isRain && time !== 'sunset' ? false : false;
    }
  }

  if (isSnow) {
    if (time === 'night') {
      palette.skyTop = '#1E2A4A';
      palette.skyMid = '#30426B';
      palette.skyBottom = '#495D87';
      palette.mountainFar = '#A8B9D2';
      palette.hillMid = '#C6D4E6';
      palette.hillFront = '#DCE6F2';
      palette.hillForeground = '#EEF4FA';
      palette.lakeTop = '#365078';
      palette.lakeBottom = '#48658E';
      palette.cloudFill = '#62769E';
      palette.cloudStroke = '#495B82';
    } else {
      palette.skyTop = '#D7E7F5';
      palette.skyMid = '#EBF3FA';
      palette.skyBottom = '#F9FBFE';
      palette.mountainFar = '#D4E1EE';
      palette.hillMid = '#E5EEF6';
      palette.hillFront = '#F2F7FB';
      palette.hillForeground = '#FAFDFE';
      palette.lakeTop = '#BBD8EC';
      palette.lakeBottom = '#D5E9F6';
      palette.cloudFill = '#FFFFFF';
      palette.cloudStroke = '#C8DAE8';
      palette.grassStroke = '#A8C2D4';
      palette.showSun = false;
    }
  }

  return palette;
}
