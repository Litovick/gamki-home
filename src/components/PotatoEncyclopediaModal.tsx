import { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  POTATO_RESULTS,
  POTATO_TYPE_ORDER,
  PotatoTypeId,
} from '../utils/potatoQuizLogic';

interface PotatoEncyclopediaModalProps {
  open: boolean;
  currentTypeId?: PotatoTypeId | null;
  onClose: () => void;
}

export function PotatoEncyclopediaModal({
  open,
  currentTypeId,
  onClose,
}: PotatoEncyclopediaModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2A20]/55 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="potato-dex-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[86vh] overflow-y-auto rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_8px_0_#3A2A20] p-5 sm:p-7 quiz-step-in"
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#3A2A20]/15">
          <div>
            <p className="text-xs font-medium text-[#3D7D47]">
              춘천 캠퍼스 감자 도감
            </p>
            <h2
              id="potato-dex-title"
              className="font-display text-2xl sm:text-3xl text-[#3A2A20] mt-0.5"
            >
              5종 감자 도감
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="감자 도감 닫기"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border-2 border-[#3A2A20]/25 bg-[#FAF8F2] hover:bg-[#EFE8D8] text-[#3A2A20] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {POTATO_TYPE_ORDER.map((typeId) => {
            const profile = POTATO_RESULTS[typeId];
            const isMine = currentTypeId === typeId;

            return (
              <li
                key={typeId}
                className={`rounded-2xl border-2 p-3.5 sm:p-4 flex items-center gap-3.5 sm:gap-4 ${
                  isMine
                    ? 'bg-[#F2F9EB] border-[#3D7D47]'
                    : 'bg-[#FAF8F2] border-[#3A2A20]/18'
                }`}
              >
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#3A2A20]/20 flex items-center justify-center p-1.5 shrink-0"
                  style={{ backgroundColor: profile.stageBg }}
                >
                  <img
                    src={profile.imagePath}
                    alt={profile.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg sm:text-xl text-[#3A2A20]">
                      {profile.name}
                    </h3>
                    {isMine && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#3D7D47] text-[#FFFDF7] text-xs font-medium">
                        내 유형
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#1F1712] leading-snug">
                    {profile.oneLiner}
                  </p>
                  <p className="text-xs text-[#332720]">
                    환상의 팀플 파트너: {profile.partnerName}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#3A2A20] hover:bg-[#2A1E17] text-[#FFFDF7] font-display text-base border-2 border-[#3A2A20] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3D7D47]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
