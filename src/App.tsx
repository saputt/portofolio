import { useEffect, useRef } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { TechStackSection } from './components/sections/TechStackSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EventHighlightsSection } from './components/sections/EventHighlightsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ContactSection } from './components/sections/ContactSection';

const SLIDE_MS = 800; // samakan dengan durasi transform di .slide.floating.animate (CSS)

type Intent = 'open' | 'close' | 'block';

export default function App() {
  const snapRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const lastWheel = useRef(0);
  const lastInput = useRef(0); // kapan terakhir user menggerakkan wheel/sentuh/keyboard
  const needFresh = useRef(false); // buang sisa momentum sampai ada gesture baru
  const below = useRef(false); // true = posisi diam terakhir ada di Event atau setelahnya

  /* ---------- observer lama (tidak diubah) ---------- */
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

  /* ---------- Experience <-> Event Highlights: geser horizontal ----------
     Event tetap slide biasa di alur scroll. Hanya saat pindah dari/ke Experience,
     slide Event sementara "melayang" (position: fixed), digeser, lalu dikembalikan
     ke alur scroll. Event -> Projects tetap scroll vertikal normal. */
  useEffect(() => {
    const snap = snapRef.current;
    if (!snap) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const eventSlide = () => snap.querySelector<HTMLElement>('[data-t="Highlights"]');
    const lastExperience = () => {
      const ev = eventSlide();
      const all = Array.from(snap.querySelectorAll<HTMLElement>('.slide'));
      const i = ev ? all.indexOf(ev) : -1;
      return i > 0 ? all[i - 1] : null;
    };
    const isAligned = (el: HTMLElement | null) =>
      !!el && Math.abs(el.getBoundingClientRect().top) < 4;
    const jumpTo = (el: HTMLElement | null) =>
      el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    let unfreezeTimer = 0;
    const lock = () => {
      lockUntil.current = Date.now() + SLIDE_MS + 100;
      needFresh.current = true;
      // bekukan scroll native selama transisi: menghentikan fling/momentum yang masih jalan
      snap.style.overflowY = 'hidden';
      window.clearTimeout(unfreezeTimer);
      unfreezeTimer = window.setTimeout(() => {
        snap.style.overflowY = '';
      }, SLIDE_MS + 100);
    };

    // sisa animasi scroll native bisa menggeser posisi setelah kita kunci: timpa beberapa kali
    const pinTimers: number[] = [];
    const pinTo = (top: number) => {
      pinTimers.splice(0).forEach((id) => window.clearTimeout(id));
      [0, 60, 150, 300, 500].forEach((d) =>
        pinTimers.push(
          window.setTimeout(() => snap.scrollTo({ top, behavior: 'instant' as ScrollBehavior }), d)
        )
      );
    };

    // posisi scroll (scrollTop) saat slide terakhir Experience pas rata di layar
    const gateTop = () => {
      const exp = lastExperience();
      if (!exp) return null;
      return snap.scrollTop + exp.getBoundingClientRect().top - snap.getBoundingClientRect().top;
    };
    const updateBelow = () => {
      const g = gateTop();
      if (g !== null) below.current = snap.scrollTop > g + 8;
    };
    updateBelow();

    const intent = (down: boolean): Intent | null => {
      if (reduceMotion) return null;
      if (Date.now() < lockUntil.current) return 'block';
      if (down && isAligned(lastExperience())) return 'open';
      if (!down && isAligned(eventSlide())) return 'close';
      return null;
    };

    const openEvent = () => {
      const ev = eventSlide();
      if (!ev) return;
      document.body.classList.remove('dk');

      // 1. lepas dari alur scroll, taruh di kanan layar
      ev.classList.remove('animate');
      ev.classList.add('floating');
      ev.dataset.x = 'right';
      void ev.offsetWidth; // paksa browser menerapkan posisi awal

      // 2. geser masuk ke tengah
      ev.classList.add('animate');
      ev.dataset.x = 'center';

      // 3. setelah selesai: kembalikan ke alur scroll & sejajarkan scroll ke slide ini
      window.setTimeout(() => {
        ev.classList.add('on');
        ev.classList.remove('floating', 'animate');
        delete ev.dataset.x;
        jumpTo(ev);
        below.current = true;
      }, SLIDE_MS + 30);
    };

    const closeEvent = () => {
      const ev = eventSlide();
      const exp = lastExperience();
      if (!ev || !exp) return;

      // 1. Event melayang menutupi layar, scroll di belakangnya pindah ke Experience
      ev.classList.remove('animate');
      ev.classList.add('floating');
      ev.dataset.x = 'center';
      jumpTo(exp);
      below.current = false;
      document.body.classList.toggle('dk', exp.dataset.dk === '1');
      void ev.offsetWidth;

      // 2. geser keluar ke kanan
      ev.classList.add('animate');
      ev.dataset.x = 'right';

      // 3. kembalikan ke alur scroll (posisinya di bawah Experience)
      window.setTimeout(() => {
        ev.classList.remove('floating', 'animate');
        delete ev.dataset.x;
      }, SLIDE_MS + 30);
    };

    const run = (i: Intent) => {
      if (i === 'block') return;
      lock();
      if (i === 'open') openEvent();
      else closeEvent();
    };

    const onWheel = (e: WheelEvent) => {
      const now = Date.now();
      const fresh = now - lastWheel.current > 180; // gesture baru, bukan sisa inertia trackpad
      lastWheel.current = now;
      lastInput.current = now;

      // sisa momentum trackpad setelah transisi: buang sampai ada jeda (gesture baru)
      if (needFresh.current) {
        if (fresh && now >= lockUntil.current) needFresh.current = false;
        else {
          e.preventDefault();
          return;
        }
      }

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) < 6) return;
      const i = intent(e.deltaY > 0);
      if (!i) return;
      e.preventDefault();
      if (fresh) run(i);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      lastInput.current = Date.now();
      const down = e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey);
      const up = e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey);
      if (!down && !up) return;
      const i = intent(down);
      if (!i) return;
      e.preventDefault();
      run(i);
    };

    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastInput.current = Date.now();
    };
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      lastInput.current = Date.now();
      if (Math.abs(dy) < 6 || Math.abs(dx) > Math.abs(dy)) return;
      if (intent(dy < 0) && e.cancelable) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      lastInput.current = Date.now() + 500; // fling sentuh masih berlanjut setelah jari lepas
      if (Math.abs(dy) < 50 || Math.abs(dx) > Math.abs(dy)) return;
      const i = intent(dy < 0);
      if (i) run(i);
    };

    // Scroll cepat / fling bisa melewati titik rata slide Experience terakhir.
    // Kalau user (bukan klik titik navigasi) kelewat dari atas, tarik balik ke Experience
    // lalu mainkan geseran horizontal. Kalau kelewat naik dari bawah, berhenti di Event.
    let prevTop = snap.scrollTop;
    let settleTimer = 0;
    const onScroll = () => {
      const top = snap.scrollTop;
      const down = top > prevTop;
      prevTop = top;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(updateBelow, 120);

      if (reduceMotion || Date.now() < lockUntil.current) return;
      if (Date.now() - lastInput.current > 1500) return; // scroll programatik (klik titik nav), biarkan

      const g = gateTop();
      const exp = lastExperience();
      if (g === null || !exp) return;
      const eventTop = g + exp.getBoundingClientRect().height;

      if (!below.current && down && top > g + 8) {
        snap.scrollTo({ top: g, behavior: 'instant' as ScrollBehavior });
        run('open');
        pinTo(g);
      } else if (below.current && !down && top < eventTop - 8) {
        snap.scrollTo({ top: eventTop, behavior: 'instant' as ScrollBehavior });
        lock();
        pinTo(eventTop);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') lastInput.current = 0; // klik = bukan scroll manual
    };

    snap.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      window.clearTimeout(unfreezeTimer);
      window.clearTimeout(settleTimer);
      pinTimers.forEach((id) => window.clearTimeout(id));
      snap.style.overflowY = '';
      snap.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
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