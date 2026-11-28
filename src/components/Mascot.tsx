import { useEffect, useRef, useState } from 'react';
import {
  CareActionId,
  GrowthStage,
  MoodType,
  STEM_TOP,
  getGrowthStageInfo,
  getMascotHeight,
} from '../utils/potatoLogic';

interface MascotProps {
  mood?: MoodType;
  grow?: GrowthStage;
  size?: number;
  animate?: boolean;
  interactive?: boolean;
  blink?: boolean;
  sleeping?: boolean;
  umbrella?: boolean;
  effect?: CareActionId | null;
  effectKey?: number;
  onPoke?: () => void;
  alt?: string;
  className?: string;
}

const MOOD_IMAGE_MAP: Record<MoodType, string> = {
  happy: '/mascot/happy.webp',
  neutral: '/mascot/neutral.webp',
  annoyed: '/mascot/annoyed.webp',
  angry: '/mascot/angry.webp',
};

const MOOD_KO_LABEL: Record<MoodType, string> = {
  happy: '웃는 감자',
  neutral: '무표정 감자',
  annoyed: '짜증난 감자',
  angry: '화난 감자',
};

const LEAF_RIGHT_PATH =
  'M150 118 C 164 100, 188 99, 198 109 C 188 124, 166 127, 150 118 Z';
const LEAF_LEFT_PATH =
  'M150 110 C 136 92, 112 92, 102 102 C 112 117, 134 119, 150 110 Z';

export function Mascot({
  mood = 'happy',
  grow = 0,
  size = 160,
  animate = true,
  interactive = false,
  blink = false,
  sleeping = false,
  umbrella = false,
  effect = null,
  effectKey = 0,
  onPoke,
  alt,
  className = '',
}: MascotProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const [isHopping, setIsHopping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const hopTimerRef = useRef<number | null>(null);

  const canCloseEyes = mood === 'happy' || mood === 'neutral';
  const isSleeping = sleeping && canCloseEyes;

  useEffect(() => {
    setImgFailed(false);
  }, [mood]);

  // 자연스러운 눈 깜빡임 (웃음/무표정, 깨어 있을 때)
  useEffect(() => {
    if (!blink || !canCloseEyes || isSleeping) {
      setIsBlinking(false);
      return;
    }

    let blinkEndTimer: number | null = null;
    let nextBlinkTimer: number | null = null;

    const scheduleBlink = () => {
      const waitMs = 2800 + Math.floor(Math.random() * 2200);
      nextBlinkTimer = window.setTimeout(() => {
        setIsBlinking(true);
        blinkEndTimer = window.setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 160);
      }, waitMs);
    };

    scheduleBlink();

    return () => {
      if (nextBlinkTimer !== null) window.clearTimeout(nextBlinkTimer);
      if (blinkEndTimer !== null) window.clearTimeout(blinkEndTimer);
    };
  }, [blink, canCloseEyes, isSleeping]);

  useEffect(() => {
    return () => {
      if (hopTimerRef.current !== null) {
        window.clearTimeout(hopTimerRef.current);
      }
    };
  }, []);

  const height = getMascotHeight(size);
  const stemTopY = STEM_TOP[grow];
  const stageInfo = getGrowthStageInfo(grow);
  const animClass = animate
    ? isHopping
      ? 'mascot-anim-hop'
      : isSleeping
      ? 'mascot-anim-sleep'
      : `mascot-anim-${mood}`
    : '';

  const showEyelids = canCloseEyes && (isSleeping || isBlinking);

  const handleClick = () => {
    if (!interactive) return;
    setIsHopping(false);
    window.requestAnimationFrame(() => {
      setIsHopping(true);
    });
    if (hopTimerRef.current !== null) {
      window.clearTimeout(hopTimerRef.current);
    }
    hopTimerRef.current = window.setTimeout(() => {
      setIsHopping(false);
    }, 560);
    onPoke?.();
  };

  const visualContent = (
    <span
      className={`mascot-wrap ${animClass} ${className}`}
      style={{ width: `${size}px`, height: `${height}px` }}
      data-testid="mascot-character"
      data-mood={mood}
      data-grow={grow}
      data-sleeping={isSleeping ? 'true' : 'false'}
      data-umbrella={umbrella ? 'true' : 'false'}
    >
      {!imgFailed ? (
        <img
          src={MOOD_IMAGE_MAP[mood]}
          alt={
            alt ??
            `${MOOD_KO_LABEL[mood]} (${stageInfo.name}${
              isSleeping ? ', 취침 중' : ''
            })`
          }
          referrerPolicy="no-referrer"
          draggable={false}
          onError={() => setImgFailed(true)}
          className="mascot-layer object-contain"
        />
      ) : (
        <svg
          viewBox="0 0 300 348"
          className="mascot-layer"
          role="img"
          aria-label={alt ?? `${MOOD_KO_LABEL[mood]} (${stageInfo.name})`}
        >
          <path
            d="M150 134 C 218 134, 258 188, 252 252 C 246 306, 204 328, 150 328 C 96 328, 54 306, 48 252 C 42 188, 82 134, 150 134 Z"
            fill="#E8C284"
            stroke="#3a2a20"
            strokeWidth="8"
          />
          <circle cx="111" cy="240" r="8" fill="#3a2a20" />
          <circle cx="181" cy="239" r="8" fill="#3a2a20" />
          <path
            d="M138 252 Q 150 264 162 252"
            fill="none"
            stroke="#3a2a20"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* 5단계 싹 성장 + 눈꺼풀(Eyelids) + 우산 + 취침 쿨쿨 + 돌봄 효과 오버레이 SVG */}
      <svg
        viewBox="0 0 300 348"
        className="mascot-layer overflow-visible"
        aria-hidden="true"
      >
        {/* 5단계 싹 성장 */}
        {grow > 0 && (
          <g key={grow} className="sprout-group">
            <path
              d={`M150 134 Q 148 ${(134 + stemTopY) / 2} 150 ${stemTopY}`}
              fill="none"
              stroke="#3a2a20"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d={LEAF_RIGHT_PATH}
              fill="#6cc070"
              stroke="#3a2a20"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {grow >= 2 && (
              <path
                d={LEAF_LEFT_PATH}
                fill="#6cc070"
                stroke="#3a2a20"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {grow === 3 && (
              <g>
                <path
                  d="M150 86 C 136 84, 134 64, 150 54 C 166 64, 164 84, 150 86 Z"
                  fill="#c9b6f2"
                  stroke="#3a2a20"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M142 84 Q 150 76 158 84"
                  fill="none"
                  stroke="#6cc070"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            )}

            {grow === 4 && (
              <g>
                <ellipse
                  cx="150"
                  cy="52"
                  rx="11"
                  ry="16"
                  fill="#f1ebff"
                  stroke="#3a2a20"
                  strokeWidth="4.5"
                />
                <ellipse
                  cx="168"
                  cy="64"
                  rx="11"
                  ry="16"
                  transform="rotate(72 168 64)"
                  fill="#f1ebff"
                  stroke="#3a2a20"
                  strokeWidth="4.5"
                />
                <ellipse
                  cx="161"
                  cy="84"
                  rx="11"
                  ry="16"
                  transform="rotate(144 161 84)"
                  fill="#f1ebff"
                  stroke="#3a2a20"
                  strokeWidth="4.5"
                />
                <ellipse
                  cx="139"
                  cy="84"
                  rx="11"
                  ry="16"
                  transform="rotate(216 139 84)"
                  fill="#f1ebff"
                  stroke="#3a2a20"
                  strokeWidth="4.5"
                />
                <ellipse
                  cx="132"
                  cy="64"
                  rx="11"
                  ry="16"
                  transform="rotate(288 132 64)"
                  fill="#f1ebff"
                  stroke="#3a2a20"
                  strokeWidth="4.5"
                />
                <circle
                  cx="150"
                  cy="69"
                  r="10.5"
                  fill="#ffd23f"
                  stroke="#3a2a20"
                  strokeWidth="4.5"
                />
              </g>
            )}
          </g>
        )}

        {/* 눈 깜빡임 / 취침 눈꺼풀 (원본 Eyelids 좌표 (111, 240), (181, 239), 살색 #e0ba7e) */}
        {showEyelids && (
          <g data-testid="mascot-eyelids">
            <ellipse cx="111" cy="240" rx="13" ry="14" fill="#e0ba7e" />
            <ellipse cx="181" cy="239" rx="13" ry="14" fill="#e0ba7e" />
            <path
              d="M100 241 Q 111 249 122 241"
              fill="none"
              stroke="#3a2a20"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
            <path
              d="M170 240 Q 181 248 192 240"
              fill="none"
              stroke="#3a2a20"
              strokeWidth="4.8"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 밤 취침 중 머리 옆 '쿨쿨' 애니메이션 */}
        {isSleeping && (
          <g data-testid="mascot-sleep-bubble">
            <text
              x="228"
              y="148"
              fill="#FFFDF7"
              stroke="#3a2a20"
              strokeWidth="5"
              paintOrder="stroke"
              fontSize="24"
              className="font-display sleep-z-1"
            >
              쿨
            </text>
            <text
              x="252"
              y="118"
              fill="#FFE9A3"
              stroke="#3a2a20"
              strokeWidth="4.5"
              paintOrder="stroke"
              fontSize="20"
              className="font-display sleep-z-2"
            >
              쿨
            </text>
          </g>
        )}

        {/* 비 올 때 감자 위로 씌워지는 손그림 우산 */}
        {umbrella && (
          <g data-testid="mascot-umbrella" transform="translate(0, -10)">
            {/* 우산 손잡이 대 */}
            <path
              d="M150 56 V 132"
              stroke="#3a2a20"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M150 38 V 52"
              stroke="#3a2a20"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* 우산 천 왼쪽/오른쪽 배색 */}
            <path
              d="M52 114 C 66 56, 108 42, 150 42 C 192 42, 234 56, 248 114 C 232 104, 212 104, 198 114 C 184 104, 164 104, 150 114 C 136 104, 116 104, 102 114 C 88 104, 68 104, 52 114 Z"
              fill="#FFE596"
              stroke="#3a2a20"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />
            {/* 우산 중앙 포인트 면 */}
            <path
              d="M102 114 C 110 66, 128 44, 150 42 C 172 44, 190 66, 198 114 C 184 104, 164 104, 150 114 C 136 104, 116 104, 102 114 Z"
              fill="#BCE3C5"
              stroke="#3a2a20"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* 우산 꼭지 */}
            <circle
              cx="150"
              cy="37"
              r="5.5"
              fill="#E8A27A"
              stroke="#3a2a20"
              strokeWidth="4"
            />
          </g>
        )}

        {/* 물·햇빛·거름 클릭 시 잠깐 뜨는 손그림 이펙트 */}
        {effect && (
          <g
            key={`${effect}-${effectKey}`}
            className="care-burst-anim"
            data-testid="mascot-care-effect"
          >
            {effect === 'water' && (
              <>
                <path
                  d="M66 146 C 58 160, 58 172, 66 172 C 74 172, 74 160, 66 146 Z"
                  fill="#8FD1FA"
                  stroke="#3a2a20"
                  strokeWidth="4"
                />
                <path
                  d="M238 156 C 230 168, 230 179, 238 179 C 246 179, 246 168, 238 156 Z"
                  fill="#8FD1FA"
                  stroke="#3a2a20"
                  strokeWidth="4"
                />
                <path
                  d="M220 112 C 214 121, 214 130, 220 130 C 226 130, 226 121, 220 112 Z"
                  fill="#BCE4FC"
                  stroke="#3a2a20"
                  strokeWidth="3.5"
                />
              </>
            )}
            {effect === 'sun' && (
              <g stroke="#3a2a20" strokeWidth="4" strokeLinecap="round">
                <circle cx="72" cy="134" r="14" fill="#FFE07D" />
                <line x1="72" y1="108" x2="72" y2="114" />
                <line x1="72" y1="154" x2="72" y2="160" />
                <line x1="46" y1="134" x2="52" y2="134" />
                <line x1="92" y1="134" x2="98" y2="134" />
                <circle cx="234" cy="144" r="10" fill="#FFE89E" />
              </g>
            )}
            {effect === 'fertilizer' && (
              <g stroke="#3a2a20" strokeWidth="3.5" strokeLinejoin="round">
                <path
                  d="M68 122 L 73 135 L 86 140 L 73 145 L 68 158 L 63 145 L 50 140 L 63 135 Z"
                  fill="#9BE09E"
                />
                <path
                  d="M234 118 L 238 129 L 249 133 L 238 137 L 234 148 L 230 137 L 219 133 L 230 129 Z"
                  fill="#D6C6F7"
                />
                <circle cx="212" cy="176" r="6" fill="#FFD23F" />
              </g>
            )}
          </g>
        )}
      </svg>
    </span>
  );

  if (interactive) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${MOOD_KO_LABEL[mood]} 쓰다듬기`}
        className="inline-flex items-center justify-center rounded-3xl p-1 cursor-pointer transition-transform active:scale-x-105 active:scale-y-90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3d7d47] focus-visible:ring-offset-2"
      >
        {visualContent}
      </button>
    );
  }

  return visualContent;
}
