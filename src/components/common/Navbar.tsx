import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { projectsData } from '../../data/projectsData';

interface NavDotProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavDot: FC<NavDotProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    aria-label={`Go to ${label}`}
    aria-current={isActive ? 'true' : 'false'}
    className="relative w-[26px] h-[22px] grid place-items-center bg-transparent border-0 cursor-pointer"
  >
    <i
      className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${isActive ? 'bg-ink h-5' : 'bg-transparent'} dark:border-white dark:bg-white`}
      style={{ borderColor: 'var(--text-primary)' }}
    />
    <span className="absolute right-[30px] whitespace-nowrap text-xs font-semibold px-2 py-0.5 rounded bg-ink text-white opacity-0 pointer-events-none transition-opacity duration-200 dark:bg-white dark:text-royal">
      {label}
    </span>
  </button>
);

export const Navbar: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const snap = document.getElementById('snap');
    const slideElements = Array.from(document.querySelectorAll('.slide')) as HTMLElement[];
    setSlides(slideElements);

    if (!snap) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = slideElements.indexOf(entry.target as HTMLElement);
          if (index !== -1) {
            setActiveIndex(index);
          }
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

  const scrollToSlide = (index: number) => {
    const targetSlide = slides[index];
    if (targetSlide) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      targetSlide.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  const sectionLabels = [
    'Hello',
    'About',
    'Tech stack',
    'Unikom Codelabs',
    'COMPFEST 18',
    'Highlights',
    ...projectsData.map((p) => p.title),
    'Contact',
  ];

  return (
    <nav
      id="dots"
      aria-label="Sections"
      className="fixed right-[max(0.5rem,env(safe-area-inset-right))] top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5"
    >
      {sectionLabels.map((label, index) => (
        <NavDot
          key={label}
          label={label}
          isActive={activeIndex === index}
          onClick={() => scrollToSlide(index)}
        />
      ))}
    </nav>
  );
};