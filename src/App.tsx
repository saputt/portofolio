import { useEffect, useRef } from 'react';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { TechStackSection } from './components/sections/TechStackSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { EventHighlightsSection } from './components/sections/EventHighlightsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { ContactSection } from './components/sections/ContactSection';

const SLIDE_MS = 1300; // samakan dengan --slide-ms di .slide.floating (CSS)
const PAGE_MS = 1200; // durasi pindah slide biasa (scroll animasi lewat JS)
const PAGE_MS_FLOW = 1900; // Event <-> Project pertama: dibuat lebih lama supaya panah alir terlihat menggambar
const GALLERY_HOLD_MS = 450;

type Intent =
  | 'open'
  | 'close'
  | 'aboutOpen'
  | 'aboutClose'
  | 'pageDown'
  | 'pageUp'
  | 'gallery'
  | 'block';

export default function App() {
  const snapRef = useRef<HTMLDivElement>(null);
  const lockUntil = useRef(0);
  const lastWheel = useRef(0);
  const lastInput = useRef(0); // kapan terakhir user menggerakkan wheel/sentuh/keyboard
  const needFresh = useRef(false); // buang sisa momentum sampai ada gesture baru
  const pastHero = useRef(false); // true = posisi diam terakhir sudah lewat Hero (di About atau setelahnya)
  const galleryHold = useRef(0); // sampai kapan galeri "menahan" scroll setelah mentok di ujung
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

  /* ---------- Transisi antar-slide ----------
     1. Hero <-> About: About "melayang" (position: fixed) lalu naik dari bawah
        menimpa Hero. Hero di belakangnya ikut bergeser tipis ke atas & meredup.
     2. Experience <-> Event Highlights: Event menyapu dari kanan (chevron wipe).
     Slide tetap berada di alur scroll biasa; hanya saat transisi ia dilepas sementara,
     lalu dikembalikan dan scroll disejajarkan ke slide tersebut. */
  useEffect(() => {
    const snap = snapRef.current;
    if (!snap) return;

    const heroSlide = () => snap.querySelector<HTMLElement>('[data-t="Hello"]');
    const aboutSlide = () => snap.querySelector<HTMLElement>('[data-t="About"]');
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
    const lock = (ms: number = SLIDE_MS) => {
      lockUntil.current = Date.now() + ms + 100;
      needFresh.current = true;
      // bekukan scroll native selama transisi: menghentikan fling/momentum yang masih jalan
      snap.style.overflowY = 'hidden';
      window.clearTimeout(unfreezeTimer);
      unfreezeTimer = window.setTimeout(() => {
        snap.style.overflowY = '';
      }, ms + 100);
    };

    /* ----- Daftar slide & slide yang sedang rata di layar ----- */
    const allSlides = () => Array.from(snap.querySelectorAll<HTMLElement>('.slide'));
    const alignedSlide = () => allSlides().find((s) => isAligned(s)) ?? null;

    /* ----- Pindah slide biasa dengan animasi scroll sendiri (durasi bisa diatur) ----- */
    let pageRaf = 0;
    const pageTo = (target: HTMLElement, ms: number) => {
      const startTop = snap.scrollTop;
      const endTop =
        startTop + target.getBoundingClientRect().top - snap.getBoundingClientRect().top;
      lock(ms);
      // matikan snap & smooth bawaan browser selama animasi berjalan
      snap.style.scrollSnapType = 'none';
      snap.style.scrollBehavior = 'auto';
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / ms);
        snap.scrollTop = startTop + (endTop - startTop) * ease(p);
        if (p < 1) {
          pageRaf = requestAnimationFrame(step);
        } else {
          snap.scrollTop = endTop;
          snap.style.scrollSnapType = '';
          snap.style.scrollBehavior = '';
          updateBelow();
        }
      };
      cancelAnimationFrame(pageRaf);
      pageRaf = requestAnimationFrame(step);
    };

    const pageDuration = (from: HTMLElement, to: HTMLElement) => {
      const ev = eventSlide();
      const list = allSlides();
      const ei = ev ? list.indexOf(ev) : -1;
      const a = list.indexOf(from);
      const b = list.indexOf(to);
      return ei >= 0 && ((a === ei && b === ei + 1) || (a === ei + 1 && b === ei))
        ? PAGE_MS_FLOW
        : PAGE_MS;
    };

    const page = (dir: 1 | -1) => {
      const list = allSlides();
      const cur = alignedSlide();
      if (!cur) return;
      const next = list[list.indexOf(cur) + dir];
      if (next) pageTo(next, pageDuration(cur, next));
    };

    /* ----- Galeri Event: scroll vertikal menggeser foto ke samping sampai habis ----- */
    const gallery = () => snap.querySelector<HTMLElement>('.gallery');
    const galleryMax = (g: HTMLElement) => g.scrollWidth - g.clientWidth;
    const isCarousel = (g: HTMLElement) => galleryMax(g) > 4;
    let gPos = 0;
    let gTarget = 0;
    let gRaf = 0;
    const galleryStep = () => {
      const g = gallery();
      if (!g) {
        gRaf = 0;
        return;
      }
      const diff = gTarget - gPos;
      if (Math.abs(diff) < 0.5) {
        gPos = gTarget;
        g.scrollLeft = gPos;
        gRaf = 0;
        return;
      }
      gPos += diff * 0.2;
      g.scrollLeft = gPos;
      gRaf = requestAnimationFrame(galleryStep);
    };
    const galleryPos = (g: HTMLElement) => (gRaf ? gTarget : g.scrollLeft);
    const galleryAtStart = (g: HTMLElement) => galleryPos(g) <= 2;
    const galleryAtEnd = (g: HTMLElement) => galleryPos(g) >= galleryMax(g) - 2;
    // geser halus (roda mouse / trackpad / tombol)
    const galleryPush = (g: HTMLElement, delta: number) => {
      if (!gRaf) {
        gPos = g.scrollLeft;
        gTarget = g.scrollLeft;
      }
      gTarget = Math.min(Math.max(gTarget + delta, 0), galleryMax(g));
      if (!gRaf) gRaf = requestAnimationFrame(galleryStep);
      if (galleryAtStart(g) || galleryAtEnd(g)) galleryHold.current = Date.now() + GALLERY_HOLD_MS;
    };
    // geser langsung mengikuti jari (sentuh)
    const galleryJump = (g: HTMLElement, delta: number) => {
      cancelAnimationFrame(gRaf);
      gRaf = 0;
      const before = g.scrollLeft;
      g.scrollLeft = Math.min(Math.max(before + delta, 0), galleryMax(g));
      gPos = gTarget = g.scrollLeft;
      if (galleryAtStart(g) || galleryAtEnd(g)) galleryHold.current = Date.now() + GALLERY_HOLD_MS;
      return g.scrollLeft !== before;
    };
    const resetGallery = () => {
      const g = gallery();
      cancelAnimationFrame(gRaf);
      gRaf = 0;
      if (g) g.scrollLeft = 0;
      gPos = gTarget = 0;
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
      const h = heroSlide();
      if (h) pastHero.current = snap.scrollTop > h.offsetHeight - 8;
    };
    updateBelow();

    const intent = (down: boolean): Intent | null => {
      // sedang ada modal detail project: jangan ganggu scroll-nya
      if (snap.hasAttribute('inert')) return null;
      if (Date.now() < lockUntil.current) return 'block';
      if (down && isAligned(heroSlide())) return 'aboutOpen';
      if (!down && isAligned(aboutSlide())) return 'aboutClose';
      if (down && isAligned(lastExperience())) return 'open';

      // Event Highlights: scroll menggeser galeri dulu, baru pindah section
      const ev = eventSlide();
      if (isAligned(ev)) {
        const g = gallery();
        if (g && isCarousel(g)) {
          const edge = down ? galleryAtEnd(g) : galleryAtStart(g);
          if (!edge) return 'gallery';
          if (Date.now() < galleryHold.current) return 'block';
        }
        return down ? 'pageDown' : 'close';
      }

      return alignedSlide() ? (down ? 'pageDown' : 'pageUp') : null;
    };

    /* ----- Hero <-> About: About naik dari bawah menimpa Hero ----- */
    const openAbout = () => {
      const hero = heroSlide();
      const ab = aboutSlide();
      if (!hero || !ab) return;

      // 1. About lepas dari alur scroll, taruh di bawah layar
      ab.classList.remove('animate');
      ab.classList.add('floating');
      ab.dataset.y = 'bottom';
      void ab.offsetWidth; // paksa browser menerapkan posisi awal

      // 2. About naik menutupi layar; Hero di belakang bergeser tipis & meredup
      ab.classList.add('animate');
      ab.dataset.y = 'center';
      hero.classList.add('under-anim', 'under');
      // warna dots/navbar ikut berganti saat About sudah menutupi separuh layar
      window.setTimeout(
        () => document.body.classList.toggle('dk', ab.dataset.dk === '1'),
        SLIDE_MS * 0.45
      );

      // 3. kembalikan ke alur scroll & sejajarkan scroll ke About
      window.setTimeout(() => {
        ab.classList.add('on');
        ab.classList.remove('floating', 'animate');
        delete ab.dataset.y;
        hero.classList.remove('under-anim', 'under'); // sudah di luar layar, aman direset
        jumpTo(ab);
        pastHero.current = true;
      }, SLIDE_MS + 30);
    };

    const closeAbout = () => {
      const hero = heroSlide();
      const ab = aboutSlide();
      if (!hero || !ab) return;

      // 1. About melayang menutupi layar, scroll di belakangnya pindah ke Hero
      //    (Hero mulai dalam posisi "tertimpa" tanpa transisi, lalu kembali ke tengah)
      ab.classList.remove('animate');
      ab.classList.add('floating');
      ab.dataset.y = 'center';
      hero.classList.remove('under-anim');
      hero.classList.add('under');
      jumpTo(hero);
      pastHero.current = false;
      void ab.offsetWidth;
      hero.classList.add('under-anim');
      void hero.offsetWidth;

      // 2. About turun keluar; Hero kembali ke posisi semula
      ab.classList.add('animate');
      ab.dataset.y = 'bottom';
      hero.classList.remove('under');
      window.setTimeout(
        () => document.body.classList.toggle('dk', hero.dataset.dk === '1'),
        SLIDE_MS * 0.45
      );

      // 3. kembalikan About ke alur scroll (posisinya di bawah Hero)
      window.setTimeout(() => {
        ab.classList.remove('floating', 'animate');
        delete ab.dataset.y;
        hero.classList.remove('under-anim');
      }, SLIDE_MS + 30);
    };

    /* ----- Experience <-> Event: sapuan chevron dari kanan ----- */
    const openEvent = () => {
      const ev = eventSlide();
      const exp = lastExperience();
      if (!ev) return;

      resetGallery();

      // 1. lepas dari alur scroll, siapkan posisi awal (clip menutup di sisi kanan)
      ev.classList.remove('animate');
      ev.classList.add('floating');
      ev.dataset.x = 'right';
      void ev.offsetWidth; // paksa browser menerapkan posisi awal

      // 2. sapu masuk ke tengah; slide Experience mundur tipis di belakangnya
      ev.classList.add('animate');
      ev.dataset.x = 'center';
      exp?.classList.add('pushing', 'pushed');
      // warna dots ikut berganti saat tepi chevron sudah melewati separuh layar
      window.setTimeout(() => document.body.classList.add('dk'), SLIDE_MS * 0.45);

      // 3. setelah selesai: kembalikan ke alur scroll & sejajarkan scroll ke slide ini
      window.setTimeout(() => {
        ev.classList.add('on');
        ev.classList.remove('floating', 'animate');
        delete ev.dataset.x;
        jumpTo(ev);
        below.current = true;
        exp?.classList.remove('pushing', 'pushed'); // sudah di luar layar, aman direset
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
      // Experience mulai dalam posisi "mundur" lalu kembali ke tengah (tanpa transisi di awal)
      exp.classList.remove('pushing');
      exp.classList.add('pushed');
      jumpTo(exp);
      below.current = false;
      void ev.offsetWidth;
      exp.classList.add('pushing');
      void exp.offsetWidth;

      // 2. tarik Event keluar ke kanan (sapuan chevron terbalik)
      ev.classList.add('animate');
      ev.dataset.x = 'right';
      exp.classList.remove('pushed');
      window.setTimeout(
        () => document.body.classList.toggle('dk', exp.dataset.dk === '1'),
        SLIDE_MS * 0.45
      );

      // 3. kembalikan ke alur scroll (posisinya di bawah Experience)
      window.setTimeout(() => {
        ev.classList.remove('floating', 'animate');
        delete ev.dataset.x;
        exp.classList.remove('pushing');
      }, SLIDE_MS + 30);
    };

    const run = (i: Intent) => {
      if (i === 'block' || i === 'gallery') return;
      if (i === 'pageDown') return page(1);
      if (i === 'pageUp') return page(-1);
      lock();
      if (i === 'aboutOpen') openAbout();
      else if (i === 'aboutClose') closeAbout();
      else if (i === 'open') openEvent();
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
      if (i === 'gallery') {
        const g = gallery();
        if (g) galleryPush(g, Math.max(-160, Math.min(160, e.deltaY)) * 1.5);
        return;
      }
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
      if (i === 'gallery') {
        const g = gallery();
        if (g) galleryPush(g, (down ? 1 : -1) * g.clientWidth * 0.6);
        return;
      }
      run(i);
    };

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let touchUsedGallery = false; // gesture ini sudah menggeser galeri: jangan pindah section di ujungnya
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastY = startY;
      touchUsedGallery = false;
      lastInput.current = Date.now();
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const dx = e.touches[0].clientX - startX;
      const dy = y - startY;
      lastInput.current = Date.now();
      if (Math.abs(dy) < 6 || Math.abs(dx) > Math.abs(dy)) return;
      const i = intent(dy < 0);
      if (!i) return;
      if (e.cancelable) e.preventDefault();
      if (i === 'gallery') {
        const g = gallery();
        if (g) {
          touchUsedGallery = true;
          galleryJump(g, (lastY - y) * 1.4); // geser jari ke atas = foto bergeser ke kiri
        }
      }
      lastY = y;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      lastInput.current = Date.now() + 500; // fling sentuh masih berlanjut setelah jari lepas
      if (touchUsedGallery) return;
      if (Math.abs(dy) < 50 || Math.abs(dx) > Math.abs(dy)) return;
      const i = intent(dy < 0);
      if (i) run(i);
    };

    // Scroll cepat / fling bisa melewati titik rata slide (Hero atau Experience terakhir).
    // Kalau user (bukan klik titik navigasi) kelewat dari atas, tarik balik ke slide pemicu
    // lalu mainkan transisinya. Kalau kelewat naik dari bawah, berhenti di slide tujuan.
    let prevTop = snap.scrollTop;
    let settleTimer = 0;
    const onScroll = () => {
      const top = snap.scrollTop;
      const down = top > prevTop;
      prevTop = top;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(updateBelow, 120);

      if (Date.now() < lockUntil.current) return;
      if (Date.now() - lastInput.current > 1500) return; // scroll programatik (klik titik nav), biarkan

      // --- Hero -> About ---
      const hero = heroSlide();
      if (hero) {
        const aboutTop = hero.offsetHeight;
        if (!pastHero.current && down && top > 8 && top < aboutTop - 8) {
          snap.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          run('aboutOpen');
          pinTo(0);
          return;
        }
        if (pastHero.current && !down && top > 8 && top < aboutTop - 8) {
          snap.scrollTo({ top: aboutTop, behavior: 'instant' as ScrollBehavior });
          lock();
          pinTo(aboutTop);
          return;
        }
      }

      // --- Experience -> Event ---
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
      cancelAnimationFrame(pageRaf);
      cancelAnimationFrame(gRaf);
      snap.style.overflowY = '';
      snap.style.scrollSnapType = '';
      snap.style.scrollBehavior = '';
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