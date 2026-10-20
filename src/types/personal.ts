export interface PersonalInfo {
  name: string;
  role: string;
  bio: string;
  fullBio: string;
  socials: Record<string, string>;
  education: {
    institution: string;
    degree: string;
    field: string;
    period: string;
  };
  coursework: string[];
  traits: string[];
  profileImage: string;
}