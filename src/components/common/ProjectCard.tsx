import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { ProjectCardProps } from '../../types/project';

const bgClassMap = {
  light: 'bg-light',
  sky: 'bg-sky',
  blue: 'bg-blue',
};

const ProjectCardComponent = forwardRef<HTMLElement, ProjectCardProps>(
  ({ project, index, total, onClick }, ref) => {
    return (
      <section
        ref={ref}
        id={`p-${project.id}`}
        className={`slide ${bgClassMap[project.bg]}`}
        data-t={project.title}
        data-dk={project.bg === 'blue' ? '1' : undefined}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        <div className="wrap pwrap">
          <div className="pin grid gap-4 md:gap-10 md:grid-cols-[1fr_1.35fr] items-center">
          <div className="reveal">
            <p className="text-xs sm:text-sm font-semibold text-ink dark:text-white">
              Phase {index + 1} of {total}. {project.meta}
            </p>
            <h2
              className={`dsp mt-2 text-section-mobile sm:text-section-desktop lg:text-section-large ${
                project.title.length > 9 ? 'md:text-[clamp(2.4rem,5.6vw,5.5rem)]' : ''
              }`}
            >
              {project.title}
            </h2>
            <p className="mt-2 text-sm sm:text-base opacity-75">{project.sub}</p>
            <p className="mt-3 text-base sm:text-xl font-bold max-w-xs tracking-tight leading-snug">
              {project.tag}
            </p>
          </div>
          <div
            className={`reveal ${
              project.bg === 'blue'
                ? '[&_.chip]:text-white [&_a]:text-white [&_li]:marker:text-white/60'
                : ''
            }`}
          >
            <div className="full">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.techStack.slice(0, 4).map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>
              <ul className="space-y-1.5 text-[13px] sm:text-[15px] list-disc pl-5 marker:text-royal">
                {project.fullDescription
                  .split('\n')
                  .filter(Boolean)
                  .map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
              </ul>
              {project.githubUrl && (
                <a
                  className="underline-anim mt-3 inline-block font-semibold text-sm text-royal"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(project.githubUrl).hostname} ↗
                </a>
              )}
            </div>
            <div className="sumv md:hidden">
              <p className="text-[15px] leading-relaxed">{project.shortOverview}</p>
              <ul className="sumc mt-3 flex flex-wrap gap-1.5">
                {project.techStack.slice(0, 4).map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn-more mt-5"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                Lihat detail
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
          </div>
          </div>
        </div>
      </section>
    );
  }
);

export const ProjectCard = ProjectCardComponent as ForwardRefExoticComponent<
  RefAttributes<HTMLElement> & ProjectCardProps
>;