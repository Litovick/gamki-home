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
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Reveal className="max-w-2xl space-y-3 mb-12">
            <p className="text-sm font-medium text-[#3D7D47]">프로젝트 안내</p>
            <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
              프로젝트 정보
            </h2>
            <p className="text-base text-[#5B493E] leading-relaxed">
              감자 키우기 앱의 기획 배경, 함께 만든 팀원, 그리고 앱 바로가기
              정보를 확인해 보세요.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 카드 1: 프로젝트 개요 */}
            <Reveal delayMs={getRevealDelay(0)} className="flex">
              <article className="w-full rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 shadow-[0_5px_0_#3A2A20] flex flex-col">
                <div className="text-xs font-medium text-[#3D7D47] mb-1">
                  01 · 개요
                </div>
                <h3 className="font-display text-2xl text-[#3A2A20] mb-4">
                  프로젝트 개요
                </h3>
                <div className="flex-1 rounded-2xl bg-[#FAF8F2] border-2 border-[#3A2A20]/15 p-5 min-h-[168px] flex items-center justify-center text-center">
                  <p className="text-sm text-[#5B493E] leading-relaxed">
                    춘천 대학생은 "춘천에는 할 게 없다"며 전공 경험을 미루기
                    쉽습니다. 감자 키우기는 춘천·온라인 기회와 학년별 할 일을
                    보여 주고, 기회를 보고 기록하는 일을 "감자 돌보기"로 바꾼
                    디자인씽킹 조별 과제입니다.
                  </p>
                </div>
              </article>
            </Reveal>

            {/* 카드 2: 팀원 소개 */}
            <Reveal delayMs={getRevealDelay(1)} className="flex">
              <article className="w-full rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 shadow-[0_5px_0_#3A2A20] flex flex-col">
                <div className="text-xs font-medium text-[#3D7D47] mb-1">
                  02 · 만든 사람들
                </div>
                <h3 className="font-display text-2xl text-[#3A2A20] mb-4">
                  팀원 소개
                </h3>
                <ul className="space-y-2">
                  {TEAM_MEMBERS.map((member) => (
                    <li
                      key={member.studentId}
                      className="rounded-xl bg-[#FAF8F2] border border-[#3A2A20]/15 px-3.5 py-2.5 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-xs text-[#6B584B] tabular-nums shrink-0">
                          {member.studentId}
                        </span>
                        <span className="text-xs sm:text-[13px] text-[#5B493E]">
                          {member.major}
                        </span>
                      </div>
                      <span className="font-display text-[15px] text-[#3A2A20] whitespace-nowrap shrink-0">
                        {member.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            {/* 카드 3: 실제 앱 바로가기 (실제 링크 + 스캔 가능한 QR 코드) */}
            <Reveal delayMs={getRevealDelay(2)} className="flex">
              <article className="w-full rounded-[24px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 shadow-[0_5px_0_#3A2A20] flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-[#3D7D47] mb-1">
                    03 · 체험 연결
                  </div>
                  <h3 className="font-display text-2xl text-[#3A2A20] mb-4">
                    실제 앱 바로가기
                  </h3>

                  <div className="rounded-2xl bg-[#FAF8F2] border-2 border-[#3A2A20]/15 p-4 flex flex-col items-center text-center gap-3">
                    <div
                      className="p-2.5 rounded-2xl bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20]"
                      data-testid="app-qr-code"
                    >
                      <QRCodeSVG
                        value={APP_LIVE_URL}
                        size={128}
                        bgColor="#FFFDF7"
                        fgColor="#3A2A20"
                        level="M"
                        title="감자 키우기 앱 바로가기 QR 코드"
                      />
                    </div>

                    <p className="text-xs text-[#6B584B]">
                      휴대전화 카메라로 스캔하면 바로 열려요
                    </p>

                    <div className="w-full flex items-center justify-between gap-2 rounded-xl bg-[#FFFDF7] border border-[#3A2A20]/20 px-3 py-2">
                      <a
                        href={APP_LIVE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-[13px] text-[#3D7D47] hover:text-[#2D6135] underline underline-offset-2 truncate"
                      >
                        {APP_LIVE_URL}
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        aria-label="앱 주소 복사"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F4EFE4] hover:bg-[#EAE1CE] text-[#3A2A20] text-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#3D7D47]" />
                            <span>복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href={APP_LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
                >
                  <span>앱 바로가기</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="bg-[#FFFDF7] border-t-2 border-[#3A2A20]/15 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="font-display text-lg text-[#3A2A20]">
            감자 키우기 · 프로젝트 홈페이지
          </div>
          <div className="text-sm text-[#6B584B] leading-relaxed text-center sm:text-right">
            <p>개발 : Claude Code, GitHub, Vercel, Xcode, Google AI Studio</p>
            <p>기획 : Figma</p>
          </div>
        </div>
      </footer>
    </>
  );
}
