import { FC } from 'react';
import { personalData } from '../../data/personalData';

export const HeroSection: FC = () => (
  <section className="slide bg-blue" data-t="Hello" data-dk="1">
    <div className="wrap">
      <p className="reveal text-sm sm:text-base font-medium text-white/80">Portfolio 2026</p>
      <h1 className="reveal dsp mt-3 text-hero-desktop md:text-hero-desktop lg:text-hero-large">
        {personalData.name.split(' ')[0]}<br />
        <span className="md:ml-[8vw]">{personalData.name.split(' ').slice(1).join(' ')}</span>
      </h1>
      <div className="reveal mt-8 sm:mt-10 max-w-xl">
        <p className="text-2xl sm:text-4xl font-bold tracking-tight">
          {personalData.role}
        </p>
        <p className="mt-3 text-lg sm:text-2xl text-white/90">
          I build backend systems that stay readable as they grow.
        </p>
      </div>
    </div>
  </section>
);