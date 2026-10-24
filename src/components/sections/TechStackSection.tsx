import { FC } from 'react';

interface TechItem {
  name: string;
  icon: string;
  role: string;
}

const techIcons = {
  Go: 'https://cdn.simpleicons.org/go/00ADD8',
  NestJS: 'https://cdn.simpleicons.org/nestjs/E0234E',

  Redis: 'https://www.svgrepo.com/show/303460/redis-logo.svg',

  Docker: 'https://cdn.simpleicons.org/docker/2496ED',

  TypeScript: 'https://cdn.simpleicons.org/typescript/3178C6',
  PostgreSQL: 'https://cdn.simpleicons.org/postgresql/4169E1',
  Prisma: 'https://cdn.simpleicons.org/prisma/2D3748',
  React: 'https://cdn.simpleicons.org/react/61DAFB',
  'Tailwind CSS': 'https://cdn.simpleicons.org/tailwindcss/06B6D4',
};

const col1Items: TechItem[] = [
  { name: 'Go', icon: techIcons.Go, role: 'Concurrent Backend Service' },
  { name: 'NestJS', icon: techIcons.NestJS, role: 'Modular API Framework' },
  { name: 'Redis', icon: techIcons.Redis, role: 'In-Memory Caching & Rate Limit' },
  { name: 'Docker', icon: techIcons.Docker, role: 'Containerized Local Services' },
];

const col2Items: TechItem[] = [
  { name: 'TypeScript', icon: techIcons.TypeScript, role: 'Typed Application Logic' },
  { name: 'PostgreSQL', icon: techIcons.PostgreSQL, role: 'Relational Database' },
  { name: 'Prisma', icon: techIcons.Prisma, role: 'Type-Safe ORM' },
  { name: 'React', icon: techIcons.React, role: 'Component-Based Frontend' },
  { name: 'Tailwind CSS', icon: techIcons['Tailwind CSS'], role: 'Utility-First Styling' },
];

const TechCard: FC<{ item: TechItem }> = ({ item }) => {
  const isSvgString = item.icon.startsWith('<svg');

  return (
    <article className="tech-card">
      <div className="icon">
        {isSvgString ? (
          <div dangerouslySetInnerHTML={{ __html: item.icon }} />
        ) : (
          <img src={item.icon} alt={item.name} width="28" height="28" className="w-7 h-7 object-contain" />
        )}
      </div>
      <h3 className="dsp mt-3 text-lg sm:text-xl tracking-tight leading-snug">
        {item.name}
      </h3>
      <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">{item.role}</p>
    </article>
  );
};

export const TechStackSection: FC = () => (
  <section className="slide bg-light" data-t="Tech stack">
    <div className="wrap h-full grid gap-3 md:grid-cols-[1fr_1fr] md:gap-14 items-center grid-rows-[auto_1fr] md:grid-rows-1 pt-5 md:pt-0">
      <div className="reveal">
        <h2 className="dsp text-display-sm sm:text-display-lg leading-tight">
          TOOLS & TECH I WORK WITH DAILY
        </h2>
        <p className="mt-3 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-md">
          A curated stack I use to build clean backend systems, handle data efficiently, and create responsive web applications.
        </p>
        <p className="mt-3 hidden sm:block text-xs text-slate-500 dark:text-slate-500 max-w-md">
          Also familiar with: JavaScript, Python, SQL, Git, React Router, Zustand, TanStack Query, Layered Architecture, Modular Monolith, Goroutines, Microservices & gRPC.
        </p>
      </div>
      <div className="vwrap h-full grid grid-cols-2 gap-3 sm:gap-4 min-h-0" aria-label="Tech stack">
        <div id="col1" className="vcol space-y-3 sm:space-y-4">
          {col1Items.map((item, i) => (
            <TechCard key={`${item.name}-${i}`} item={item} />
          ))}
          {col1Items.map((item, i) => (
            <TechCard key={`${item.name}-dup-${i}`} item={item} />
          ))}
        </div>
        <div id="col2" className="vcol dn space-y-3 sm:space-y-4 mt-10">
          {col2Items.map((item, i) => (
            <TechCard key={`${item.name}-${i}`} item={item} />
          ))}
          {col2Items.map((item, i) => (
            <TechCard key={`${item.name}-dup-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  </section>
);