import { FC } from 'react';
import { personalData } from '@/data/personalData';

const CapIcon: FC = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 9l10-5 10 5-10 5-10-5z" />
    <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
    <path d="M22 9v6" />
  </svg>
);

const CodeIcon: FC = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M10 9l-3 3 3 3M14 9l3 3-3 3" />
  </svg>
);

/* delay bertahap supaya elemen masuk satu per satu (komponen .reveal sudah punya transisi) */
const stagger = (ms: number) => ({ transitionDelay: `${ms}ms` });

export const AboutSection: FC = () => {
  const { name, role, bio, profileImage, education, coursework } = personalData;

  return (
    <section className="slide bg-light scrollable" data-t="About">
      <div className="wrap grid gap-4 md:grid-cols-[0.75fr_1.25fr] md:gap-14 items-center">
        {/* ---------- Kartu profil ---------- */}
        <aside
          className="reveal order-2 md:order-1 flex md:flex-col items-center md:items-stretch gap-4 md:gap-5 p-3 md:p-4 rounded-2xl md:rounded-[1.75rem] bg-white md:max-w-sm"
          style={stagger(80)}
        >
          <img
            src={profileImage}
            alt={name}
            className="h-24 w-20 md:h-[42svh] md:w-full flex-none rounded-xl md:rounded-[1.25rem] object-cover bg-gray-200"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x500/2563EB/FFFFFF?text=Profile';
            }}
          />
        </aside>

        {/* ---------- Sisi kanan: judul, satu kalimat, dua kartu ---------- */}
        <div className="contents md:flex md:flex-col md:order-2 md:gap-6">
          <div className="reveal order-1 md:order-none flex items-center gap-4" style={stagger(0)}>
            <h2 className="dsp text-heading-mobile sm:text-section-desktop lg:text-section-large">
              About <span className="text-royal">me.</span>
            </h2>
            <img
              src={profileImage}
              alt=""
              aria-hidden="true"
              className="hidden md:block h-12 lg:h-16 w-28 lg:w-36 rounded-full object-cover border-[3px] border-ink"
            />
          </div>

          <p
            className="reveal order-3 md:order-none text-base sm:text-xl text-slate-600 max-w-md"
            style={stagger(160)}
          >
            {bio}
          </p>

          <div className="order-4 md:order-none grid grid-cols-2 gap-3 md:gap-5">
            <article
              className="reveal flex flex-col justify-between min-h-[10.5rem] md:min-h-[15rem] p-4 md:p-6 rounded-2xl md:rounded-3xl bg-royal text-white"
              style={stagger(240)}
            >
              <CapIcon />
              <div className="mt-4">
                <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-white/70">
                  Education
                </p>
                <h3 className="dsp mt-1 text-[15px] sm:text-xl md:text-2xl leading-tight">
                  {education.institution}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-white/85">
                  {education.period.split(',')[0]}
                </p>
              </div>
            </article>

            <article
              className="reveal flex flex-col justify-between min-h-[10.5rem] md:min-h-[15rem] p-4 md:p-6 rounded-2xl md:rounded-3xl bg-ink text-white"
              style={stagger(320)}
            >
              <CodeIcon />
              <div className="mt-4">
                <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-white/70">
                  Coursework
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {coursework.slice(0, 4).map((course) => (
                    <li
                      key={course}
                      className="px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-white/40 text-[10px] sm:text-xs font-semibold uppercase tracking-wide"
                    >
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};