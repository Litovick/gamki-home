import { useEffect } from 'react';
import { Mascot } from './Mascot';

interface AppLinkModalProps {
  open: boolean;
  onClose: () => void;
}

export function AppLinkModal({ open, onClose }: AppLinkModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#3A2A20]/45 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-link-modal-title"
        className="w-full max-w-md rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-6 sm:p-7 shadow-[0_8px_0_#3A2A20] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-2">
          <Mascot mood="happy" grow={1} size={112} animate />
        </div>

        <h3
          id="app-link-modal-title"
          className="font-display text-2xl text-[#3A2A20] mb-2"
        >
          앱 링크 연결 예정이에요
        </h3>
        <p className="text-sm sm:text-base text-[#5B493E] leading-relaxed mb-6">
          실제 모바일 앱 배포 주소가 준비되면 이곳으로 바로 이어질 예정입니다.
          그전까지 홈페이지에서 감자 변화와 돌보기 기능을 먼저 체험해 보세요!
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 px-6 rounded-xl bg-[#3D7D47] hover:bg-[#32693B] text-[#FFFDF7] font-display text-base border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#3D7D47] focus-visible:ring-offset-2"
        >
          확인했어요
        </button>
      </div>
    </div>
  );
}
