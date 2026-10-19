import type { Project } from '../types/project';

export const projectsData: Project[] = [
  {
    id: 'ecco',
    title: 'ECCO',
    shortOverview: 'E-commerce backend with REST APIs for product, auth, inventory, order, and payment, plus Redis-based stock handling for flash sales.',
    fullDescription: `Built an e-commerce backend using TypeScript, NestJS, PostgreSQL, Prisma, and Redis.
Developed RESTful APIs and database structures for product, authentication, inventory, order, and payment workflows.
Implemented Redis-based stock handling for flash-sale scenarios and explored service-to-service communication using gRPC.
Used Docker Compose to run backend services locally while exploring service boundaries and modular architecture.`,
    techStack: ['TypeScript', 'NestJS', 'PostgreSQL', 'Prisma', 'Redis', 'Docker Compose', 'gRPC (exploring)'],
    screenshots: [],
    githubUrl: 'https://github.com/saputt/Ecco',
    demoUrl: undefined,
    meta: 'Personal project, Aug 2026 – Present',
    sub: 'Ecommerce backend',
    tag: 'Flash-sale stock handling with Redis.',
    bg: 'light',
  },
  {
    id: 'matching-job',
    title: 'Matching-Job',
    shortOverview: 'Full-stack job matching platform with concurrent Go scraping (goroutines, worker pools, Playwright) served through a NestJS backend.',
    fullDescription: `Built a full-stack job matching platform using Go, NestJS, and React, integrating job data collection with backend APIs and frontend workflows.
Implemented concurrent web scraping using Go goroutines, worker pools, and Playwright, with scraped data persisted in PostgreSQL using GORM.
Developed backend data management with NestJS, Prisma, and PostgreSQL, with a separate FastAPI service as part of the application stack.`,
    techStack: ['Go', 'NestJS', 'React', 'Playwright', 'PostgreSQL', 'GORM', 'Prisma', 'FastAPI'],
    screenshots: [],
    githubUrl: undefined,
    demoUrl: undefined,
    meta: 'Personal project, Apr 2026 – Jul 2026',
    sub: 'Job matching platform',
    tag: 'Concurrent scraping in Go, served through NestJS.',
    bg: 'sky',
  },
  {
    id: 'kpos',
    title: 'KPOS',
    shortOverview: 'Backend modules for inventory and checkout in a modular monolith, with Redis caching and database access optimization.',
    fullDescription: `Developed backend modules for inventory and sales/checkout workflows using NestJS.
Contributed to Redis caching and database access optimization for backend workloads.
Collaborated with teammates on modular application design and implementation trade-offs.`,
    techStack: ['NestJS', 'Redis', 'Modular Monolith'],
    screenshots: [],
    githubUrl: 'https://github.com/TeamOneee/pos-project-be',
    demoUrl: undefined,
    meta: 'Team project, Jul 2026 – Aug 2026',
    sub: 'POS platform scaling case study',
    tag: 'A modular monolith, scaled with caching.',
    bg: 'blue',
  },
  {
    id: 'tiber',
    title: 'TIBER',
    shortOverview: 'Frontend for a diabetes care app focused on medication routines and treatment adherence, built with React and TanStack Query.',
    fullDescription: `Developed frontend features for a healthcare application focused on medication routines and treatment adherence.
Defined API contracts with backend teammates to support parallel development and integration.
Built interfaces using React and Tailwind CSS, with Zustand for client state and TanStack Query for server state.`,
    techStack: ['React', 'Tailwind CSS', 'Zustand', 'TanStack Query'],
    screenshots: ['/src/assets/images/projects/tiber.webp'],
    githubUrl: undefined,
    demoUrl: undefined,
    meta: 'Team project, Feb 2026 – Apr 2026',
    sub: 'Diabetes care app. Supporting frontend',
    tag: 'Medication routines, kept on track.',
    bg: 'light',
  },
  {
    id: 'panggilaja',
    title: 'PanggilAja',
    shortOverview: 'Frontend for a marketplace connecting users with nearby local service providers, built with React and Zustand.',
    fullDescription: `Developed frontend features for a marketplace connecting users with nearby service providers.
Collaborated with backend developers to integrate features and coordinate API and data requirements.
Built the frontend using React, React Router, Zustand, and Tailwind CSS.`,
    techStack: ['React', 'React Router', 'Zustand', 'Tailwind CSS'],
    screenshots: [],
    githubUrl: undefined,
    demoUrl: undefined,
    meta: 'Team project, Oct 2025 – Dec 2025',
    sub: 'Local service marketplace. Supporting frontend',
    tag: 'Connecting people with nearby providers.',
    bg: 'sky',
  },
];