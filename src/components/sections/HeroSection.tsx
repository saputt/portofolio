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

export const HeroSection: FC = () => (
  <section className="slide bg-blue" data-t="Hello" data-dk="1">
    <div className="wrap">
      <p className="reveal text-sm sm:text-base font-medium text-white/80">Portfolio 2026</p>
      <h1 className="reveal dsp mt-3 text-hero-desktop md:text-hero-desktop lg:text-hero-large">
        {personalData.name.split(' ')[0]}<br />
        <span className="md:ml-[8vw]">{personalData.name.split(' ').slice(1).join(' ')}</span>
      </h1>

      <div className="reveal mt-8 sm:mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {/* Kiri: role, tagline, CTA */}
        <div className="max-w-xl">
          <p className="text-2xl sm:text-4xl font-bold tracking-tight">
            {personalData.role}
          </p>
          <p className="mt-3 text-lg sm:text-2xl text-white/90">
            I build backend systems that stay readable as they grow.
          </p>
          <button
            type="button"
            onClick={goToContact}
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-deep shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Let&rsquo;s collaborate
            <ArrowUpRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Kanan: social links */}
        <ul className="flex flex-wrap gap-3 md:flex-col md:flex-nowrap">
          {socialLinks.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center gap-2.5 rounded-full border-[1.5px] border-white/50 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-deep md:w-40"
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