import { FC, SVGProps } from 'react';
import { personalData } from '../../data/personalData';

type IconProps = SVGProps<SVGSVGElement>;

const iconBase: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

const LinkedInIcon: FC<IconProps> = (props) => (
  <svg {...iconBase} {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon: FC<IconProps> = (props) => (
  <svg {...iconBase} {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GithubIcon: FC<IconProps> = (props) => (
  <svg {...iconBase} {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ArrowUpRightIcon: FC<IconProps> = (props) => (
  <svg {...iconBase} {...props}>
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const socialLinks = [
  { label: 'LinkedIn', href: personalData.socials.linkedin, Icon: LinkedInIcon },
  { label: 'Instagram', href: personalData.socials.instagram, Icon: InstagramIcon },
  { label: 'GitHub', href: personalData.socials.github, Icon: GithubIcon },
].filter((s) => Boolean(s.href));

const goToContact = () => {
  const contact = document.querySelector<HTMLElement>('[data-t="Contact"]');
  if (!contact) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  contact.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
};

/* ---------- Dekorasi: 2 garis lingkaran tipis & minimalis ---------- */
const OrbitPattern: FC = () => (
  <svg
    className="pointer-events-none absolute inset-0 z-0 h-full w-full text-royal"
    viewBox="0 0 1440 800"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
    aria-hidden="true"
  >
    {/* lingkaran besar, berpusat agak ke kanan */}
    <circle
      cx="1080"
      cy="380"
      r="560"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.12"
      vectorEffect="non-scaling-stroke"
    />
    {/* lingkaran kedua, lebih kecil di pojok kiri bawah untuk menyeimbangkan komposisi */}
    <circle
      cx="120"
      cy="780"
      r="300"
      stroke="currentColor"
      strokeWidth="1"
      strokeOpacity="0.1"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

/* ---------- Desktop: giant running text (endless marquee ke kiri) ---------- */
const MARQUEE_REPEAT = 2; // jumlah salinan nama per belahan; naikkan kalau layar sangat lebar

const MarqueeStar: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="mx-12 h-[0.3em] w-[0.3em] flex-none text-royal"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M12 0l2.2 6.3 5.9-3 -3 5.9L23.4 12l-6.3 2.2 3 5.9 -5.9-3L12 24l-2.2-6.3 -5.9 3 3-5.9L.6 12l6.3-2.2 -3-5.9 5.9 3z"
    />
  </svg>
);

const GiantMarquee: FC<{ text: string }> = ({ text }) => {
  // satu belahan = nama diulang; dua belahan identik + translateX(-50%) = loop mulus
  const renderHalf = (key: string) => (
    <div key={key} className="flex flex-none items-center">
      {Array.from({ length: MARQUEE_REPEAT }).map((_, i) => {
        const outline = i % 2 === 1; // selang-seling solid / outline ala editorial
        return (
          <div key={`${key}-${i}`} className="flex flex-none items-center">
            <span
              className={`dsp font-black uppercase whitespace-nowrap leading-[0.85] tracking-tighter
                md:text-[9rem] lg:text-[14rem] xl:text-[16vw] 2xl:text-[18vw]
                ${outline ? 'text-transparent' : 'text-royal'}`}
              style={outline ? { WebkitTextStroke: '3px #2563EB' } : undefined}
            >
              {text}
            </span>
            <MarqueeStar />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 overflow-hidden md:block"
      aria-label={text}
    >
      <div className="hero-marquee-track flex w-max items-center" aria-hidden="true">
        {renderHalf('a')}
        {renderHalf('b')}
      </div>
    </div>
  );
};

/* ---------- Hero ---------- */
export const HeroSection: FC = () => {
  const { name, role } = personalData;

  return (
    <section className="slide bg-light" data-t="Hello">
      <OrbitPattern />
      <GiantMarquee text={name} />

      {/* Layer konten (paling atas, bisa diklik) */}
      <div className="wrap relative z-20 flex h-full flex-col justify-between gap-6 py-16 pr-10 sm:pr-12 md:gap-0 md:py-14 md:pr-0">
        {/* Kiri atas: label + role */}
        <div className="reveal">
          <p className="text-sm font-semibold text-royal sm:text-base">Portfolio 2026</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-deep sm:text-4xl">{role}</p>
        </div>

        {/* Mobile: nama statis besar, satu kata per baris */}
        <div className="flex flex-1 items-center md:hidden">
          <h1
            className="dsp font-black uppercase leading-[0.9] tracking-tighter text-royal text-[16vw] sm:text-[14vw]"
            aria-label={name}
          >
            {name.split(' ').map((word, i) => (
              <span key={`${word}-${i}`} className="block" aria-hidden="true">
                {word}
              </span>
            ))}
          </h1>
        </div>

        {/* Bawah: tagline (desktop saja) + CTA di kiri, sosial di kanan */}
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="max-w-xl">
            <p className="hidden text-2xl text-slate-600 md:block">
              I build backend systems that stay readable as they grow.
            </p>
            <button
              type="button"
              onClick={goToContact}
              className="group inline-flex items-center gap-2 rounded-full bg-royal px-6 py-3 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl md:mt-6"
            >
              Let&rsquo;s collaborate
              <ArrowUpRightIcon className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>

          <ul className="flex flex-wrap gap-2 md:gap-6">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center gap-2.5 rounded-full border-[1.5px] border-royal/40 bg-white/80 px-4 py-2 text-sm font-medium text-deep backdrop-blur-sm transition hover:bg-royal hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};