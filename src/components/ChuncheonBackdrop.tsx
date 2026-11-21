import { MoodType } from '../utils/potatoLogic';
import {
  TimePhase,
  WeatherType,
  getScenePalette,
} from '../utils/environmentLogic';

interface ChuncheonBackdropProps {
  time: TimePhase;
  weather: WeatherType;
  mood: MoodType;
}

const STARS = [
  { cx: 110, cy: 78, r: 2.8, delay: '0s' },
  { cx: 245, cy: 52, r: 2.2, delay: '0.6s' },
  { cx: 390, cy: 96, r: 3.1, delay: '1.2s' },
  { cx: 520, cy: 62, r: 2.1, delay: '0.3s' },
  { cx: 680, cy: 84, r: 2.6, delay: '1.5s' },
  { cx: 815, cy: 48, r: 2.4, delay: '0.9s' },
  { cx: 965, cy: 92, r: 3.0, delay: '0.4s' },
  { cx: 1090, cy: 60, r: 2.2, delay: '1.8s' },
  { cx: 1320, cy: 86, r: 2.7, delay: '1.1s' },
  { cx: 175, cy: 155, r: 2.0, delay: '1.6s' },
  { cx: 465, cy: 145, r: 2.3, delay: '0.7s' },
  { cx: 885, cy: 142, r: 2.0, delay: '1.3s' },
] as const;

const RAIN_DROPS = [
  { x: 90, y: 0, delay: '0s', dur: '0.95s' },
  { x: 180, y: -40, delay: '0.35s', dur: '1.05s' },
  { x: 265, y: -15, delay: '0.7s', dur: '0.9s' },
  { x: 355, y: -60, delay: '0.15s', dur: '1.1s' },
  { x: 440, y: -25, delay: '0.55s', dur: '0.95s' },
  { x: 530, y: -50, delay: '0.85s', dur: '1.05s' },
  { x: 615, y: -10, delay: '0.25s', dur: '0.9s' },
  { x: 705, y: -45, delay: '0.6s', dur: '1.0s' },
  { x: 790, y: -20, delay: '0.1s', dur: '0.95s' },
  { x: 880, y: -55, delay: '0.45s', dur: '1.1s' },
  { x: 965, y: -30, delay: '0.8s', dur: '0.9s' },
  { x: 1055, y: -15, delay: '0.2s', dur: '1.05s' },
  { x: 1140, y: -50, delay: '0.65s', dur: '0.95s' },
  { x: 1230, y: -25, delay: '0.3s', dur: '1.0s' },
  { x: 1320, y: -40, delay: '0.75s', dur: '0.92s' },
  { x: 1395, y: -10, delay: '0.4s', dur: '1.08s' },
] as const;

const SNOW_FLAKES = [
  { cx: 85, r: 4.5, delay: '0s', dur: '5.4s' },
  { cx: 175, r: 3.5, delay: '1.1s', dur: '4.8s' },
  { cx: 260, r: 5.2, delay: '2.3s', dur: '5.9s' },
  { cx: 350, r: 3.8, delay: '0.6s', dur: '5.1s' },
  { cx: 435, r: 4.8, delay: '3.0s', dur: '5.5s' },
  { cx: 525, r: 3.4, delay: '1.7s', dur: '4.6s' },
  { cx: 610, r: 5.0, delay: '0.3s', dur: '5.8s' },
  { cx: 695, r: 4.0, delay: '2.5s', dur: '5.0s' },
  { cx: 785, r: 4.6, delay: '1.4s', dur: '5.3s' },
  { cx: 870, r: 3.6, delay: '3.4s', dur: '4.9s' },
  { cx: 955, r: 5.4, delay: '0.9s', dur: '6.0s' },
  { cx: 1045, r: 3.9, delay: '2.0s', dur: '5.2s' },
  { cx: 1130, r: 4.7, delay: '3.8s', dur: '5.6s' },
  { cx: 1215, r: 3.5, delay: '1.2s', dur: '4.7s' },
  { cx: 1300, r: 5.1, delay: '2.8s', dur: '5.7s' },
  { cx: 1385, r: 4.2, delay: '0.4s', dur: '5.1s' },
] as const;

export function ChuncheonBackdrop({
  time,
  weather,
  mood,
}: ChuncheonBackdropProps) {
  const palette = getScenePalette(time, weather, mood);
  const isHeavyClouds = weather === 'cloudy' || weather === 'rain';
  const isSnow = weather === 'snow';
  const isRain = weather === 'rain';

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-testid="chuncheon-backdrop"
      data-time={time}
      data-weather={weather}
      data-hill-color={palette.hillFront}
    >
      <svg
        viewBox="0 0 1440 820"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="chuncheonSky" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={palette.skyTop}
              className="scene-transition"
            />
            <stop
              offset="52%"
              stopColor={palette.skyMid}
              className="scene-transition"
            />
            <stop
              offset="100%"
              stopColor={palette.skyBottom}
              className="scene-transition"
            />
          </linearGradient>
          <linearGradient id="chuncheonLake" x1="0" y1="0" x2="1" y2="0">
            <stop
              offset="0%"
              stopColor={palette.lakeTop}
              className="scene-transition"
            />
            <stop
              offset="50%"
              stopColor={palette.lakeBottom}
              className="scene-transition"
            />
            <stop
              offset="100%"
              stopColor={palette.lakeTop}
              className="scene-transition"
            />
          </linearGradient>
        </defs>

        {/* 레이어 1: 춘천 하늘 */}
        <rect width="1440" height="820" fill="url(#chuncheonSky)" />

        {/* 레이어 2: 별 & 초승달 (밤/새벽) */}
        <g
          className="scene-transition"
          opacity={palette.showStars ? 1 : 0}
        >
          {STARS.map((star, idx) => (
            <circle
              key={idx}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="#FFF8D2"
              className="star-twinkle"
              style={{ animationDelay: star.delay }}
            />
          ))}

          {/* 밤 초승달 */}
          {time === 'night' && weather !== 'rain' && (
            <g transform="translate(1225, 118)">
              <circle cx="0" cy="0" r="38" fill="#FFF2B2" opacity="0.22" />
              <path
                d="M12 -28 A 28 28 0 1 0 12 28 A 22 22 0 1 1 12 -28 Z"
                fill="#FFF4C2"
                stroke="#E5CF82"
                strokeWidth="2"
              />
            </g>
          )}
        </g>

        {/* 레이어 3: 해 (낮/새벽/노을) */}
        <g
          className="scene-transition"
          opacity={palette.showSun ? 0.92 : 0}
          transform={`translate(1220, ${palette.sunY})`}
        >
          <circle
            cx="0"
            cy="0"
            r="60"
            fill={palette.sunColorOuter}
            className="scene-transition"
          />
          <circle
            cx="0"
            cy="0"
            r="42"
            fill={palette.sunColorInner}
            className="scene-transition"
          />
        </g>

        {/* 레이어 4: 떠가는 구름 */}
        <g className="cloud-slow" opacity={isHeavyClouds ? 0.96 : 0.9}>
          <path
            d="M120 112 C 120 94, 144 86, 160 94 C 170 76, 202 74, 218 90 C 238 86, 258 98, 258 114 C 258 128, 244 136, 228 136 L 140 136 C 126 136, 120 126, 120 112 Z"
            fill={palette.cloudFill}
            stroke={palette.cloudStroke}
            strokeWidth="2.5"
            className="scene-transition"
          />
        </g>

        <g className="cloud-reverse" opacity={isHeavyClouds ? 0.95 : 0.88}>
          <path
            d="M555 104 C 555 88, 576 80, 592 86 C 602 70, 634 70, 646 86 C 664 82, 684 94, 684 108 C 684 122, 670 128, 654 128 L 575 128 C 562 128, 555 117, 555 104 Z"
            fill={palette.cloudFill}
            stroke={palette.cloudStroke}
            strokeWidth="2.5"
            className="scene-transition"
          />
        </g>

        <g className="cloud-slow" opacity={isHeavyClouds ? 0.94 : 0.82}>
          <path
            d="M995 162 C 995 148, 1012 141, 1026 146 C 1036 132, 1066 133, 1076 148 C 1091 146, 1108 156, 1108 168 C 1108 179, 1096 185, 1083 185 L 1011 185 C 1001 185, 995 174, 995 162 Z"
            fill={palette.cloudFill}
            stroke={palette.cloudStroke}
            strokeWidth="2.2"
            className="scene-transition"
          />
        </g>

        {/* 흐림/비 추가 구름 */}
        <g
          className="cloud-reverse scene-transition"
          opacity={isHeavyClouds ? 0.92 : 0}
        >
          <path
            d="M320 165 C 320 148, 344 139, 364 146 C 378 128, 418 128, 434 146 C 455 142, 476 155, 476 171 C 476 185, 461 193, 443 193 L 343 193 C 328 193, 320 181, 320 165 Z"
            fill={palette.cloudFill}
            stroke={palette.cloudStroke}
            strokeWidth="2.5"
            className="scene-transition"
          />
          <path
            d="M780 120 C 780 104, 804 96, 824 102 C 838 86, 876 86, 892 103 C 912 100, 932 112, 932 126 C 932 140, 918 148, 900 148 L 802 148 C 788 148, 780 135, 780 120 Z"
            fill={palette.cloudFill}
            stroke={palette.cloudStroke}
            strokeWidth="2.5"
            className="scene-transition"
          />
        </g>

        {/* 레이어 5: 먼 춘천 산능선 */}
        <path
          d="M-20 485 Q 170 335, 380 422 T 820 398 T 1220 362 T 1460 425 L 1460 600 L -20 600 Z"
          fill={palette.mountainFar}
          className="scene-transition"
        />

        {/* 레이어 6: 중간 언덕 */}
        <path
          d="M-20 510 Q 240 408, 510 470 T 1010 448 T 1460 478 L 1460 640 L -20 640 Z"
          fill={palette.hillMid}
          className="scene-transition"
        />

        {/* 레이어 7: 멀리 보이는 작은 학교 건물 */}
        <g transform="translate(520, 412)">
          <circle
            cx="-18"
            cy="36"
            r="14"
            fill={isSnow ? '#DCE8F2' : time === 'night' ? '#314F4C' : '#8DC37C'}
            stroke="#5A6C56"
            strokeWidth="2"
            className="scene-transition"
          />
          <circle
            cx="98"
            cy="34"
            r="15"
            fill={isSnow ? '#E4EEF6' : time === 'night' ? '#314F4C' : '#8DC37C'}
            stroke="#5A6C56"
            strokeWidth="2"
            className="scene-transition"
          />
          <circle
            cx="113"
            cy="40"
            r="11"
            fill={isSnow ? '#F1F6FA' : time === 'night' ? '#3E5E59' : '#9FD08D'}
            stroke="#5A6C56"
            strokeWidth="2"
            className="scene-transition"
          />
          {/* 본관 */}
          <rect
            x="0"
            y="18"
            width="82"
            height="34"
            rx="3"
            fill={palette.schoolWall}
            stroke="#5B493E"
            strokeWidth="2.5"
            className="scene-transition"
          />
          {/* 지붕 */}
          <path
            d="M-6 20 L 41 2 L 88 20 Z"
            fill={isSnow ? '#F7FBFE' : palette.schoolRoof}
            stroke="#5B493E"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="scene-transition"
          />
          {/* 시계탑 */}
          <rect
            x="31"
            y="6"
            width="20"
            height="16"
            fill={palette.schoolWall}
            stroke="#5B493E"
            strokeWidth="2"
            className="scene-transition"
          />
          <circle
            cx="41"
            cy="14"
            r="4.5"
            fill="#FFE8A3"
            stroke="#5B493E"
            strokeWidth="1.5"
          />
          {/* 창문 (밤엔 따뜻한 불빛) */}
          <rect
            x="10"
            y="27"
            width="11"
            height="10"
            rx="1.5"
            fill={palette.schoolWindow}
            stroke="#5B493E"
            strokeWidth="1.5"
            className="scene-transition"
          />
          <rect
            x="61"
            y="27"
            width="11"
            height="10"
            rx="1.5"
            fill={palette.schoolWindow}
            stroke="#5B493E"
            strokeWidth="1.5"
            className="scene-transition"
          />
          <rect
            x="35"
            y="34"
            width="12"
            height="18"
            rx="2"
            fill="#C7986C"
            stroke="#5B493E"
            strokeWidth="1.8"
          />
        </g>

        {/* 레이어 8: 잔잔한 춘천 호수 */}
        <path
          d="M-20 532 Q 360 505, 740 530 T 1460 522 L 1460 675 L -20 675 Z"
          fill="url(#chuncheonLake)"
        />
        <g
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={time === 'night' ? 0.28 : 0.62}
          className="scene-transition"
        >
          <path d="M120 568 Q 155 564, 190 568" fill="none" />
          <path d="M430 554 Q 475 549, 520 554" fill="none" />
          <path d="M760 574 Q 805 570, 850 574" fill="none" />
          <path d="M1080 558 Q 1120 554, 1160 558" fill="none" />
          <path d="M270 598 Q 305 595, 340 598" fill="none" />
        </g>

        {/* 레이어 9: 앞쪽 호숫가 언덕 (눈 올 때 하얗게 덮임) */}
        <path
          d="M-20 638 Q 320 572, 740 632 T 1460 606 L 1460 820 L -20 820 Z"
          fill={palette.hillFront}
          className="scene-transition"
        />
        <path
          d="M-20 704 Q 420 652, 890 700 T 1460 678 L 1460 820 L -20 820 Z"
          fill={palette.hillForeground}
          className="scene-transition"
        />

        {/* 하단 자연스러운 페이지 연결 */}
        <path
          d="M-20 785 Q 480 755, 960 785 T 1460 775 L 1460 825 L -20 825 Z"
          fill="#FFFDF7"
        />

        {/* 언덕 풀잎 & 들꽃 (눈 올 땐 은은한 눈 둔덕) */}
        {!isSnow ? (
          <>
            <g
              stroke={palette.grassStroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className="scene-transition"
            >
              <path d="M110 705 Q 106 691, 100 685 M110 705 Q 116 690, 122 686" />
              <path d="M360 682 Q 356 669, 350 663 M360 682 Q 365 669, 371 665" />
              <path d="M1285 678 Q 1281 665, 1275 659 M1285 678 Q 1291 665, 1297 661" />
            </g>
            <g opacity={time === 'night' ? 0.55 : 1} className="scene-transition">
              <circle
                cx="245"
                cy="694"
                r="5"
                fill="#FFF7D6"
                stroke="#D9A74A"
                strokeWidth="1.5"
              />
              <circle
                cx="515"
                cy="706"
                r="4.5"
                fill="#F1EBFF"
                stroke="#9F86D8"
                strokeWidth="1.5"
              />
              <circle
                cx="1185"
                cy="698"
                r="5"
                fill="#FFF7D6"
                stroke="#D9A74A"
                strokeWidth="1.5"
              />
            </g>
          </>
        ) : (
          <g fill="#FFFFFF" opacity="0.88">
            <ellipse cx="220" cy="708" rx="46" ry="12" />
            <ellipse cx="520" cy="718" rx="58" ry="14" />
            <ellipse cx="1220" cy="704" rx="52" ry="13" />
          </g>
        )}

        {/* 레이어 10: 비 올 때 빗줄기 애니메이션 */}
        {isRain && (
          <g data-testid="rain-layer">
            {RAIN_DROPS.map((drop, idx) => (
              <line
                key={idx}
                x1={drop.x}
                y1={drop.y}
                x2={drop.x - 10}
                y2={drop.y + 34}
                stroke={time === 'night' ? '#A8C9EC' : '#6FA3CC'}
                strokeWidth="2.8"
                strokeLinecap="round"
                className="rain-streak"
                style={{
                  animationDelay: drop.delay,
                  animationDuration: drop.dur,
                }}
              />
            ))}
          </g>
        )}

        {/* 레이어 11: 눈 올 때 흩날리는 눈송이 애니메이션 */}
        {isSnow && (
          <g data-testid="snow-layer">
            {SNOW_FLAKES.map((flake, idx) => (
              <circle
                key={idx}
                cx={flake.cx}
                cy={-20}
                r={flake.r}
                fill="#FFFFFF"
                stroke="#C5D9EA"
                strokeWidth="1.2"
                className="snow-flake"
                style={{
                  animationDelay: flake.delay,
                  animationDuration: flake.dur,
                }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
