import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { Reveal } from './Reveal';
import { APP_LIVE_URL } from '../utils/potatoLogic';
import { getRevealDelay } from '../utils/revealLogic';

const TEAM_MEMBERS = [
  { studentId: '20222594', major: '디지털미디어콘텐츠', name: '황도영' },
  { studentId: '20221043', major: '철학전공', name: '백승우' },
  { studentId: '20252517', major: '디지털미디어콘텐츠', name: '김서연' },
  { studentId: '20266638', major: '미래융합스쿨', name: '정세영' },
  { studentId: '20269110', major: '자율전공학부', name: '김서진' },
] as const;

function SproutPotatoBadge() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="w-12 h-12 shrink-0"
    >
      <path
        d="M48 32 C66 32 82 48 84 65 C85 78 74 88 52 88 C30 88 17 83 17 67 C17 48 30 32 48 32 Z"
        fill="#CFA75C"
        stroke="#111111"
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx="73"
        cy="69"
        rx="3.2"
        ry="4.5"
        transform="rotate(28 73 69)"
        fill="#111111"
      />
      <ellipse
        cx="64"
        cy="77"
        rx="2.6"
        ry="3.8"
        transform="rotate(38 64 77)"
        fill="#111111"
      />
      <path
        d="M50 32 C50 25 50 22 50 18"
        stroke="#628E4C"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 19 C44 11 33 10 32 17 C31 23 42 24 50 19 Z"
        fill="#C6EA9F"
        stroke="#628E4C"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M50 19 C56 11 67 10 68 17 C69 23 58 24 50 19 Z"
        fill="#C6EA9F"
        stroke="#628E4C"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProjectInfoSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(APP_LIVE_URL);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // 클립보드 권한 제한 시 무시
    }
  };

  return (
    <>
      <section
        id="project"
        className="scroll-mt-16 py-20 sm:py-24 bg-[#F5F7F0] border-t-2 border-[#3A2A20]/10"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-14">
          {/* 섹션 헤더 */}
          <Reveal className="max-w-2xl space-y-3">
            <p className="text-sm font-medium text-[#3D7D47]">프로젝트 안내</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
              프로젝트 정보
            </h2>
            <p className="text-base text-[#1F1712] leading-relaxed">
              감자 키우기 앱의 기획 배경, 함께 만든 팀원, 그리고 앱 바로가기
              정보를 확인해 보세요.
            </p>
          </Reveal>

          {/* [1] 01 · 개요 / 프로젝트 개요 — 가로로 긴 인용구 노트 카드 */}
          <Reveal delayMs={getRevealDelay(0)}>
            <article className="w-full rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-6 py-7 sm:px-10 sm:py-8 shadow-[0_5px_0_#3A2A20]">
              <div className="text-xs font-medium text-[#3D7D47] mb-1">
                01 · 개요
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#3A2A20] mb-5">
                프로젝트 개요
              </h3>

              <blockquote className="m-0 border-l-4 border-[#8BCF72] pl-5 sm:pl-6 text-left">
                <p className="text-base sm:text-lg text-[#1F1712] leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="font-serif font-bold text-2xl sm:text-3xl text-[#7BC265] leading-none align-top mr-1 select-none"
                  >
                    “
                  </span>
                  춘천 대학생은 "춘천에는 할 게 없다"며 전공 경험을 미루기
                  쉽습니다. 감자 키우기는 춘천·온라인 기회와 학년별 할 일을 보여
                  주고, 기회를 보고 기록하는 일을 "감자 돌보기"로 바꾼
                  디자인씽킹 조별 과제입니다.
                  <span
                    aria-hidden="true"
                    className="font-serif font-bold text-2xl sm:text-3xl text-[#7BC265] leading-none align-bottom ml-1 select-none"
                  >
                    ”
                  </span>
                </p>
              </blockquote>
            </article>
          </Reveal>

          {/* [2] 02 · 만든 사람들 / 팀원 소개 — 감자밭 이름표 5열 카드 */}
          <div className="space-y-5">
            <Reveal delayMs={getRevealDelay(0)}>
              <div className="text-xs font-medium text-[#3D7D47] mb-1">
                02 · 만든 사람들
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-[#3A2A20]">
                팀원 소개
              </h3>
            </Reveal>

            <ul
              aria-label="팀원 이름표 목록"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5 items-stretch"
            >
              {TEAM_MEMBERS.map((member, index) => (
                <li key={member.studentId} className="flex">
                  <Reveal
                    delayMs={getRevealDelay(index)}
                    className="flex w-full h-full"
                  >
                    <article
                      data-testid="team-member-card"
                      className="w-full h-full rounded-[22px] bg-[#FFFDF7] border-2 border-[#3A2A20] px-3.5 pt-4 pb-5 sm:px-4 sm:pt-5 sm:pb-6 shadow-[0_4px_0_#3A2A20] flex flex-col items-center text-center"
                    >
                      {/* 감자밭 이름표 상단 구멍 포인트 */}
                      <span
                        aria-hidden="true"
                        className="w-2.5 h-2.5 rounded-full bg-[#E9F3DF] border border-[#3A2A20]/35 mb-2.5 shrink-0"
                      />

                      {/* 48x48 새싹 감자 인라인 SVG */}
                      <div className="mb-2.5 flex items-center justify-center">
                        <SproutPotatoBadge />
                      </div>

                      {/* 이름 */}
                      <h4 className="font-display text-xl sm:text-2xl text-[#3A2A20] leading-tight">
                        {member.name}
                      </h4>

                      {/* 전공명 (긴 전공명이어도 전체 카드 높이 동일 유지) */}
                      <p className="mt-1.5 mb-3 text-xs sm:text-sm text-[#1F1712] leading-snug flex-1 flex items-center justify-center">
                        {member.major}
                      </p>

                      {/* 학번 */}
                      <div className="mt-auto pt-2.5 w-full border-t border-dashed border-[#3A2A20]/18 text-xs text-[#6B584B] tabular-nums">
                        {member.studentId}
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          {/* [3] 03 · 체험 연결 / 실제 앱 바로가기 — 중앙 콤팩트 카드 */}
          <Reveal delayMs={getRevealDelay(1)} className="flex justify-center">
            <article
              data-testid="compact-app-card"
              className="w-full max-w-[300px] rounded-[22px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-4 sm:p-5 shadow-[0_4px_0_#3A2A20] flex flex-col items-center text-center"
            >
              <div className="text-xs font-medium text-[#3D7D47] mb-0.5">
                03 · 체험 연결
              </div>
              <h3 className="font-display text-xl text-[#3A2A20] mb-3">
                실제 앱 바로가기
              </h3>

              <div className="w-full rounded-xl bg-[#FAF8F2] border border-[#3A2A20]/15 p-3 flex flex-col items-center text-center gap-2">
                <div
                  className="p-2 rounded-xl bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_2px_0_#3A2A20]"
                  data-testid="app-qr-code"
                >
                  <QRCodeSVG
                    value={APP_LIVE_URL}
                    size={92}
                    bgColor="#FFFDF7"
                    fgColor="#3A2A20"
                    level="M"
                    title="감자 키우기 앱 바로가기 QR 코드"
                  />
                </div>

                <p className="text-xs text-[#332720] leading-snug">
                  휴대전화 카메라로 스캔하면 바로 열려요
                </p>

                <div className="w-full flex items-center justify-between gap-1.5 rounded-lg bg-[#FFFDF7] border border-[#3A2A20]/20 px-2.5 py-1.5">
                  <a
                    href={APP_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#3D7D47] hover:text-[#2D6135] underline underline-offset-2 truncate"
                  >
                    {APP_LIVE_URL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="앱 주소 복사"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F4EFE4] hover:bg-[#EAE1CE] text-[#3A2A20] text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-[#3D7D47]" />
                        <span>복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <a
                href={APP_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-sm border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
              >
                <span>앱 바로가기</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </article>
          </Reveal>
        </div>
      </section>

      {/* [4] 푸터 */}
      <footer className="bg-[#FFFDF7] border-t-2 border-[#3A2A20]/15 py-9">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="font-display text-lg text-[#3A2A20]">
            감자 키우기 · 프로젝트 홈페이지
          </div>
          <div className="text-xs sm:text-sm text-[#332720] leading-relaxed text-center sm:text-right">
            <p>개발 : Claude Code, GitHub, Vercel, Xcode, Google AI Studio</p>
            <p>기획 : Figma</p>
          </div>
        </div>
      </footer>
    </>
  );
}
