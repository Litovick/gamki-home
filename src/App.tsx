import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CoreFeaturesSection } from './components/CoreFeaturesSection';
import { CareerLinkSection } from './components/CareerLinkSection';
import { EvolutionSection } from './components/EvolutionSection';
import { ProjectInfoSection } from './components/ProjectInfoSection';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#3A2A20]">
      <Navbar />

      <main>
        <HeroSection />
        <CoreFeaturesSection />
        <CareerLinkSection />
        <EvolutionSection />
        <ProjectInfoSection />
      </main>
    </div>
  );
}
