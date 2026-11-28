import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

interface MalangPotatoViewProps {
  onGoHome: () => void;
}

const LINES = [
  '으앗, 말랑!',
  '헤헤 간지러워',
  '나 말랑하지?',
  '한 번 더!',
  '진로 걱정은 나한테 꾹!',
  '스트레스 다 가져갈게',
  '쫀득쫀득',
  '춘천 감자는 원래 말랑해',
] as const;

const LOTS: Record<number, string> = {
  10: '그만 만져~ 녹는다고!',
  20: '너 진짜 스트레스 많구나…',
  30: '이 정도면 우리 찐친이야',
  50: '말랑 장인 인정!',
};

const HOLD = ['으으읍…', '납작해진다…', '숨 막혀!'] as const;

export function MalangPotatoView({ onGoHome }: MalangPotatoViewProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const btn = root.querySelector<HTMLButtonElement>('.gsq-btn');
    const body = root.querySelector<SVGGElement>('.gsq-body');
    const face = root.querySelector<SVGGElement>('.gsq-face');
    const shadow = root.querySelector<SVGEllipseElement>('.gsq-shadow');
    const cheeks = root.querySelectorAll<SVGEllipseElement>('.gsq-cheek');
    const open = root.querySelector<SVGGElement>('.gsq-eyes-open');
    const shut = root.querySelector<SVGGElement>('.gsq-eyes-shut');
    const blinkG = root.querySelector<SVGGElement>('.gsq-eyes-blink');
    const mouth = root.querySelector<SVGPathElement>('.gsq-mouth');
    const say = root.querySelector<HTMLParagraphElement>('.gsq-say');
    const stage = root.querySelector<HTMLDivElement>('.gsq-stage');
    const svg = btn?.querySelector<SVGSVGElement>('svg') ?? null;

    if (
      !btn ||
      !body ||
      !face ||
      !shadow ||
      !open ||
      !shut ||
      !blinkG ||
      !mouth ||
      !say ||
      !stage ||
      !svg
    ) {
      return;
    }

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 스프링: 값마다 [지금, 속도, 목표]
    // sx·sy: 누를 때 납작해지는 정도, px·py: 끌어당긴 방향과 거리(그림 좌표), fx·fy: 얼굴이 늦게 따라오는 정도
    const S: Record<string, [number, number, number]> = {
      sx: [1, 0, 1],
      sy: [1, 0, 1],
      px: [0, 0, 0],
      py: [0, 0, 0],
      fx: [0, 0, 0],
      fy: [0, 0, 0],
    };

    const STIFF = calm ? 300 : 210;
    const DAMP = calm ? 30 : 11;
    let pressed = false;
    let pressAt = 0;
    let start: { x: number; y: number } | null = null;
    let count = 0;
    let blush = 0;
    let sayTimer = 0;
    let lastHold = -1;
    let rafId = 0;
    let activeMove: ((ev: PointerEvent) => void) | null = null;
    let activeUp: (() => void) | null = null;
    const popTimers = new Set<number>();

    const speak = (text: string, ms = 1500) => {
      say.textContent = text;
      say.classList.add('on');
      window.clearTimeout(sayTimer);
      sayTimer = window.setTimeout(() => say.classList.remove('on'), ms);
    };

    const pop = (text: string, x: number, y: number) => {
      if (calm) return;
      const el = document.createElement('span');
      el.className = 'gsq-pop';
      el.textContent = text;
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      stage.appendChild(el);
      const t = window.setTimeout(() => {
        el.remove();
        popTimers.delete(t);
      }, 950);
      popTimers.add(t);
    };

    const setFace = (squeeze: boolean) => {
      open.style.display = squeeze ? 'none' : '';
      shut.style.display = squeeze ? '' : 'none';
      blinkG.style.display = 'none';
      mouth.setAttribute(
        'd',
        squeeze
          ? 'M140 258 Q149 250 158 258 Q149 266 140 258 Z'
          : 'M138 254 Q149 263 160 254'
      );
      mouth.setAttribute('fill', squeeze ? '#7a2f22' : 'none');
    };

    const toSvg = (e: PointerEvent) => {
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 150, y: 240 };
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const q = pt.matrixTransform(ctm.inverse());
      return { x: q.x, y: q.y };
    };

    const down = (e: PointerEvent | null) => {
      pressed = true;
      pressAt = performance.now();
      lastHold = -1;
      // 잡은 곳(그림 좌표). 끌면 이 점이 마우스·손가락을 따라간다
      start = e ? toSvg(e) : null;
      S.sx[2] = 1.16;
      S.sy[2] = 0.8;
      S.sy[1] -= 2.5;
      setFace(true);
      pop('말랑', 30 + Math.random() * 40, 38 + Math.random() * 10);
    };

    const move = (e: PointerEvent) => {
      if (!pressed || !start) return;
      // 잡은 곳이 마우스(손가락)를 따라간다 = 끄는 쪽으로 쭉 늘어난다
      const q = toSvg(e);
      let dx = q.x - start.x;
      let dy = q.y - start.y;
      if (dy > 0) dy *= 0.5; // 아래는 바닥이라 조금만
      const MAX = 150;
      const len = Math.hypot(dx, dy);
      if (len > MAX) {
        dx *= MAX / len;
        dy *= MAX / len;
      }
      S.px[2] = dx;
      S.py[2] = dy;
      // 당기기 시작하면 눌린 납작함은 풀린다
      const f = Math.min(1, len / 40);
      S.sy[2] = 0.8 + 0.2 * f;
      S.sx[2] = 1.16 - 0.16 * f;
    };

    const up = () => {
      if (!pressed) return;
      pressed = false;
      count += 1;
      blush = Math.min(1, blush + 0.16);
      // 놓으면 띠용: 목표는 제자리, 반대 방향으로 힘을 준다
      S.sy[1] += (1 - S.sy[0]) * 9;
      S.sx[1] += (1 - S.sx[0]) * 9;
      S.sx[2] = 1;
      S.sy[2] = 1;
      S.px[2] = 0;
      S.py[2] = 0;
      S.fy[1] -= 140;
      setFace(false);
      pop(
        ['뽀잉!', '띠용!', '말랑!'][count % 3],
        50 + (Math.random() - 0.5) * 50,
        30
      );
      speak(
        LOTS[count] ?? LINES[(count - 1) % LINES.length],
        LOTS[count] ? 2200 : 1400
      );
    };

    const detachWindowDragListeners = () => {
      if (activeMove) {
        window.removeEventListener('pointermove', activeMove);
        activeMove = null;
      }
      if (activeUp) {
        window.removeEventListener('pointerup', activeUp);
        window.removeEventListener('pointercancel', activeUp);
        activeUp = null;
      }
    };

    // 끄는 동안은 창 전체에서 마우스를 따라간다 (감자 밖으로 나가도, 포인터 캡처가 풀려도 끊기지 않게)
    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      detachWindowDragListeners();
      down(e);

      activeMove = (ev: PointerEvent) => move(ev);
      activeUp = () => {
        detachWindowDragListeners();
        up();
      };
      window.addEventListener('pointermove', activeMove);
      window.addEventListener('pointerup', activeUp);
      window.addEventListener('pointercancel', activeUp);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
        e.preventDefault();
        down(null);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        up();
      }
    };

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
    };

    btn.addEventListener('pointerdown', onPointerDown);
    btn.addEventListener('keydown', onKeyDown);
    btn.addEventListener('keyup', onKeyUp);
    btn.addEventListener('click', onClick);

    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - prev) / 1000);
      prev = now;

      // 오래 누르면 조금씩 더 납작해진다
      if (pressed) {
        const held = (now - pressAt) / 1000;
        if (Math.hypot(S.px[2], S.py[2]) < 20) {
          const deep = Math.min(0.14, held * 0.07);
          if (S.sy[2] <= 0.82) {
            S.sy[2] = 0.8 - deep;
            S.sx[2] = 1.16 + deep * 0.9;
          }
        }
        const step = Math.floor(held / 1.2) - 1;
        if (step >= 0 && step !== lastHold && step < HOLD.length) {
          lastHold = step;
          speak(HOLD[step], 1300);
        }
      } else {
        blush = Math.max(0, blush - dt * 0.05);
      }

      // 얼굴은 몸의 기울기·출렁임을 조금 늦게 따라간다
      S.fx[2] = S.px[0] * 0.12;
      S.fy[2] = (1 - S.sy[0]) * 30 + S.py[0] * 0.12;

      for (const key in S) {
        const v = S[key];
        const stiff = key[0] === 'f' ? STIFF * 0.6 : STIFF;
        // 늘어난 건 놓으면 반대쪽으로 튕겨 늘어나지 않게 거의 바로 멈춘다 (출렁임은 납작·통통으로만)
        const damp = key[0] === 'p' ? 2 * Math.sqrt(stiff) * 0.9 : DAMP;
        const acc = stiff * (v[2] - v[0]) - damp * v[1];
        v[1] += acc * dt;
        v[0] += v[1] * dt;
      }

      const breathe = pressed || calm ? 0 : Math.sin(now / 700) * 0.012;
      const sx = S.sx[0] - breathe * 0.6;
      const sy = S.sy[0] + breathe;

      // 발바닥(아래 가운데, 150 330)을 붙인 채 찌그러뜨린다
      const squash = `translate(150 330) scale(${sx} ${sy}) translate(-150 -330)`;

      // 끄는 쪽으로 늘이기: 발은 바닥(150, 330)에 붙인 채, 머리 꼭대기가 끈 만큼(d) 따라간다.
      // 위로 끌면 길쭉(h↑), 옆으로 끌면 그쪽으로 휘어 늘어나고, 길어진 만큼 옆으로 홀쭉해진다
      const len = Math.hypot(S.px[0], S.py[0]);
      let pull = '';
      let wide = 1;
      if (len > 0.5) {
        const H = 202; // 발바닥(330)에서 머리 꼭대기(128)까지
        const h = Math.max(0.65, Math.min(1.9, 1 - S.py[0] / H));
        const lean = (S.px[0] / H) * 0.7; // 옆으로는 조금 덜 (상자 밖으로 넘어가지 않게)
        const reach = Math.hypot(lean, h); // 발→머리가 얼마나 길어졌나
        const thin = 1 / Math.sqrt(Math.max(0.65, reach));
        // 발 기준 좌표에서 x' = thin·x − lean·y', y' = h·y  (y는 위가 음수)
        pull = `translate(150 330) matrix(${thin} 0 ${-lean} ${h} 0 0) translate(-150 -330) `;
        wide = thin;
      }

      body.setAttribute('transform', pull + squash);
      face.setAttribute('transform', `translate(${S.fx[0]} ${S.fy[0] * 0.3})`);
      shadow.setAttribute('transform', `scale(${sx * 1.02 * wide} 1)`);

      const b = 0.32 + blush * 0.55 + (pressed ? 0.15 : 0);
      cheeks.forEach((c) => c.setAttribute('opacity', b.toFixed(3)));

      // 가끔 깜빡
      if (!pressed) {
        const blink = now % 3900 < 120;
        open.style.display = blink ? 'none' : '';
        blinkG.style.display = blink ? '' : 'none';
        shut.style.display = 'none';
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      detachWindowDragListeners();
      btn.removeEventListener('pointerdown', onPointerDown);
      btn.removeEventListener('keydown', onKeyDown);
      btn.removeEventListener('keyup', onKeyUp);
      btn.removeEventListener('click', onClick);
      window.clearTimeout(sayTimer);
      popTimers.forEach((t) => window.clearTimeout(t));
      popTimers.clear();
      stage.querySelectorAll('.gsq-pop').forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      data-testid="malang-page"
      className="min-h-screen bg-[#efe5d0] text-[#2e1d14] flex flex-col"
    >
      {/* 상단 고정 미니 헤더 (퀴즈 페이지와 동일 스타일) */}
      <header className="sticky top-0 z-40 bg-[#FFFDF7]/94 backdrop-blur-md border-b-2 border-[#3A2A20]/15">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6EC] hover:bg-[#EFE7D5] border-2 border-[#3A2A20]/30 hover:border-[#3A2A20] text-sm font-display text-[#3A2A20] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>홈으로 돌아가기</span>
          </button>

          <span className="font-display text-base sm:text-lg text-[#3D7D47] truncate">
            말랑 감자
          </span>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-8 sm:py-12 grid place-items-center">
        <section
          ref={rootRef}
          className="gsq w-full max-w-[520px] border-2 border-[#3A2A20] shadow-[0_6px_0_#3A2A20]"
          aria-label="말랑 감자 장난감"
        >
          <h2 className="gsq-title">말랑 감자, 만져 보고 가세요</h2>
          <p className="gsq-lead">꾹 누르고, 쭉 늘리고, 놓아 보세요</p>

          <div className="gsq-stage">
            <p className="gsq-say" aria-live="polite" />
            <button
              type="button"
              data-testid="malang-squish-btn"
              className="gsq-btn"
              aria-label="말랑 감자 누르기 (스페이스나 엔터로도 누를 수 있어요)"
            >
              <svg viewBox="0 0 300 348" aria-hidden="true">
                <defs>
                  <radialGradient id="gsq-skin" cx="42%" cy="34%" r="75%">
                    <stop offset="0" stopColor="#ecc68d" />
                    <stop offset="0.7" stopColor="#ddb072" />
                    <stop offset="1" stopColor="#cf9c5e" />
                  </radialGradient>
                </defs>

                <ellipse
                  className="gsq-shadow"
                  cx="150"
                  cy="334"
                  rx="96"
                  ry="10"
                  fill="#3a2a20"
                  opacity="0.14"
                />

                <g className="gsq-body">
                  {/* 머리 위 털 두 가닥 */}
                  <g
                    className="gsq-hair"
                    stroke="#e0b27a"
                    strokeWidth="11"
                    strokeLinecap="round"
                  >
                    <path d="M56 112 L70 128" />
                    <path d="M78 96 L86 114" />
                  </g>

                  {/* 팔·발 */}
                  <g stroke="#2e1d14" strokeWidth="10" strokeLinecap="round">
                    <path className="gsq-arm-l" d="M26 262 L42 262" />
                    <path className="gsq-arm-r" d="M260 262 L276 262" />
                    <path d="M104 312 L100 330" />
                    <path d="M196 312 L200 330" />
                  </g>

                  {/* 몸 */}
                  <path
                    className="gsq-skin"
                    d="M150 128 C 222 128, 264 190, 264 254 C 264 300, 216 320, 150 320 C 84 320, 36 300, 36 254 C 36 190, 78 128, 150 128 Z"
                    fill="url(#gsq-skin)"
                    stroke="#2e1d14"
                    strokeWidth="9"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M92 168 C 104 152, 124 144, 142 142"
                    fill="none"
                    stroke="#fff6e2"
                    strokeWidth="7"
                    strokeLinecap="round"
                    opacity="0.55"
                  />

                  {/* 얼굴 (몸보다 살짝 늦게 따라와서 출렁인다) */}
                  <g className="gsq-face">
                    <ellipse
                      className="gsq-cheek"
                      cx="94"
                      cy="256"
                      rx="22"
                      ry="13"
                      fill="#e2785e"
                    />
                    <ellipse
                      className="gsq-cheek"
                      cx="204"
                      cy="256"
                      rx="22"
                      ry="13"
                      fill="#e2785e"
                    />
                    <g className="gsq-eyes-open" fill="#2e1d14">
                      <ellipse cx="114" cy="238" rx="7.5" ry="10" />
                      <ellipse cx="184" cy="238" rx="7.5" ry="10" />
                    </g>
                    <g
                      className="gsq-eyes-shut"
                      fill="none"
                      stroke="#2e1d14"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ display: 'none' }}
                    >
                      <path d="M104 230 L118 238 L104 246" />
                      <path d="M194 230 L180 238 L194 246" />
                    </g>
                    <g
                      className="gsq-eyes-blink"
                      fill="none"
                      stroke="#2e1d14"
                      strokeWidth="5"
                      strokeLinecap="round"
                      style={{ display: 'none' }}
                    >
                      <path d="M106 239 Q114 245 122 239" />
                      <path d="M176 239 Q184 245 192 239" />
                    </g>
                    <path
                      className="gsq-mouth"
                      d="M138 254 Q149 263 160 254"
                      fill="none"
                      stroke="#2e1d14"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* 감자 점 */}
                  <ellipse
                    cx="232"
                    cy="262"
                    rx="6.5"
                    ry="9.5"
                    fill="#6e4127"
                    transform="rotate(18 232 262)"
                  />
                  <ellipse
                    cx="214"
                    cy="290"
                    rx="6"
                    ry="8.5"
                    fill="#6e4127"
                    transform="rotate(28 214 290)"
                  />
                </g>
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
