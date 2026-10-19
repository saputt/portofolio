import type { PersonalInfo } from '../types/personal';

export const personalData: PersonalInfo = {
  name: 'Sauki Putra Raffita',
  role: 'Backend Developer',
  bio: 'Computer Science student who likes maintainable code.',
  fullBio: 'Computer Science student at Universitas Komputer Indonesia with hands-on experience building web applications through personal and team projects. Familiar with TypeScript, React, Node.js, Go, and relational databases. Interested in writing maintainable code, solving engineering problems, and collaborating with experienced engineers to build reliable software while continuously improving technical skills.',
  socials: {
    email: 'sauki666indo@gmail.com',
    phone: '+62 896-5531-2823',
    location: 'Bandung, Indonesia',
    github: 'https://github.com/saputt',
    // TODO: ganti USERNAME dengan username asli kamu
    linkedin: 'https://www.linkedin.com/in/USERNAME',
    instagram: 'https://www.instagram.com/USERNAME',
  },
  education: {
    institution: 'Universitas Komputer Indonesia',
    degree: 'Bachelor of Computer Science',
    field: 'Computer Science',
    period: 'Oct 2024 – Present, expected graduation 2028',
  },
  coursework: [
    'Algorithms',
    'Data Structures',
    'Clean Code',
    'Object-Oriented Programming',
    'Database',
    'Design Patterns',
  ],
  profileImage: '/assets/images/profile.webp',
};