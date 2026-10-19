import { FC, useRef, useState, useEffect, useCallback } from 'react';
import { eventHighlights } from '../../data/eventsData';

export const EventHighlightsSection: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isCarousel, setIsCarousel] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [waitLock, setWaitLock] = useState(0);

  const snapRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const figuresRef = useRef<HTMLElement[]>([]);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const calm = prefersReducedMotion ? 'auto' : 'smooth';

  const updateCarouselState = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const carouselActive = gallery.scrollWidth > gallery.clientWidth + 4;
    setIsCarousel(carouselActive);
  }, []);

  const syncIndex = useCallback(() => {
    const gallery = galleryRef.current;
    const figures = figuresRef.current;
    if (!gallery || figures.length === 0) return;

    const { scrollLeft, clientWidth, scrollWidth } = gallery;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 4;
    const atStart = scrollLeft < 4;

    let newIndex = 0;
    if (atEnd) {
      newIndex = figures.length - 1;
    } else if (atStart) {
      newIndex = 0;
    } else {
      newIndex = figures.reduce((best, fig, idx) => {
        return Math.abs(fig.offsetLeft - scrollLeft) < Math.abs(figures[best].offsetLeft - scrollLeft) ? idx : best;
      }, 0);
    }

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  const stepGallery = useCallback((direction: number) => {
    const figures = figuresRef.current;
    const gallery = galleryRef.current;
    if (!gallery || figures.length === 0) return false;

    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= figures.length) return false;

    setCurrentIndex(newIndex);
    gallery.scrollTo({ left: figures[newIndex].offsetLeft, behavior: calm });
    return true;
  }, [currentIndex, calm]);

  const navigateSlides = useCallback((direction: number) => {
    const snap = snapRef.current;
    const highlights = highlightsRef.current;
    if (!snap || !highlights) return;

    const slides = Array.from(snap.querySelectorAll('.slide')) as HTMLElement[];
    const currentSlideIndex = slides.indexOf(highlights);
    const targetSlide = slides[currentSlideIndex + direction];
    if (targetSlide) {
      targetSlide.scrollIntoView({ behavior: calm });
    }
  }, [calm]);

  const act = useCallback((direction: number) => {
    if (!stepGallery(direction)) {
      navigateSlides(direction);
    }
  }, [stepGallery, navigateSlides]);

  const handleScroll = useCallback(() => {
    const snap = snapRef.current;
    const highlights = highlightsRef.current;
    const gallery = galleryRef.current;
    if (!snap || !highlights || !gallery) return;

    const currentScrollTop = snap.scrollTop;
    const directionUp = currentScrollTop < lastScrollTop;
    setLastScrollTop(currentScrollTop);

    const highlightsRect = highlights.getBoundingClientRect();
    const pinned = isCarousel && Math.abs(highlightsRect.top) < 4;

    if (pinned === isPinned) return;
    setIsPinned(pinned);

    if (pinned) {
      const figures = figuresRef.current;
      if (figures.length > 0) {
        setCurrentIndex(directionUp ? figures.length - 1 : 0);
        gallery.scrollTo({ left: directionUp ? gallery.scrollWidth : 0, behavior: 'auto' });
      }
      setWaitLock(Date.now() + 650);
    }

    snap.style.overflowY = pinned ? 'hidden' : 'scroll';
  }, [isCarousel, lastScrollTop, calm]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!isPinned || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();

      const now = Date.now();
      if (now < waitLock || Math.abs(e.deltaY) < 6) return;
      setWaitLock(now + 700);
      act(e.deltaY > 0 ? 1 : -1);
    },
    [isPinned, waitLock, act]
  );

  const handleTouchStart = useCallback(() => {
    // Store initial touch position
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isPinned) return;
      e.changedTouches[0];
    },
    [isPinned]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isPinned) return;
      const key = e.key;
      const verticalDirection =
        key === 'ArrowDown' || key === 'PageDown' || (key === ' ' && !e.shiftKey)
          ? 1
          : key === 'ArrowUp' || key === 'PageUp' || (key === ' ' && e.shiftKey)
          ? -1
          : 0;

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        e.preventDefault();
        stepGallery(key === 'ArrowRight' ? 1 : -1);
        return;
      }

      if (!verticalDirection) return;
      e.preventDefault();
      act(verticalDirection);
    },
    [isPinned, stepGallery, act]
  );

  useEffect(() => {
    updateCarouselState();
    const handleResize = () => updateCarouselState();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCarouselState]);

  useEffect(() => {
    const snap = snapRef.current;
    if (!snap) return;

    snap.addEventListener('scroll', handleScroll, { passive: true });
    return () => snap.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const highlights = highlightsRef.current;
    if (!highlights) return;

    highlights.addEventListener('wheel', handleWheel, { passive: false });
    highlights.addEventListener('touchstart', handleTouchStart, { passive: true });
    highlights.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      highlights.removeEventListener('wheel', handleWheel);
      highlights.removeEventListener('touchstart', handleTouchStart);
      highlights.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd, handleKeyDown]);

  return (
    <section
      ref={highlightsRef}
      className="slide bg-mist"
      data-t="Highlights"
    >
      <div className="wrap">
        <div className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
          <h2 className="dsp text-section-mobile sm:text-section-desktop">Event highlights</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xs">
            Activity photos from programs and community events.{' '}
            <span id="galh" style={{ display: isCarousel ? '' : 'none' }}>
              Scroll to browse <b id="galc" className="text-ink">
                {currentIndex + 1} / {eventHighlights.length}
              </b>
            </span>
          </p>
        </div>
        <div
          ref={galleryRef}
          className="reveal gallery"
          tabIndex={0}
          aria-label="Event photos"
          onScroll={() => {
            const gallery = galleryRef.current;
            if (gallery) {
              clearTimeout((gallery as any)._t);
              (gallery as any)._t = setTimeout(syncIndex, 80);
            }
          }}
        >
          {eventHighlights.map((event, idx) => (
            <figure
              key={event.id}
              ref={(el) => {
                figuresRef.current[idx] = el!;
              }}
            >
              <img
                src={event.image}
                alt={event.title}
                onLoad={updateCarouselState}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x600/2563EB/FFFFFF?text=Event';
                }}
              />
              <figcaption>
                <b>{event.title}</b>
                {event.date}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};