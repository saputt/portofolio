import { useEffect, useRef } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { TechStackSection } from './components/sections/TechStackSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EventHighlightsSection } from './components/sections/EventHighlightsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ContactSection } from './components/sections/ContactSection';

export default function App() {
  const snapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const snap = snapRef.current;
    if (!snap) return;

    const slideElements = Array.from(snap.querySelectorAll('.slide')) as HTMLElement[];

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          slideElements.forEach((s) => s.classList.remove('on'));
          entry.target.classList.add('on');

          const target = entry.target as HTMLElement;
          document.body.classList.toggle('dk', target.dataset.dk === '1');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: snap,
      threshold: 0.55,
    });

    slideElements.forEach((slide) => observer.observe(slide));

    return () => {
      slideElements.forEach((slide) => observer.unobserve(slide));
    };
  }, []);

  const buildFlow = () => {
    const projects = document.getElementById('projects');
    if (!projects) return;

    // This is a placeholder for the flow arrow functionality
    // The original implementation was complex and would need a more sophisticated approach
    // For now, we'll keep the basic structure
  };

  useEffect(() => {
    buildFlow();
    window.addEventListener('resize', buildFlow);
    window.addEventListener('load', buildFlow);
    return () => {
      window.removeEventListener('resize', buildFlow);
      window.removeEventListener('load', buildFlow);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main id="snap" ref={snapRef} tabIndex={0}>
        <HeroSection />
        <AboutSection />
        <TechStackSection />
        <ExperienceSection />
        <EventHighlightsSection />
        <div id="projects">
          <ProjectsSection />
        </div>
        <ContactSection />
      </main>
    </>
  );
}