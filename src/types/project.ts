export interface Project {
  id: string;
  title: string;
  shortOverview: string;
  fullDescription: string;
  techStack: string[];
  screenshots: string[];
  demoUrl?: string;
  githubUrl?: string;
  meta: string;
  sub: string;
  tag: string;
  bg: 'light' | 'sky' | 'blue';
}

export interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  onClick: () => void;
}