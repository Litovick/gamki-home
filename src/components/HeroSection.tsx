import { useEffect, useState } from 'react';
import { ChuncheonBackdrop } from './ChuncheonBackdrop';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import {
  APP_LIVE_URL,
  MOOD_STAGES,
  clampAbsentDays,
  getMoodByAbsentDays,
} from '../utils/potatoLogic';
import {
  CHUNCHEON_API_URL,
  WeatherType,
  getScenePalette,
  getTimePhaseFromHour,
  mapWmoWeatherCode,
} from '../utils/environmentLogic';

const POKE_REACTIONS: Record<string, string> = {
  happy: '말랑말랑! 감자가 기분 좋게 방긋 웃어요.',
  neutral: '톡톡! 심심했던 감자가 눈을 깜빡여요.',
  annoyed: '톡톡! 조금 뾰로통하지만 반가워해요.',
  angry: '톡톡! 얼른 놀아달라고 발을 동동 굴러요!',
};

export function HeroSection() {
  const [absentDays, setAbsentDays] = useState<number>(0);
  const [pokeMessage, setPokeMessage] = useState<string>('');
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [chuncheonWeather, setChuncheonWeather] =
    useState<WeatherType>('clear');
  const [currentHour, setCurrentHour] = useState<number>(() =>
    new Date().getHours()
  );

  // 브라우저 현재 시각 자동 갱신
  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // 춘천 실시간 날씨 자동 연동 (Open-Meteo API, 실패 시 기본값 '맑음')
  useEffect(() => {
    const controller = new AbortController();

    async function fetchChuncheonWeather() {
      try {
        const response = await fetch(CHUNCHEON_API_URL, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = (await response.json()) as {
          current?: { weather_code?: number };
        };
        const code = data?.current?.weather_code;
        if (typeof code === 'number') {
          setChuncheonWeather(mapWmoWeatherCode(code));
        }
      } catch {
        // 네트워크 실패 시 기본값 '맑음' 유지
      }
    }

    fetchChuncheonWeather();

    return () => {
      controller.abort();
    };
  }, []);

  const currentMood = getMoodByAbsentDays(absentDays);
  const currentTimePhase = getTimePhaseFromHour(currentHour);
  const palette = getScenePalette(
    currentTimePhase,
    chuncheonWeather,
    currentMood.mood
  );

  const handleDaysChange = (nextDays: number) => {
    setAbsentDays(clampAbsentDays(nextDays));
    setPokeMessage('');
  };

  const handleMascotPoke = () => {
    setPokeCount((c) => c + 1);
    setPokeMessage(POKE_REACTIONS[currentMood.mood]);
  };

  return (
    <section
      id="intro"
      className="relative pt-24 pb-20 sm:pt-28 sm:pb-24 overflow-hidden"
    >
      {/* 현재 시각 + 춘천 실제 날씨로 자동 변화하는 배경 일러스트 */}
      <ChuncheonBackdrop
        time={currentTimePhase}
        weather={chuncheonWeather}
        mood={currentMood.mood}
      />

      {/* 히어로 콘텐츠 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* 좌측 소개 영역 */}
          <Reveal
            className="lg:col-span-6 space-y-6"
            threshold={0.05}
            rootMargin="0px"
          >
            <div className="space-y-4">
              <h1
                className={`font-display text-5xl sm:text-6xl leading-[1.12] tracking-tight transition-colors duration-300 ${
                  palette.isDarkSky
                    ? 'text-[#FFFDF7] drop-shadow-[0_2px_6px_rgba(20,28,52,0.55)]'
                    : 'text-[#3A2A20]'
                }`}
              >
                감자 키우기
              </h1>
              <p
                className={`max-w-lg text-lg sm:text-xl leading-relaxed rounded-2xl px-4 py-3 border transition-colors duration-300 ${
                  palette.isDarkSky
                    ? 'text-[#FFFDF7] bg-[#1E2A4A]/75 border-[#FFFDF7]/25 backdrop-blur-xs'
                    : 'text-[#4D3B30] bg-[#FFFDF7]/85 border-[#3A2A20]/12 backdrop-blur-[2px]'
                }`}
              >
                감자를 키우다 보면 졸업할 때 이력서가 채워져 있는 앱
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={APP_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-lg tracking-wide border-2 border-[#3A2A20] shadow-[0_4px_0_#3A2A20] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
              >
                앱 체험하러 가기
              </a>

              <a
                href="#core-features"
                className="px-6 py-3.5 rounded-2xl bg-[#FFFDF7] hover:bg-[#F5EFE2] active:translate-y-0.5 text-[#3A2A20] font-display text-lg tracking-wide border-2 border-[#3A2A20] shadow-[0_4px_0_#3A2A20] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
              >
                소개 자세히 보기
              </a>
            </div>
          </Reveal>

          {/* 우측 '미접속 일수별 감자 변화 체험' 카드 */}
          <Reveal
            className="lg:col-span-6"
            delayMs={120}
            threshold={0.05}
            rootMargin="0px"
          >
            <div className="bg-[#FFFDF7]/96 border-2 border-[#3A2A20] rounded-[28px] p-6 sm:p-7 shadow-[0_8px_0_#3A2A20]">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#3A2A20]/12">
                <h2 className="font-display text-xl sm:text-2xl text-[#3A2A20]">
                  미접속 일수별 감자 변화 체험
                </h2>
                <span className="text-sm text-[#5B493E] whitespace-nowrap shrink-0 tabular-nums">
                  {absentDays}일 · {currentMood.label}
                </span>
              </div>

              {/* 말풍선 + 살아 있는 감자 마스코트 */}
              <div
                className="mt-5 rounded-2xl px-4 py-5 flex flex-col items-center justify-center transition-colors duration-200 border border-[#3A2A20]/10"
                style={{ backgroundColor: currentMood.accentBg }}
              >
                {/* 상태 말풍선 */}
                <div
                  role="status"
                  aria-live="polite"
                  className="relative mb-3 max-w-sm w-full text-center bg-[#FFFDF7] border-2 border-[#3A2A20] rounded-2xl px-4 py-2.5 text-[15px] text-[#3A2A20]"
                >
                  <span>{pokeMessage || currentMood.speechPlaceholder}</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-3.5 bg-[#FFFDF7] border-r-2 border-b-2 border-[#3A2A20] rotate-45"
                  />
                </div>

                {/* 살아 있는 감자 (숨쉬기 · 눈 깜빡임 · 클릭 젤리 반응) */}
                <div className="my-1">
                  <Mascot
                    mood={currentMood.mood}
                    grow={0}
                    size={164}
                    animate
                    blink
                    interactive
                    onPoke={handleMascotPoke}
                  />
                </div>

                <p className="mt-1 text-xs text-[#6B584B]">
                  감자를 직접 눌러보면 톡톡 반응해요
                  {pokeCount > 0 ? ` · 쓰다듬은 횟수 ${pokeCount}번` : ''}
                </p>
              </div>

              {/* 0일~10일 슬라이더 */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-sm text-[#4D3B30]">
                  <label htmlFor="absent-days-slider" className="font-medium">
                    미접속 일수 조절
                  </label>
                  <span className="font-display text-base text-[#3A2A20] tabular-nums">
                    {absentDays}일 미접속 ({currentMood.dayRangeLabel})
                  </span>
                </div>
                <input
                  id="absent-days-slider"
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={absentDays}
                  onChange={(e) => handleDaysChange(Number(e.target.value))}
                  className="w-full potato-slider"
                />
                <div className="flex justify-between text-xs text-[#6B584B] tabular-nums px-0.5">
                  <span>0일</span>
                  <span>2일</span>
                  <span>4일</span>
                  <span>7일</span>
                  <span>10일</span>
                </div>
              </div>

              {/* 빠른 선택 버튼 4개 */}
              <div
                className="mt-5 grid grid-cols-4 gap-2"
                role="group"
                aria-label="미접속 일수 빠른 선택"
              >
                {MOOD_STAGES.map((stage) => {
                  const isActive = currentMood.mood === stage.mood;
                  return (
                    <button
                      key={stage.mood}
                      type="button"
                      onClick={() => handleDaysChange(stage.quickDayValue)}
                      aria-pressed={isActive}
                      className={`py-2.5 px-2 rounded-xl border-2 text-sm font-display transition-colors duration-150 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] ${
                        isActive
                          ? 'bg-[#3A2A20] text-[#FFFDF7] border-[#3A2A20] shadow-[0_2px_0_#1f1610]'
                          : 'bg-[#FFFDF7] text-[#3A2A20] border-[#3A2A20]/30 hover:border-[#3A2A20] hover:bg-[#F7F1E4]'
                      }`}
                    >
                      {stage.shortButtonLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
