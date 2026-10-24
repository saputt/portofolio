import { useCallback, useEffect, useRef, useState } from 'react';
import type { FC } from 'react';

interface NavDotProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavDot: FC<NavDotProps> = ({ label, isActive, onClick }) => (
  <button
    type="button"
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

  const activeRef = useRef(0); // posisi aktif terbaru (dipakai di callback)
  const targetRef = useRef<number | null>(null); // slide tujuan saat navigasi lewat klik
  const targetTimer = useRef(0);

  useEffect(() => {
    const snap = document.getElementById('snap');
    // Daftar slide diambil langsung dari DOM, jadi otomatis cocok kalau ada section baru/dihapus
    const slideElements = Array.from(document.querySelectorAll<HTMLElement>('.slide'));
    setSlides(slideElements);

    if (!snap) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = slideElements.indexOf(entry.target as HTMLElement);
        if (index === -1) return;

        // Sedang menuju slide tujuan hasil klik: abaikan slide yang cuma "dilewati"
        if (targetRef.current !== null) {
          if (index === targetRef.current) {
            targetRef.current = null;
            window.clearTimeout(targetTimer.current);
          } else {
            return;
          }
        }

        activeRef.current = index;
        setActiveIndex(index);
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: snap,
      threshold: 0.55,
    });

    slideElements.forEach((slide) => observer.observe(slide));

    return () => {
      observer.disconnect();
      window.clearTimeout(targetTimer.current);
    };
  }, []);

  const scrollToSlide = useCallback(
    (index: number) => {
      const targetSlide = slides[index];
      if (!targetSlide) return;

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const distance = Math.abs(index - activeRef.current);

      // Titik langsung pindah ke tujuan, tidak loncat-loncat mengikuti slide yang dilewati
      targetRef.current = index;
      activeRef.current = index;
      setActiveIndex(index);

      // Lepas kunci kalau observer tidak sempat melapor (mis. scroll terputus)
      window.clearTimeout(targetTimer.current);
      targetTimer.current = window.setTimeout(() => {
        targetRef.current = null;
      }, 1600);

      // Slide bersebelahan: smooth. Lompatan jauh: langsung, supaya tidak menyapu semua slide di antaranya
      const behavior: ScrollBehavior = reduce || distance > 1 ? ('instant' as ScrollBehavior) : 'smooth';
      targetSlide.scrollIntoView({ behavior });
    },
    [slides],
  );

  return (
    <nav
      id="dots"
      aria-label="Sections"
      className="fixed right-[max(0.5rem,env(safe-area-inset-right))] top-1/2 -translate-y-1/2 z-50 flex flex-col gap-1.5"
    >
      {slides.map((slide, index) => {
        const label = slide.dataset.t || `Section ${index + 1}`;
        return (
          <NavDot
            key={`${label}-${index}`}
            label={label}
            isActive={activeIndex === index}
            onClick={() => scrollToSlide(index)}
          />
        );
      })}
    </nav>
  );
};