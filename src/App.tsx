import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { IntroVideoSection } from './components/IntroVideoSection';
import { CoreFeaturesSection } from './components/CoreFeaturesSection';
import { CareerLinkSection } from './components/CareerLinkSection';
import { EvolutionSection } from './components/EvolutionSection';
import { WidgetWatchSection } from './components/WidgetWatchSection';
import { QuizPromoBanner } from './components/QuizPromoBanner';
import { ProjectInfoSection } from './components/ProjectInfoSection';
import { PotatoQuizView } from './components/PotatoQuizView';
import { MalangPotatoView } from './components/MalangPotatoView';
import { applyCustomPotatoCursors } from './utils/customCursor';
import { PotatoTypeId, buildQuizHash } from './utils/potatoQuizLogic';
import {
  AppRouteState,
  MALANG_HASH,
  parseAppRoute,
} from './utils/malangLogic';
import {
  clearSavedPotatoType,
  readSavedPotatoType,
  savePotatoType,
} from './utils/potatoPropsSprite';

function readCurrentRoute(): AppRouteState {
  if (typeof window === 'undefined') {
    return { view: 'home' };
  }
  return parseAppRoute(window.location.hash, window.location.search);
}

export default function App() {
  const [route, setRoute] = useState<AppRouteState>(readCurrentRoute);
  const [savedPotatoType, setSavedPotatoType] = useState<PotatoTypeId | null>(
    () => readSavedPotatoType()
  );

  useEffect(() => applyCustomPotatoCursors(), []);

  useEffect(() => {
    const syncFromUrl = () => {
      const next = readCurrentRoute();
      setRoute(next);
      if (next.view === 'quiz' || next.view === 'malang') {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };

    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  const handleOpenQuiz = useCallback(() => {
    const nextHash = buildQuizHash(null);
    const cleanUrl = `${window.location.pathname}${nextHash}`;
    window.history.pushState(null, '', cleanUrl);
    setRoute({ view: 'quiz', resultType: null });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleOpenMalang = useCallback(() => {
    const cleanUrl = `${window.location.pathname}${MALANG_HASH}`;
    window.history.pushState(null, '', cleanUrl);
    setRoute({ view: 'malang' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleSyncResultRoute = useCallback((resultType: PotatoTypeId | null) => {
    const nextHash = buildQuizHash(resultType);
    const cleanUrl = `${window.location.pathname}${nextHash}`;
    window.history.replaceState(null, '', cleanUrl);
    setRoute({ view: 'quiz', resultType });
  }, []);

  const handleSavePotatoType = useCallback((resultType: PotatoTypeId) => {
    savePotatoType(resultType);
    setSavedPotatoType(resultType);
  }, []);

  const handleResetPotatoType = useCallback(() => {
    clearSavedPotatoType();
    setSavedPotatoType(null);
  }, []);

  const handleGoHome = useCallback(() => {
    window.history.pushState(null, '', window.location.pathname);
    setRoute({ view: 'home' });
    setSavedPotatoType(readSavedPotatoType());
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  if (route.view === 'quiz') {
    return (
      <PotatoQuizView
        initialResultType={route.resultType}
        onSyncResultRoute={handleSyncResultRoute}
        onResultSaved={handleSavePotatoType}
        onGoHome={handleGoHome}
      />
    );
  }

  if (route.view === 'malang') {
    return <MalangPotatoView onGoHome={handleGoHome} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#3A2A20]">
      <Navbar onOpenQuiz={handleOpenQuiz} />

      <main>
        <HeroSection
          savedPotatoType={savedPotatoType}
          onResetPotatoType={handleResetPotatoType}
          onOpenMalang={handleOpenMalang}
        />
        <IntroVideoSection />
        <CoreFeaturesSection />
        <CareerLinkSection />
        <EvolutionSection />
        <WidgetWatchSection />
        <QuizPromoBanner onStartQuiz={handleOpenQuiz} />
        <ProjectInfoSection />
      </main>
    </div>
  );
}
