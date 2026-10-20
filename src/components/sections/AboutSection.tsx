import { FC } from 'react';
import { personalData } from '@/data/personalData';

/* Kata-kata carousel (dummy, silakan diganti) */
const MARQUEE_ITEMS = [
  'Full-Stack Developer',
  'Backend Engineer',
  'Web Development',
  'Clean Code',
  'Microservices',
];

const ArrowIcon: FC = () => (
  <svg viewBox="0 0 100 100" className="w-14 sm:w-24 md:w-40 lg:w-52 flex-none text-white/30" aria-hidden="true">
    <path d="M18 82 L72 28 M30 22 H78 V70" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="butt" strokeLinejoin="miter" />
  </svg>
);

const Dot: FC = () => (
  <span className="mx-5 md:mx-8 flex-none text-royal" aria-hidden="true">•</span>
);

/*
  About = 1 layar penuh (h-[100svh] dari .slide), flex-col justify-between:
  - blok teks berada di tengah area atas
  - carousel menempel di dasar section, dan HANYA bagian dari section ini.
  .slide sudah overflow-hidden, jadi carousel ikut tertutup saat section Tech stack
  (relative z-10, background solid) menggantikan layar.
*/
export const AboutSection: FC = () => {
  const { fullBio, education, role } = personalData;

  // satu belahan = daftar kata diulang 2x (cukup lebar untuk layar besar);
  // dua belahan identik + translateX(-50%) = loop mulus tanpa jeda kosong
  const half = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  const renderHalf = (key: string) => (
    <div key={key} className="flex flex-none items-center">
      {half.map((t, i) => (
        <div key={`${key}-${i}`} className="flex flex-none items-center">
          <span className="dsp uppercase whitespace-nowrap text-[clamp(1.1rem,2.6vw,2.4rem)] leading-none">{t}</span>
          <Dot />
        </div>
      ))}
    </div>
  );

  return (
    <section className="slide bg-blue flex-col items-stretch justify-between" data-t="About" data-dk="1">
      <div className="flex flex-1 items-center min-h-0">
        <div className="wrap flex flex-col gap-6 md:gap-8">
          <h2 className="reveal dsp uppercase leading-[0.85] tracking-tighter text-white text-[clamp(3.5rem,min(18vw,17svh),11rem)]">
            /About
          </h2>

          <div className="reveal flex items-end gap-4 md:gap-12" style={{ transitionDelay: '120ms' }}>
            <ArrowIcon />
            <div className="max-w-xl md:max-w-3xl xl:max-w-4xl">
              <p className="text-[13px] sm:text-base md:text-xl lg:text-2xl xl:text-3xl leading-relaxed md:leading-snug text-white/90">
                {fullBio}
              </p>
              <p className="mt-4 md:mt-6 text-[10px] md:text-sm lg:text-base font-bold uppercase tracking-wider text-white/75">
                {role} · Studying {education.field} at {education.institution}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full flex-none overflow-hidden whitespace-nowrap py-3 md:py-5"
        style={{ backgroundColor: '#ffffff', color: '#2563EB' }}
        aria-label={MARQUEE_ITEMS.join(', ')}
      >
        <div className="about-marquee-track flex w-max items-center" aria-hidden="true">
          {renderHalf('a')}
          {renderHalf('b')}
        </div>
      </div>
    </section>
  );
};