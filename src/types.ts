export type AppMode = 'ecosystem' | 'prep';

export type UserRole = 'student' | 'teacher' | 'company';

export type EcosystemView = 
  | 'landing'
  | 'home'
  | 'discover-projects'
  | 'discover-talent'
  | 'discover-companies'
  | 'discover-opportunities'
  | 'project-detail'
  | 'student-profile'
  | 'collab'
  | 'company-profile'
  | 'opportunity-detail'
  | 'squads-progress'
  | 'teacher-company-portal'
  | 'community-forum'
  | 'global-analytics';

export type PrepView = 
  | 'hub'
  | 'arena'
  | 'review'
  | 'library'
  | 'system-architect';

export interface Student {
  id: string;
  name: string;
  role: string;
  title: string;
  avatar: string;
  verified: boolean;
  available: boolean;
  statusText?: string;
  about: string;
  skills: string[];
  projectsCount: number;
  projects?: ProjectSummary[];
  links?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface ProjectSummary {
  id: string;
  title: string;
  description: string;
  type: string;
  image: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Web' | 'Mobile' | 'AI/ML' | 'Design' | 'Data Science';
  status: 'Validated' | 'In Development' | 'Completed';
  image: string;
  creator: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  problem: string;
  solution: string;
  keyFeatures: string[];
  contribution: string;
  technologies: string[];
  gallery: string[];
  liveDemoUrl?: string;
  githubUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  location: string;
  verified: boolean;
  activeRolesCount: number;
  founded: string;
  companySize: string;
  about: string;
  website: string;
  saved?: boolean;
}

export interface Opportunity {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  type: 'Internship' | 'Full-time' | 'Freelance' | 'Part-time';
  location: string;
  duration: string;
  stipend: string;
  tags: string[];
  overview: string;
  requirements: {
    techStack: string[];
    coreCompetencies: string[];
  };
  processSteps: {
    step: number;
    title: string;
    subtitle: string;
    completed?: boolean;
    current?: boolean;
  }[];
  benefits: {
    icon: string;
    title: string;
    description: string;
  }[];
  hiringManager: {
    name: string;
    role: string;
    avatar: string;
  };
}

export interface CollabPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  phase: string;
  title: string;
  description: string;
  tags: string[];
  likes?: number;
  interestedCount?: number;
  userInterested?: boolean;
}

export interface PrepSession {
  id: string;
  dateMonth: string;
  dateDay: string;
  title: string;
  timeRange: string;
  type: 'behavioral' | 'technical';
  linkAvailable: boolean;
}

export interface LibraryResource {
  id: string;
  section: 'technical' | 'behavioral' | 'company';
  category: string;
  title: string;
  duration: string;
  completed: boolean;
  image?: string;
  icon?: string;
  companyInitial?: string;
  contentSnippet?: string;
}

export interface MockQuestion {
  id: string;
  number: number;
  total: number;
  category: string;
  question: string;
  focusAreas: string[];
  expectedKeywords: string[];
  sampleAnswerHint: string;
  starterCode?: string;
  codeLanguage?: string;
  testCases?: { input: string; expected: string; description: string }[];
}

export interface RubricCategory {
  score: number;
  comment: string;
}

export interface InterviewEvaluation {
  id?: string;
  timestamp?: string;
  questionTitle: string;
  category: string;
  overallScore: number;
  grade: string;
  rubric: {
    technicalAccuracy: RubricCategory;
    communicationClarity: RubricCategory;
    problemSolving: RubricCategory;
    codeQualityOrStructure: RubricCategory;
  };
  strengths: string[];
  areasForImprovement: string[];
  modelIdealAnswer: string;
  followUpQuestion: string;
  recruiterReadinessVerdict: string;
  transcriptSnippet?: string;
  codeSnippet?: string;
}

export interface CandidateVerifiedReport {
  studentName: string;
  role: string;
  verifiedBadgeId: string;
  issueDate: string;
  overallScore: number;
  sessionsCompleted: number;
  executiveSummary: string;
  keyCompetencies: string[];
  recruiterNotes: string;
  evaluations: InterviewEvaluation[];
}

export interface ProjectSquadTask {
  id: string;
  title: string;
  assignedTo: string;
  assignedAvatar: string;
  role: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
}

export interface ProjectSquadMilestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
}

export interface ProjectSquad {
  id: string;
  projectTitle: string;
  description: string;
  phase: 'Ideation' | 'Prototyping' | 'Growth' | 'Validated';
  leadName: string;
  leadAvatar: string;
  members: {
    name: string;
    role: string;
    avatar: string;
  }[];
  tasks: ProjectSquadTask[];
  milestones: ProjectSquadMilestone[];
  progressPercentage: number;
}


