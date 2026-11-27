import { useEffect, useRef, useState } from 'react';
import { ChuncheonBackdrop } from './ChuncheonBackdrop';
import { Mascot } from './Mascot';
import { Reveal } from './Reveal';
import {
  APP_LIVE_URL,
  MOOD_STAGES,
  clampAbsentDays,
  getMascotHeight,
  getMoodByAbsentDays,
} from '../utils/potatoLogic';
import {
  CHUNCHEON_API_URL,
  WeatherType,
  getScenePalette,
  getTimePhaseFromHour,
  mapWmoWeatherCode,
} from '../utils/environmentLogic';
import { PotatoTypeId } from '../utils/potatoQuizLogic';
import {
  POTATO_PROP_META,
  loadCroppedPropPotatoDataUrl,
} from '../utils/potatoPropsSprite';

interface HeroSectionProps {
  savedPotatoType?: PotatoTypeId | null;
  onResetPotatoType?: () => void;
}

const POKE_REACTIONS: Record<string, string> = {
  happy: '말랑말랑! 감자가 기분 좋게 방긋 웃어요.',
  neutral: '톡톡! 심심했던 감자가 눈을 깜빡여요.',
  annoyed: '톡톡! 조금 뾰로통하지만 반가워해요.',
  angry: '톡톡! 얼른 놀아달라고 발을 동동 굴러요!',
};

export function HeroSection({
  savedPotatoType = null,
  onResetPotatoType,
}: HeroSectionProps) {
  const [absentDays, setAbsentDays] = useState<number>(0);
  const [pokeMessage, setPokeMessage] = useState<string>('');
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [propImageUrl, setPropImageUrl] = useState<string | null>(null);
  const [isPropHopping, setIsPropHopping] = useState<boolean>(false);
  const propHopTimerRef = useRef<number | null>(null);
  const [chuncheonWeather, setChuncheonWeather] =
    useState<WeatherType>('clear');
  const [currentHour, setCurrentHour] = useState<number>(() =>
    new Date().getHours()
  );

  // 저장된 감자 유형이 있으면 /potato-props.jpg에서 해당 유형(상단 70%)을 크롭 + 흰 배경 투명화
  useEffect(() => {
    if (!savedPotatoType) {
      setPropImageUrl(null);
      return;
    }

    let cancelled = false;
    loadCroppedPropPotatoDataUrl(savedPotatoType).then((dataUrl) => {
      if (!cancelled) {
        setPropImageUrl(dataUrl);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [savedPotatoType]);

  useEffect(() => {
    return () => {
      if (propHopTimerRef.current !== null) {
        window.clearTimeout(propHopTimerRef.current);
      }
    };
  }, []);

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

  const handlePropMascotPoke = () => {
    setIsPropHopping(false);
    window.requestAnimationFrame(() => {
      setIsPropHopping(true);
    });
    if (propHopTimerRef.current !== null) {
      window.clearTimeout(propHopTimerRef.current);
    }
    propHopTimerRef.current = window.setTimeout(() => {
      setIsPropHopping(false);
    }, 560);
    handleMascotPoke();
  };

  const savedPotatoMeta = savedPotatoType
    ? POTATO_PROP_META[savedPotatoType]
    : null;
  const isPropMascotActive = Boolean(
    savedPotatoType && savedPotatoMeta && propImageUrl
  );

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
                className={`max-w-xl text-lg sm:text-xl leading-relaxed rounded-2xl px-4 py-3 border transition-colors duration-300 ${
                  palette.isDarkSky
                    ? 'text-[#FFFDF7] bg-[#1E2A4A]/75 border-[#FFFDF7]/25 backdrop-blur-xs'
                    : 'text-[#1F1712] bg-[#FFFDF7]/92 border-[#3A2A20]/15 backdrop-blur-[2px]'
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
                href="#intro-video"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById('intro-video');
                  const contentEl = section?.querySelector<HTMLElement>(
                    '[data-testid="intro-video-content"]'
                  );
                  const cardEl = section?.querySelector<HTMLElement>(
                    '[data-testid="intro-video-card"]'
                  );
                  if (!section || !contentEl || !cardEl) {
                    section?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    });
                    return;
                  }

                  const headerHeight =
                    document
                      .querySelector('header')
                      ?.getBoundingClientRect().height ?? 64;
                  const availableHeight = window.innerHeight - headerHeight;
                  const contentTop =
                    window.scrollY + contentEl.getBoundingClientRect().top;
                  const cardRect = cardEl.getBoundingClientRect();
                  const cardTop = window.scrollY + cardRect.top;
                  const cardBottom = window.scrollY + cardRect.bottom;
                  const totalBlockHeight = cardBottom - contentTop;

                  const targetTop =
                    totalBlockHeight + 24 <= availableHeight
                      ? contentTop -
                        headerHeight -
                        Math.max(16, (availableHeight - totalBlockHeight) / 2)
                      : cardTop -
                        headerHeight -
                        Math.max(12, (availableHeight - cardRect.height) / 2);

                  window.scrollTo({
                    top: Math.max(0, Math.round(targetTop)),
                    behavior: 'smooth',
                  });
                }}
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
                <span className="text-sm text-[#1F1712] whitespace-nowrap shrink-0 tabular-nums">
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
                  className="relative mb-3 max-w-sm w-full text-center bg-[#FFFDF7] border-2 border-[#3A2A20] rounded-2xl px-4 py-2.5 text-[16.5px] text-[#3A2A20]"
                >
                  <span>{pokeMessage || currentMood.speechPlaceholder}</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3.5 h-3.5 bg-[#FFFDF7] border-r-2 border-b-2 border-[#3A2A20] rotate-45"
                  />
                </div>

                {/* 살아 있는 감자 (숨쉬기 · 눈 깜빡임 · 클릭 젤리 반응) */}
                <div className="my-1">
                  {isPropMascotActive && propImageUrl && savedPotatoMeta ? (
                    <button
                      type="button"
                      onClick={handlePropMascotPoke}
                      aria-label={`${savedPotatoMeta.name} (${savedPotatoMeta.propName}) 쓰다듬기`}
                      className="inline-flex items-center justify-center rounded-3xl p-1 cursor-pointer transition-transform focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3d7d47] focus-visible:ring-offset-2"
                    >
                      <span
                        data-testid="hero-prop-mascot"
                        data-potato-type={savedPotatoMeta.id}
                        className={`mascot-wrap ${
                          isPropHopping
                            ? 'mascot-anim-hop'
                            : `mascot-anim-${currentMood.mood}`
                        } flex items-center justify-center`}
                        style={{
                          width: '164px',
                          height: `${getMascotHeight(164)}px`,
                        }}
                      >
                        <img
                          src={propImageUrl}
                          alt={`${savedPotatoMeta.name} (${savedPotatoMeta.propName})`}
                          draggable={false}
                          className="w-full h-full object-contain select-none"
                        />
                      </span>
                    </button>
                  ) : (
                    <Mascot
                      mood={currentMood.mood}
                      grow={0}
                      size={164}
                      animate
                      blink
                      interactive
                      onPoke={handleMascotPoke}
                    />
                  )}
                </div>

                {isPropMascotActive && savedPotatoMeta && onResetPotatoType && (
                  <button
                    type="button"
                    data-testid="reset-default-potato-btn"
                    onClick={onResetPotatoType}
                    className="mt-1 mb-1 max-w-full inline-flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#FFFDF7] hover:bg-[#F5EFE2] active:translate-y-0.5 border-2 border-[#3A2A20]/35 hover:border-[#3A2A20] text-[11px] sm:text-xs font-display text-[#3A2A20] shadow-[0_2px_0_rgba(58,42,32,0.18)] transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                  >
                    <span className="text-[#3D7D47]">
                      내 감자: {savedPotatoMeta.name}
                    </span>
                    <span aria-hidden="true" className="text-[#3A2A20]/40">
                      ·
                    </span>
                    <span>기본 감자로 보기</span>
                  </button>
                )}

                <p className="mt-1 text-xs text-[#332720]">
                  감자를 직접 눌러보면 톡톡 반응해요
                  {pokeCount > 0 ? ` · 쓰다듬은 횟수 ${pokeCount}번` : ''}
                </p>
              </div>

              {/* 0일~10일 슬라이더 */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center justify-between text-sm text-[#1F1712]">
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
                <div className="flex justify-between text-xs text-[#332720] tabular-nums px-0.5">
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
