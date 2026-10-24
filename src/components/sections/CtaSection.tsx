import { FC } from 'react';

const goToContact = () => {
  const contact = document.querySelector<HTMLElement>('[data-t="Contact"]');
  if (!contact) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  contact.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
};

export const CtaSection: FC = () => (
  <section className="slide bg-white text-slate-900" data-t="Let's Talk">
    <div className="wrap flex h-full flex-col items-center justify-center py-24 text-center md:py-32">
      {/* Tag */}
      <p className="reveal font-mono text-[11px] uppercase tracking-widest text-gray-500 sm:text-xs md:text-sm">
        [04] Let&rsquo;s work together
      </p>

      <h2 className="reveal mx-auto my-6 max-w-4xl text-3xl font-extrabold uppercase leading-tight tracking-tight text-[#2563eb] sm:text-4xl md:text-6xl">
        READY TO LEARN, ADAPT, AND BUILD TOGETHER
      </h2>

      <p className="reveal mx-auto max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
        Currently in my 5th semester, I'm passionate about exploring backend architecture and core systems. Open to new tools, fresh challenges, and technical discussions.
      </p>

      <button
        type="button"
        onClick={goToContact}
        className="reveal group mt-10 inline-flex items-center gap-2 text-base font-semibold text-slate-900 underline underline-offset-4 decoration-1 transition-colors hover:text-[#2563eb] sm:text-lg"
      >
        Get In Touch
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  </section>
);