import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Reveal } from './Reveal';

export const INTRO_VIDEO_SRC = '/gamki%20video.mp4';

export function IntroVideoSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVideoFrame, setHasVideoFrame] = useState(false);
  const [videoLoadFailed, setVideoLoadFailed] = useState(false);

  const handlePlayFromStart = () => {
    const video = videoRef.current;
    setIsPlaying(true);

    if (!video) return;

    try {
      video.currentTime = 0;
    } catch {
      // 메타데이터 로드 전 currentTime 설정 예외 무시
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {
        // 브라우저 정책이나 파일 미존재로 재생 실패 시 에러 없이 유지
      });
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      try {
        video.currentTime = 0;
      } catch {
        // 무시
      }
    }
  };

  return (
    <section
      id="intro-video"
      aria-label="감자 키우기 40초 소개 영상"
      className="py-14 sm:py-20 bg-[#FAF8F2] border-t-2 border-[#3A2A20]/10"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal className="max-w-2xl space-y-2.5 mb-7 sm:mb-9">
          <p className="text-sm font-medium text-[#3D7D47]">
            00 · 40초 미리보기
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#3A2A20]">
            감자 키우기, 40초로 먼저 만나보기
          </h2>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="rounded-[28px] bg-[#FFFDF7] border-2 border-[#3A2A20] p-3 sm:p-5 shadow-[0_6px_0_#3A2A20]">
            <div
              data-testid="intro-video-player-frame"
              className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#3A2A20]/20 bg-[#F7F1E3]"
            >
              <video
                ref={videoRef}
                src={INTRO_VIDEO_SRC}
                playsInline
                preload="metadata"
                controls={isPlaying}
                onLoadedData={() => {
                  setHasVideoFrame(true);
                  setVideoLoadFailed(false);
                }}
                onError={() => {
                  setHasVideoFrame(false);
                  setVideoLoadFailed(true);
                }}
                onEnded={handleVideoEnded}
                className={`w-full h-full object-contain bg-[#F7F1E3] transition-opacity duration-200 ${
                  hasVideoFrame || isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* 초기 및 재생 종료 후 표시되는 커스텀 재생 버튼 오버레이 */}
              {!isPlaying && (
                <button
                  type="button"
                  data-testid="intro-video-play-overlay"
                  onClick={handlePlayFromStart}
                  aria-label="40초 소개 영상 재생"
                  className={`group absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3.5 sm:gap-4 px-4 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-[#3D7D47] ${
                    hasVideoFrame
                      ? 'bg-[#FFFDF7]/50 hover:bg-[#FFFDF7]/35 backdrop-blur-[2px]'
                      : 'bg-gradient-to-b from-[#FAF5E8] via-[#F7F1E3] to-[#F1E8D4] hover:from-[#F6F0E1] hover:to-[#ECE1C9]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#3D7D47] group-hover:bg-[#32693B] group-hover:scale-105 group-active:scale-95 text-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_5px_0_#3A2A20] flex items-center justify-center transition-all duration-150"
                  >
                    <Play
                      className="w-7 h-7 sm:w-9 sm:h-9 fill-current translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>

                  <span className="inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#FFFDF7] border-2 border-[#3A2A20] shadow-[0_3px_0_#3A2A20] font-display text-sm sm:text-base text-[#3A2A20] whitespace-nowrap">
                    40초 소개 영상 재생
                  </span>
                </button>
              )}

              {/* 영상 파일 미업로드 상태에서 재생 버튼 클릭 시 검은 화면 대신 따뜻한 안내 표시 */}
              {isPlaying && videoLoadFailed && (
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#F7F1E3]/95 px-4 text-center">
                  <p className="font-display text-base sm:text-lg text-[#3A2A20]">
                    소개 영상을 불러오고 있어요
                  </p>
                  <p className="text-xs sm:text-sm text-[#332720]">
                    영상 파일(<code>/gamki video.mp4</code>)이 준비되면 바로
                    재생돼요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
