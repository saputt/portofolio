import { FC } from 'react';
import { personalData } from '../../data/personalData';

export const ContactSection: FC = () => (
  <section className="slide bg-blue" data-t="Contact" data-dk="1">
    <div className="wrap text-center">
      <h2 className="reveal dsp text-section-mobile sm:text-section-desktop lg:text-section-large">Let&rsquo;s connect.</h2>
      <ul className="reveal mt-8 sm:mt-10 mx-auto max-w-xl text-xl sm:text-3xl font-bold font-display tracking-tight">
        <li className="line py-4">
          <span className="block text-sm font-medium text-white/75 tracking-normal">
            Email
          </span>
          <a className="underline-anim break-all" href={`mailto:${personalData.socials.email}`}>
            {personalData.socials.email}
          </a>
        </li>
        <li className="line py-4">
          <span className="block text-sm font-medium text-white/75 tracking-normal">
            Phone
          </span>
          <a className="underline-anim" href={`tel:${personalData.socials.phone.replace(/\s/g, '')}`}>
            {personalData.socials.phone}
          </a>
        </li>
        <li className="line py-4">
          <span className="block text-sm font-medium text-white/75 tracking-normal">
            Location
          </span>
          {personalData.socials.location}
        </li>
      </ul>
      <p className="mt-6 text-sm font-medium text-white/70">
        © 2026 {personalData.name}
      </p>
    </div>
  </section>
);