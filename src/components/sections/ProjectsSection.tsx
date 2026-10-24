import { FC, useState } from 'react';
import { projectsData } from '../../data/projectsData';
import { Modal, ProjectDetailContent } from '../../components/common/Modal';
import { FlowArrow } from '../../components/common/FlowArrow';

type ProjectItem = typeof projectsData[0];

/* Variasi tema per project: light (putih) / sky (biru muda) / blue (biru solid) */
const THEME = {
  light: {
    section: 'bg-light text-slate-900',
    title: 'text-[#2563eb]',
    tag: 'text-slate-500',
    label: 'text-slate-400',
    value: 'text-slate-900',
    desc: 'text-slate-500',
    divider: 'border-slate-200',
    cta: 'text-slate-900',
    detailBtn:
      'border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white focus-visible:bg-[#2563eb] focus-visible:text-white',
  },
  sky: {
    section: 'bg-sky text-slate-900',
    title: 'text-[#2563eb]',
    tag: 'text-slate-500',
    label: 'text-slate-400',
    value: 'text-slate-900',
    desc: 'text-slate-600',
    divider: 'border-[#2563eb]/20',
    cta: 'text-slate-900',
    detailBtn:
      'border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white focus-visible:bg-[#2563eb] focus-visible:text-white',
  },
  blue: {
    section: 'bg-blue text-white',
    title: 'text-white',
    tag: 'text-white/70',
    label: 'text-white/60',
    value: 'text-white',
    desc: 'text-white/80',
    divider: 'border-white/30',
    cta: 'text-white',
    detailBtn:
      'border-white text-white hover:bg-white hover:text-[#2563eb] focus-visible:bg-white focus-visible:text-[#2563eb]',
  },
} as const;

/* "Personal project, Aug 2026 – Present" -> { category, period } */
const splitMeta = (meta: string) => {
  const i = meta.indexOf(',');
  if (i === -1) return { category: meta, period: '' };
  return { category: meta.slice(0, i).trim(), period: meta.slice(i + 1).trim() };
};

const ArrowRight: FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="transition-transform duration-200 group-hover:translate-x-1"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ProjectRow: FC<{
  project: ProjectItem;
  index: number;
  onOpen: () => void;
}> = ({ project, index, onOpen }) => {
  const t = THEME[project.bg];
  const { category, period } = splitMeta(project.meta);
  const number = String(index + 1).padStart(2, '0');
  const ctaUrl = project.githubUrl ?? project.demoUrl;
  const ctaLabel = project.githubUrl ? 'View Repository' : 'Live Demo';

  return (
    <section
      id={`p-${project.id}`}
      className={`slide ${t.section}`}
      data-t={project.title}
      data-dk={project.bg === 'blue' ? '1' : undefined}
    >
      {/* pwrap memberi ruang di kiri untuk line art (FlowArrow) */}
      <div className="wrap pwrap">
        <article
          className={`reveal grid grid-cols-1 gap-6 border-b pb-8 md:min-h-[min(68svh,34rem)] md:grid-cols-12 md:gap-8 md:pb-10 ${t.divider}`}
        >
          {/* Mobile: tag di paling atas */}
          <p className={`font-mono text-[11px] uppercase tracking-wider md:hidden ${t.tag}`}>
            [{number}] {category}
          </p>

          {/* Kiri: judul raksasa */}
          <div className="flex flex-col justify-between gap-4 md:col-span-7">
            <p className={`hidden font-mono text-xs uppercase tracking-wider md:block ${t.tag}`}>
              {project.sub}
            </p>
            <h2
              className={`break-words font-display text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl md:text-7xl lg:text-8xl ${t.title}`}
            >
              {project.title}
            </h2>
          </div>

          {/* Kanan: metadata & deskripsi */}
          <div className="flex flex-col justify-between gap-6 md:col-span-5 md:gap-8 md:pl-6">
            <p
              className={`hidden text-right font-mono text-xs uppercase tracking-wider md:block ${t.tag}`}
            >
              [{number}] {category}
            </p>

            <div className="space-y-4 md:space-y-5">
              <div>
                <p className={`font-mono text-[11px] uppercase tracking-wider ${t.label}`}>
                  Tech Stack / Architecture
                </p>
                <p className={`mt-1 text-sm font-semibold leading-snug md:text-base ${t.value}`}>
                  {project.techStack.join(', ')}
                </p>
              </div>

              {period && (
                <div>
                  <p className={`font-mono text-[11px] uppercase tracking-wider ${t.label}`}>
                    Period
                  </p>
                  <p className={`mt-1 text-sm font-semibold md:text-base ${t.value}`}>{period}</p>
                </div>
              )}

              <p className={`max-w-md text-sm leading-relaxed md:text-[15px] ${t.desc}`}>
                {project.shortOverview}
              </p>
            </div>

            {/* Aksi: tombol Lihat Detail (mobile & desktop) + link repo/demo */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={onOpen}
                className={`group inline-flex items-center gap-2 rounded-full border-[1.5px] px-5 py-2 text-sm font-semibold transition-colors duration-200 md:text-base ${t.detailBtn}`}
              >
                Lihat Detail
                <ArrowRight />
              </button>

              {ctaUrl && (
                <a
                  href={ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline md:text-base ${t.cta}`}
                >
                  {ctaLabel}
                  <ArrowRight />
                </a>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export const ProjectsSection: FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpen = (project: ProjectItem) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <>
      <div id="projects" className="relative">
        {/* Line art alur antar project */}
        <FlowArrow />

        {projectsData.map((project, index) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={index}
            onOpen={() => handleOpen(project)}
          />
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProject(null);
        }}
        title={selectedProject?.title ?? ''}
        content={selectedProject ? <ProjectDetailContent project={selectedProject} /> : null}
      />
    </>
  );
};