import { FC } from 'react';
import { personalData } from '../../data/personalData';

export const Footer: FC = () => (
  <footer className="py-6 text-center text-sm font-medium text-[var(--text-muted)]">
    <p>© 2026 {personalData.name}</p>
  </footer>
);