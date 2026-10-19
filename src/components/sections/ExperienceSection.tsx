import { FC } from 'react';
import { experiences } from '../../data/eventsData';

interface ExperienceCardProps {
  experience: typeof experiences[0];
  index: number;
}

const ExperienceCard: FC<ExperienceCardProps> = ({ experience, index }) => {
  const isBlue = index === 0;

  return (
    <section
      className={`slide ${isBlue ? 'bg-blue' : 'bg-sky'}`}
      data-t={experience.title}
      data-dk={isBlue ? '1' : undefined}
    >
      <div className="wrap grid gap-5 md:grid-cols-[1fr_1.25fr] md:gap-14 items-center">
        <div className="reveal">
          <p className="text-sm sm:text-base font-semibold text-white/85">
            Experience {index + 1} of {experiences.length}. {experience.type === 'community' ? 'Community' : 'Program'}
          </p>
          <h2 className="dsp mt-3 text-section-mobile sm:text-section-desktop lg:text-section-large">{experience.title}</h2>
          <p className="mt-4 text-lg sm:text-2xl font-bold tracking-tight">
            {experience.role}
          </p>
          <p className={`mt-1 text-sm sm:text-lg font-medium ${isBlue ? 'text-white/80' : 'text-slate-600'}`}>
            {experience.period}
          </p>
        </div>
        <div className="reveal line pt-4 sm:pt-6">
          <p className={`text-sm font-semibold ${isBlue ? 'text-white/85' : 'text-royal'}`}>What I did</p>
          <ul className="mt-3 sm:mt-5 space-y-3 sm:space-y-5 list-disc pl-5 marker:text-white/60 text-[14px] sm:text-xl leading-relaxed">
            {experience.description.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export const ExperienceSection: FC = () => (
  <>
    {experiences.map((exp, i) => (
      <ExperienceCard key={exp.id} experience={exp} index={i} />
    ))}
  </>
);