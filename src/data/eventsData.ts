import type { EventHighlight, Experience } from '../types/event';

export const eventHighlights: EventHighlight[] = [
  {
    id: 'event-1',
    title: 'Unikom Codelabs',
    image: '/assets/images/events/event-1.webp',
    date: '2026',
    description: 'Community event highlights',
  },
  {
    id: 'event-2',
    title: 'COMPFEST 18',
    image: '/assets/images/events/event-2.webp',
    date: '2026',
    description: 'Program event highlights',
  },
];

export const experiences: Experience[] = [
  {
    id: 'unikom-codelabs',
    title: 'Unikom Codelabs',
    role: 'Backend Division Member',
    period: 'Mar 2026 – Present',
    description: [
      'Conduct independent research and project-based exploration of backend development and software development practices.',
      'Explore backend architecture and maintainable code practices through personal projects and technical experimentation.',
      'Participate in technical discussions, knowledge-sharing sessions, and software development activities within the technical community.',
    ],
    type: 'community',
  },
  {
    id: 'compfest-18',
    title: 'COMPFEST 18',
    role: 'Software Engineering Mentee',
    period: 'Jul 2026 – Aug 2026',
    description: [
      'Selected for the Software Engineering Academy through a competitive selection process and completed structured software engineering training and mentoring.',
      'Learned software development practices across the SDLC, testing, deployment, and application security.',
      'Applied software engineering practices through team-based case studies, including a POS platform scaling project.',
    ],
    type: 'program',
  },
];