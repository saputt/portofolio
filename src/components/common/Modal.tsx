import { FC, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { projectsData } from '../../data/projectsData';
import { personalData } from '../../data/personalData';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
  title: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, content, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement>(null);

  const handleClose = (e?: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement> | KeyboardEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.getElementById('snap')!.setAttribute('inert', 'true');
      setTimeout(() => backButtonRef.current?.focus({ preventScroll: true }), 60);
      window.history.pushState({ modal: true }, '');
    } else {
      document.body.style.overflow = '';
      document.getElementById('snap')!.removeAttribute('inert');
      if (triggerRef.current) {
        triggerRef.current.focus({ preventScroll: true });
      }
    }

    const handlePopState = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, onClose]);

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      id="detail"
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-hidden="false"
      aria-labelledby="dvtitle"
      className="fixed inset-0 z-[100] bg-white dark:bg-ink overflow-y-auto overscroll-contain translate-y-full invisible transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] open"
      style={{ transform: 'none', visibility: 'visible' }}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <header className="modal-header">
        <button
          ref={backButtonRef}
          id="dvback"
          type="button"
          onClick={handleClose}
          onTouchEnd={handleClose}
          className="btn-back touch-manipulation"
        >
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
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Kembali
        </button>
        <span id="dvtitle" className="font-bold text-base truncate">
          {title}
        </span>
      </header>
      <div id="dvc" className="modal-body">
        {content}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

interface ProjectDetailProps {
  project: typeof projectsData[0];
}

export const ProjectDetailContent: FC<ProjectDetailProps> = ({ project }) => {
  const shots = project.screenshots.length > 0 ? (
    project.screenshots.map((src, i) => (
      <figure key={i} className="shot">
        <img src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
      </figure>
    ))
  ) : (
    <div className="placeholder-img">Screenshot coming soon</div>
  );

  return (
    <>
      <p className="text-sm font-semibold text-royal">{project.meta}</p>
      <h2 className="dsp mt-2 text-heading-mobile sm:text-heading-desktop">{project.title}</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{project.sub}</p>
      <p className="mt-3 text-lg font-bold tracking-tight leading-snug">
        {project.tag}
      </p>
      <div className="line mt-6 pt-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.techStack.map((tech) => (
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
      <h3 className="mt-8 text-sm font-semibold text-royal">Screenshots</h3>
      <div className="screenshots mt-3">{shots}</div>
    </>
  );
};

export const AboutDetailContent: FC = () => (
  <>
    <h2 className="dsp text-heading-mobile sm:text-heading-desktop">About me</h2>
    <div className="mt-5 space-y-4">
      <p className="text-[14px] sm:text-lg leading-relaxed max-w-prose">
        {personalData.fullBio}
      </p>
      <div className="line pt-3">
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
      <div className="line pt-3">
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
  </>
);