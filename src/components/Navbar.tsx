import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { href: '#intro', label: '소개' },
  { href: '#core-features', label: '핵심 기능' },
  { href: '#career-link', label: '감자와 연결' },
  { href: '#evolution', label: '감자 변화' },
  { href: '#project', label: '프로젝트 정보' },
] as const;

interface NavbarProps {
  onOpenQuiz: () => void;
}

export function Navbar({ onOpenQuiz }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleQuizClick = () => {
    setMenuOpen(false);
    onOpenQuiz();
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#FFFDF7]/92 backdrop-blur-md border-b-2 border-[#3A2A20]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* 좌측 로고 */}
        <a
          href="#intro"
          className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 rounded-xl py-1 pr-1 sm:pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
        >
          <span className="inline-flex items-center justify-center w-9 h-10 shrink-0">
            <img
              src="/mascot/happy.webp"
              alt="감자 키우기 로고 아이콘"
              referrerPolicy="no-referrer"
              className="w-9 h-10 object-contain"
            />
          </span>
          <span className="font-display text-xl sm:text-2xl tracking-tight text-[#3A2A20]">
            감자 키우기
          </span>
        </a>

        {/* 우측 데스크톱 메뉴 + 감자 유형 테스트 알약 버튼 */}
        <div className="hidden md:flex items-center gap-5 lg:gap-7">
          <nav
            aria-label="주요 메뉴"
            className="flex items-center gap-5 lg:gap-7 text-[16.5px] text-[#1F1712]"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap shrink-0 py-1.5 border-b-2 border-transparent hover:border-[#3D7D47] hover:text-[#3A2A20] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] rounded-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleQuizClick}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#3D7D47] hover:bg-[#32693B] active:translate-y-0.5 text-[#FFFDF7] font-display text-sm border-2 border-[#3A2A20] shadow-[0_2px_0_#3A2A20] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-1"
          >
            나의 감자 유형은?
          </button>
        </div>

        {/* 모바일 우측: 짧은 알약 버튼 + 메뉴 버튼 */}
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleQuizClick}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#3D7D47] hover:bg-[#32693B] text-[#FFFDF7] font-display text-xs border-2 border-[#3A2A20] shadow-[0_2px_0_#3A2A20] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
          >
            감자 테스트
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-[#3A2A20]/20 bg-[#FFFDF7] text-[#3A2A20] hover:bg-[#F3EEE2] transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="모바일 주요 메뉴"
          className="md:hidden border-t border-[#3A2A20]/10 bg-[#FFFDF7] px-4 py-3 shadow-md"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleLinkClick}
                  className="block px-3 py-2.5 rounded-xl text-base text-[#3A2A20] hover:bg-[#EDF5E3] transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
