import { FC, useRef, useState, useEffect, useCallback } from 'react';
import { eventHighlights } from '../../data/eventsData';

export const EventHighlightsSection: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCarousel, setIsCarousel] = useState(false);

  const galleryRef = useRef<HTMLDivElement>(null);
  const figuresRef = useRef<HTMLElement[]>([]);

  const updateCarouselState = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    setIsCarousel(gallery.scrollWidth > gallery.clientWidth + 4);
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

    setCurrentIndex(newIndex);
  }, []);

  useEffect(() => {
    updateCarouselState();
    window.addEventListener('resize', updateCarouselState);
    return () => window.removeEventListener('resize', updateCarouselState);
  }, [updateCarouselState]);

  return (
    <section className="slide bg-[#2563eb] text-white" data-t="Highlights" data-dk="1">
      <div className="wrap">
        {/* Header: label kiri, judul besar kanan */}
        <div className="reveal mb-6 flex items-start justify-between gap-4 md:mb-10">
          <div className="flex-none pt-1 font-mono text-[10px] uppercase leading-snug tracking-wider text-white sm:text-xs md:text-sm">
            <p>[02]</p>
            <p>Latest Events</p>
            <p
              className="mt-2 text-white/80"
              style={{ display: isCarousel ? '' : 'none' }}
              id="galh"
            >
              <b id="galc" className="font-semibold text-white">
                {currentIndex + 1} / {eventHighlights.length}
              </b>
            </p>
          </div>

          <h2 className="max-w-[13ch] text-right font-display text-2xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:max-w-md sm:text-4xl md:max-w-2xl md:text-5xl lg:text-6xl">
            A collection of memorable events
          </h2>
        </div>

        {/* Galeri horizontal (class "gallery" dipertahankan agar perilaku scroll bawaan tetap berjalan) */}
        <div
          ref={galleryRef}
          className="reveal gallery flex h-auto snap-x snap-mandatory gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide"
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
              className="m-0 flex h-auto w-[260px] flex-shrink-0 snap-start flex-col items-stretch !ml-0 !mr-0 sm:w-[300px] lg:w-[380px]"
            >
              <img
                src={event.image}
                alt={event.title}
                className="aspect-square !h-auto !w-full !max-w-none !rounded-none !border-0 object-cover !shadow-none"
                onLoad={updateCarouselState}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x800/1d4ed8/FFFFFF?text=Event';
                }}
              />
              <figcaption className="mt-2 flex items-center justify-between gap-3 text-left font-mono text-xs uppercase tracking-wider text-white md:text-sm">
                <span className="truncate font-semibold">{event.title}</span>
                <span className="flex-none text-white/80">{event.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};