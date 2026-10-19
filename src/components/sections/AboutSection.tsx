import { FC, useRef, useState } from 'react';
import { Modal, AboutDetailContent } from '../../components/common/Modal';
import { personalData } from '@/data/personalData';

export const AboutSection: FC = () => {
  const [showModal, setShowModal] = useState(false);
  const aboutMoreRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="slide bg-light scrollable" data-t="About">
      <div className="wrap about-grid">
        <h2 className="hd reveal dsp md:hidden text-center text-heading-mobile sm:text-heading-desktop">
          About me
        </h2>
        <div className="ph reveal">
          <div className="profile-frame">
            <img
              src={personalData.profileImage}
              alt={personalData.name}
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x500/2563EB/FFFFFF?text=Profile';
              }}
            />
          </div>
        </div>
        <p className="bio reveal text-lg sm:text-2xl font-bold max-w-xs text-center md:text-left mx-auto md:mx-0 tracking-tight leading-snug">
          {personalData.bio}
        </p>
        <div className="sm reveal md:hidden text-center">
          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 max-w-prose mx-auto">
            {personalData.fullBio}
          </p>
          <button
            ref={aboutMoreRef}
            type="button"
            className="btn-more mt-5"
            onClick={() => setShowModal(true)}
          >
            Baca selengkapnya
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="dt reveal hidden md:block" id="aboutFull">
          <h2 className="dsp text-section-mobile sm:text-section-desktop lg:text-section-large">About me</h2>
          <p className="mt-3 sm:mt-5 text-[14px] sm:text-lg leading-relaxed max-w-prose">
            {personalData.fullBio}
          </p>
          <div className="line mt-4 sm:mt-6 pt-3 sm:pt-4">
            <p className="text-sm font-semibold text-royal">Education</p>
            <h3 className="dsp mt-1 text-xl sm:text-4xl leading-tight">
              {personalData.education.institution}
            </h3>
            <p className="mt-1 text-sm sm:text-base font-medium">
              {personalData.education.degree}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {personalData.education.period}
            </p>
          </div>
          <div className="line mt-3 sm:mt-5 pt-3 sm:pt-4">
            <p className="text-sm font-semibold text-royal">Relevant coursework</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {personalData.coursework.map((course) => (
                <li key={course} className="chip">
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="About me"
          content={<AboutDetailContent />}
        />
      </div>
    </section>
  );
};