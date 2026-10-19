export interface EventHighlight {
  id: string;
  title: string;
  image: string;
  date: string;
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  role: string;
  period: string;
  description: string[];
  type: 'community' | 'program';
}