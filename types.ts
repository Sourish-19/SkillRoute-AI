
export interface StudentProfile {
  name: string;
  location: string;
  education: string;
  skills: string[];
  interests: string[];
  internetAccess: 'Low' | 'Moderate' | 'High';
  preferredLanguage: string;
  avatar?: string;
  theme?: 'dark' | 'light';
}

export interface RoadmapStep {
  week: number;
  topic: string;
  description: string;
  tasks: string[];
  resourceType: 'Local' | 'Online' | 'Community';
}

export interface Roadmap {
  goal: string;
  durationWeeks: number;
  steps: RoadmapStep[];
}

export interface LocalOpportunity {
  id: string;
  title: string;
  company: string;
  type: 'Internship' | 'NGO' | 'Small Business' | 'Freelance';
  location: string;
  matchScore: number;
  description: string;
  requirements?: string[];
  stipend?: string;
  duration?: string;
}

export interface SkillMetric {
  name: string;
  value: number;
  change: number;
}
