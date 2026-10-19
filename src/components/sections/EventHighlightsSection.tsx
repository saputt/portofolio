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
    <section className="slide bg-blue" data-t="Highlights" data-dk="1">
      <div className="wrap">
        <div className="reveal flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
          <h2 className="dsp text-section-mobile sm:text-section-desktop">Event highlights</h2>
          <p className="text-sm sm:text-base text-white/85 max-w-xs">
            Activity photos from programs and community events.{' '}
            <span id="galh" style={{ display: isCarousel ? '' : 'none' }}>
              Swipe to browse{' '}
              <b id="galc" className="text-white">
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