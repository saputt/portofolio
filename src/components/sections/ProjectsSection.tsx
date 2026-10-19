import { FC, useState } from 'react';
import { projectsData } from '../../data/projectsData';
import { ProjectCard } from '../../components/common/ProjectCard';
import { Modal, ProjectDetailContent } from '../../components/common/Modal';
import { FlowArrow } from '../../components/common/FlowArrow';

export const ProjectsSection: FC = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleProjectClick = (project: typeof projectsData[0]) => {
    if (window.innerWidth < 768) {
      setSelectedProject(project);
      setShowModal(true);
    }
  };

  return (
    <>
      <div id="projects" className="relative">
        {projectsData.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            total={projectsData.length}
            onClick={() => handleProjectClick(project)}
          />
        ))}
        <FlowArrow />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProject(null);
        }}
        title={selectedProject?.title ?? ''}
        content={selectedProject ? (
          <ProjectDetailContent project={selectedProject} />
        ) : null}
      />
    </>
  );
};