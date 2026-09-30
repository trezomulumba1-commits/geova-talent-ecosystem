import { Student, Project, Company, Opportunity, CollabPost, PrepSession, LibraryResource, MockQuestion, ProjectSquad } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'alex-mwansa',
    name: 'Alex Mwansa',
    role: 'Frontend Developer & UI Specialist',
    title: 'Frontend Developer & UI Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    verified: true,
    available: true,
    statusText: 'Available for opportunities',
    about: 'Passionate about crafting intuitive and accessible user interfaces. Bridging the gap between design and engineering to build products that look great and function seamlessly. Experienced in React, Vue, and modern CSS frameworks, with a strong focus on component-driven architecture.',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Vue.js', 'UI/UX Design', 'Web Accessibility'],
    projectsCount: 8,
    projects: [
      {
        id: 'ecotrack',
        title: 'EcoTrack Dashboard',
        description: 'A comprehensive dashboard for tracking personal carbon footprints with real-time data visualization and gamified sustainability challenges.',
        type: 'Web App',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
      },
      {
        id: 'mediconnect',
        title: 'MediConnect App',
        description: 'Accessible patient portal app focusing on clear typography and high contrast for elderly users navigating their healthcare records.',
        type: 'Mobile UI',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
      }
    ],
    links: {
      github: 'https://github.com/alexmwansa',
      linkedin: 'https://linkedin.com/in/alexmwansa',
      website: 'https://alexmwansa.dev',
    }
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Product Designer',
    title: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    verified: true,
    available: true,
    statusText: 'Available',
    about: 'Specializing in design systems, micro-interactions, and human-centered design for fintech and consumer mobile apps.',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'User Research'],
    projectsCount: 8,
    links: {
      github: 'https://github.com/marcusdesign',
      linkedin: 'https://linkedin.com/in/marcuschen',
      website: 'https://marcuschen.studio',
    }
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Full-stack Eng',
    title: 'Full-stack Eng',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    verified: true,
    available: false,
    statusText: 'Busy',
    about: 'Building resilient backend APIs and reactive frontend applications. Passionate about PostgreSQL query tuning and microservices.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker', 'GraphQL'],
    projectsCount: 12,
    links: {
      github: 'https://github.com/sarahjenkins',
      linkedin: 'https://linkedin.com/in/sarahjenkins-dev',
    }
  },
  {
    id: 'david-osei',
    name: 'David Osei',
    role: 'Data Scientist',
    title: 'Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    verified: true,
    available: true,
    statusText: 'Available',
    about: 'Predictive modeling, deep learning architectures, and big data pipelines for NLP and computer vision.',
    skills: ['Python', 'Machine Learning', 'SQL', 'PyTorch', 'Pandas', 'Scikit-Learn'],
    projectsCount: 5,
    links: {
      github: 'https://github.com/davidosei',
      linkedin: 'https://linkedin.com/in/davidosei',
    }
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    role: 'Growth Marketer',
    title: 'Growth Marketer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    verified: false,
    available: true,
    statusText: 'Available',
    about: 'Data-informed user acquisition, SEO architecture, conversion rate optimization, and brand storytelling.',
    skills: ['SEO', 'Analytics', 'Strategy', 'Growth Marketing', 'Copywriting'],
    projectsCount: 10,
    links: {
      linkedin: 'https://linkedin.com/in/elenarodriguez-growth',
    }
  },
  {
    id: 'david-chen',
    name: 'David Chen',
    role: 'Data Scientist',
    title: 'Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    verified: false,
    available: true,
    statusText: 'Available',
    about: 'Machine learning specialist focusing on time-series analysis and distributed computational graphs.',
    skills: ['Python', 'R', 'TensorFlow', 'Spark', 'SQL'],
    projectsCount: 6,
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'visionary-crm',
    title: 'Visionary CRM',
    tagline: 'An enterprise customer relationship management platform providing predictive analytics and automated pipeline insights.',
    category: 'Data Science',
    status: 'Validated',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    creator: {
      name: 'Jordan Smith',
      role: 'Full Stack Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    },
    tags: ['Python', 'PyTorch', 'React', 'PostgreSQL', 'Tailwind CSS', 'D3.js'],
    problem: 'Modern sales teams struggle with data overload and fail to identify high-value leads buried in fragmented CRM systems.',
    solution: 'Visionary CRM uses predictive algorithms to prioritize leads, forecast deal closure probability, and automate follow-up workflows.',
    keyFeatures: [
      'Predictive Lead Scoring with 94% accuracy',
      'Automated Multi-stage Email Sequences',
      'Real-time Sales Forecasting with Confidence Intervals',
      'Integration with Major Communication & Productivity Tools'
    ],
    contribution: 'Led the development of the predictive scoring engine and built the interactive dashboard visualizations using React and D3.js. Focused on optimizing performance for large datasets and ensuring a responsive, accessible user interface.',
    technologies: ['Python', 'PyTorch', 'React', 'PostgreSQL', 'Tailwind CSS', 'D3.js'],
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://visionary-crm-demo.example.com',
    githubUrl: 'https://github.com/jordansmith/visionary-crm',
  },
  {
    id: 'swiftpay-wallet',
    title: 'SwiftPay Wallet',
    tagline: 'A decentralized mobile wallet focusing on seamless cross-border micro-payments and user-friendly key management.',
    category: 'Mobile',
    status: 'In Development',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    creator: {
      name: 'Amara Okafor',
      role: 'Mobile Systems Developer',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    },
    tags: ['Solidity', 'Flutter', 'Firebase', 'Web3.dart'],
    problem: 'Cross-border remittance fees remain exorbitant with confusing cryptographic public/private key experiences for everyday users.',
    solution: 'SwiftPay abstracts gas fees and replaces seed phrases with biometric social recovery contracts for instant 0.1% fee micro-transactions.',
    keyFeatures: [
      'Biometric Multi-party Computation Key Vault',
      'Instant Zero-gas Cross-border Settlement',
      'Fiat-to-Crypto On-ramps with Local Payment Methods',
      'Contact-based QR Transfers'
    ],
    contribution: 'Designed and deployed smart contracts with ERC-4337 account abstraction, built the cross-platform Flutter UI with smooth interactive micro-animations.',
    technologies: ['Solidity', 'Flutter', 'Firebase', 'Ethers.js', 'Node.js'],
    gallery: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://swiftpay.app',
    githubUrl: 'https://github.com/amaraokafor/swiftpay-wallet',
  },
  {
    id: 'ai-task-manager',
    title: 'SprintSync Task Engine',
    tagline: 'Empowering engineering teams from idea to shipping with automated sprint breakdowns and dependency tracking.',
    category: 'Web',
    status: 'Validated',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    creator: {
      name: 'Jane Doe',
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    },
    tags: ['React', 'Node.js', 'Python', 'FastAPI'],
    problem: 'Engineering teams struggle to estimate task scope, distribute workloads fairly, and ship on schedule.',
    solution: 'An agile task orchestration platform that analyzes repository commits, suggests next sprint items, and surfaces blockers before they occur.',
    keyFeatures: [
      'Automated Pull Request Code Summaries',
      'Dynamic Velocity Tracker',
      'Skill Gap Analyzer for Team Recruiting',
      'Interactive Kanban with Milestone Estimation'
    ],
    contribution: 'Architected the React frontend and real-time WebSocket communication layer between team members.',
    technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS'],
    gallery: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
    ],
    liveDemoUrl: 'https://sprintsync.dev',
    githubUrl: 'https://github.com/janedoe/sprintsync-engine',
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'nebula-ai',
    name: 'Nebula Systems',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    industry: 'Distributed Systems & ML',
    location: 'San Francisco, CA',
    verified: true,
    activeRolesCount: 3,
    founded: '2018',
    companySize: '50–200',
    about: 'Nebula Systems is a leading innovator in high-throughput distributed systems and machine learning infrastructure. We build high-resilience computing platforms for global enterprise clients.\n\nOur team of data scientists and systems engineers collaborate to build robust, scalable infrastructure that empowers enterprises to process streaming telemetry with microsecond latency.',
    website: 'https://nebulasystems.example.com',
    saved: false,
  },
  {
    id: 'finflow',
    name: 'FinFlow',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80',
    industry: 'Financial Services',
    location: 'Remote',
    verified: false,
    activeRolesCount: 1,
    founded: '2020',
    companySize: '20–50',
    about: 'FinFlow delivers next-generation embedded banking tools, real-time treasury analytics, and modern payment APIs for fast-scaling startups.',
    website: 'https://finflow.example.com',
    saved: true,
  },
  {
    id: 'healthsync',
    name: 'HealthSync',
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&auto=format&fit=crop&q=80',
    industry: 'Healthtech',
    location: 'Boston, MA',
    verified: true,
    activeRolesCount: 5,
    founded: '2019',
    companySize: '100–500',
    about: 'HealthSync bridges patient telemetry, electronic health records, and predictive diagnostics into unified clinical intelligence dashboards.',
    website: 'https://healthsync.example.com',
    saved: false,
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'ml-intern-nebula',
    companyId: 'nebula-ai',
    companyName: 'Nebula Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    title: 'Machine Learning Engineering Intern',
    type: 'Internship',
    location: 'Remote',
    duration: '3–6 Months',
    stipend: '$5k – $7k / month',
    tags: ['Python', 'PyTorch', 'SQL', 'Git', 'TensorFlow'],
    overview: 'As a Machine Learning Intern at Nebula Systems, you will be embedded directly into our core infrastructure team, working alongside senior engineers to develop high-throughput predictive models. We believe in "Visibility of Skill," meaning your contributions will be quantifiable and directly impact our production systems.\n\nA typical day involves data pipeline optimization, benchmark tuning, and collaborating with cross-functional teams to translate research into scalable features.',
    requirements: {
      techStack: ['Python', 'PyTorch', 'SQL', 'Git', 'TensorFlow'],
      coreCompetencies: [
        'Strong analytical and problem-solving abilities',
        'Effective communication of complex technical concepts',
        'Self-directed learner with a bias for action'
      ]
    },
    processSteps: [
      { step: 1, title: 'Applied', subtitle: 'Submit portfolio', current: true },
      { step: 2, title: 'Technical', subtitle: 'Live coding & ML design' },
      { step: 3, title: 'Culture Fit', subtitle: 'Meet the team' },
      { step: 4, title: 'Offer', subtitle: 'Welcome aboard' }
    ],
    benefits: [
      {
        icon: 'payments',
        title: 'Competitive Stipend',
        description: '$5k – $7k / month'
      },
      {
        icon: 'supervisor_account',
        title: 'Direct Mentorship',
        description: '1:1 with Senior ML Engineers'
      },
      {
        icon: 'schedule',
        title: 'Flexible Hours',
        description: 'Work when you are most productive'
      }
    ],
    hiringManager: {
      name: 'Sarah Jenkins',
      role: 'Head of Engineering',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
    }
  },
  {
    id: 'data-science-grad-nebula',
    companyId: 'nebula-ai',
    companyName: 'Nebula Systems',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    title: 'Data Science Graduate',
    type: 'Full-time',
    location: 'San Francisco',
    duration: 'Permanent',
    stipend: '$110k – $130k / year',
    tags: ['SQL', 'R', 'Statistics', 'Python'],
    overview: 'Join our research team to build production recommendation engines and predictive churn modeling pipelines for enterprise partners.',
    requirements: {
      techStack: ['SQL', 'R', 'Python', 'Statistical Modeling'],
      coreCompetencies: ['Experimental design', 'A/B testing methodology', 'Clear data visualization']
    },
    processSteps: [
      { step: 1, title: 'Applied', subtitle: 'Resume & code sample', current: true },
      { step: 2, title: 'Take Home', subtitle: 'Modeling case study' },
      { step: 3, title: 'Panel Review', subtitle: 'Present findings to team' },
      { step: 4, title: 'Offer', subtitle: 'Join full-time' }
    ],
    benefits: [
      { icon: 'payments', title: 'Competitive Compensation', description: '$110k - $130k + Equity' },
      { icon: 'health_and_safety', title: 'Comprehensive Health', description: 'Medical, Dental, Vision 100% covered' }
    ],
    hiringManager: {
      name: 'Jordan Smith',
      role: 'VP of Data Science',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
    }
  }
];

export const INITIAL_COLLABS: CollabPost[] = [
  {
    id: 'collab-1',
    authorName: 'Elena Rodriguez',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    phase: 'Ideation Phase',
    title: 'Sustainable Supply Chain Tracker',
    description: 'Building an immutable tracking system for ethical sourcing. Need technical co-founders to help design the distributed architecture.',
    tags: ['Blockchain Dev', 'System Arch'],
    interestedCount: 7,
    userInterested: false
  },
  {
    id: 'collab-2',
    authorName: 'Marcus Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    phase: 'Prototyping Phase',
    title: 'FinTech App for Gen Z',
    description: 'We have the backend working, need a product designer to craft an intuitive, high-engagement mobile interface.',
    tags: ['UI Designer', 'UX Researcher'],
    interestedCount: 14,
    userInterested: false
  },
  {
    id: 'collab-3',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    phase: 'Growth Phase',
    title: 'High-Throughput Content Moderation API',
    description: 'Looking for mobile and systems devs to help build client SDKs for our real-time filtering engine.',
    tags: ['iOS Dev', 'Systems Eng'],
    interestedCount: 9,
    userInterested: false
  }
];

export const INITIAL_PREP_SESSIONS: PrepSession[] = [
  {
    id: 'session-1',
    dateMonth: 'Oct',
    dateDay: '24',
    title: 'Behavioral Mock Interview',
    timeRange: '2:00 PM - 3:00 PM',
    type: 'behavioral',
    linkAvailable: true
  },
  {
    id: 'session-2',
    dateMonth: 'Oct',
    dateDay: '26',
    title: 'Technical Whiteboarding',
    timeRange: '10:00 AM - 11:30 AM',
    type: 'technical',
    linkAvailable: false
  }
];

export const INITIAL_LIBRARY_RESOURCES: LibraryResource[] = [
  {
    id: 'lib-1',
    section: 'technical',
    category: 'Algorithms',
    title: 'Graph Traversal & BFS/DFS Optimizations',
    duration: '15 min',
    completed: true,
    image: 'https://images.unsplash.com/photo-1516116211227-bbc13c7d6b38?w=800&auto=format&fit=crop&q=80',
    contentSnippet: 'Learn how to detect cycles, compute topological sorts, and prune traversal paths in graph algorithms.'
  },
  {
    id: 'lib-2',
    section: 'technical',
    category: 'System Design',
    title: 'Designing Scalable Microservices',
    duration: '45 min',
    completed: false,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    contentSnippet: 'Master event-driven decoupling, CQRS patterns, idempotent consumers, and distributed caching tiers.'
  },
  {
    id: 'lib-3',
    section: 'technical',
    category: 'Data Structures',
    title: 'Advanced Tree Balances (AVL & Red-Black)',
    duration: '20 min',
    completed: false,
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
    contentSnippet: 'Understand self-balancing search trees, left/right rotations, color flips, and invariant maintenance.'
  },
  {
    id: 'lib-4',
    section: 'behavioral',
    category: 'Behavioral',
    title: 'The STAR Method Deep Dive',
    duration: '10 min',
    completed: false,
    icon: 'forum',
    contentSnippet: 'Structure every behavioral story with Situation, Task, Action, and quantifiable Result.'
  },
  {
    id: 'lib-5',
    section: 'behavioral',
    category: 'Negotiation',
    title: 'Negotiating Offers Gracefully',
    duration: '8 min',
    completed: false,
    icon: 'handshake',
    contentSnippet: 'Tactics for comparing equity versus base salary, counter-offering respectfully, and timeline management.'
  },
  {
    id: 'lib-6',
    section: 'company',
    category: 'Company Guide',
    title: 'Google SWE Guide',
    duration: '25 min read',
    completed: false,
    companyInitial: 'G',
    contentSnippet: 'Core rubric breakdown on Googleyness, algorithmic complexity trade-offs, and clean architectural patterns.'
  },
  {
    id: 'lib-7',
    section: 'company',
    category: 'Company Guide',
    title: 'Meta Leadership Principles',
    duration: '18 min read',
    completed: false,
    companyInitial: 'M',
    contentSnippet: 'Move fast, focus on long term impact, live in the future, and build with transparency.'
  }
];

export const MOCK_INTERVIEW_QUESTIONS: MockQuestion[] = [
  {
    id: 'q1',
    number: 1,
    total: 5,
    category: 'Behavioral',
    question: 'Tell me about a time you worked on a project under tight deadlines. How did you prioritize tasks and handle pressure?',
    focusAreas: ['Clarify time constraints', 'Explain prioritization matrix', 'Demonstrate composure & delegation'],
    expectedKeywords: ['Agile', 'Prioritization', 'Communication', 'Deadline', 'Impact'],
    sampleAnswerHint: 'Set the context of the sprint, detail how you dropped non-essential scope, and conclude with the shipped outcome.'
  },
  {
    id: 'q2',
    number: 2,
    total: 5,
    category: 'Technical Leadership',
    question: 'Tell me about a time you solved a complex technical problem. Walk me through your approach.',
    focusAreas: ['Use the STAR method.', 'Emphasize your specific role.', 'Quantify the impact if possible.'],
    expectedKeywords: ['Architecture', 'Root Cause', 'Optimization', 'Metrics', 'Benchmark', 'STAR'],
    sampleAnswerHint: 'Detail the root cause investigation, the trade-offs considered between 2 solutions, and how you verified performance gains.'
  },
  {
    id: 'q3',
    number: 3,
    total: 5,
    category: 'System Design',
    question: 'How would you design a distributed cache invalidation system for a high-traffic social feed?',
    focusAreas: ['Cache-aside vs write-through', 'Pub/sub message broker', 'Thundering herd mitigation'],
    expectedKeywords: ['Redis', 'Kafka', 'TTL', 'Consistent Hashing', 'Latency'],
    sampleAnswerHint: 'Start with high-level architecture, discuss Redis eviction policies, and introduce Kafka event streams for invalidation.'
  },
  {
    id: 'q4',
    number: 4,
    total: 5,
    category: 'Conflict Resolution',
    question: 'Describe a situation where you had a disagreement with a team member or technical lead. How did you resolve it?',
    focusAreas: ['Objective data over emotion', 'Active listening', 'Commitment to the chosen path'],
    expectedKeywords: ['Empathy', 'Data-driven', 'Consensus', 'Post-mortem'],
    sampleAnswerHint: 'Emphasize setting up a benchmark spike test to evaluate both approaches with objective metrics.'
  },
  {
    id: 'q5',
    number: 5,
    total: 5,
    category: 'Career Vision',
    question: 'Why are you interested in joining our engineering team, and what kind of technical challenges excite you most?',
    focusAreas: ['Company alignment', 'Specific technology interest', 'Growth mindset'],
    expectedKeywords: ['Scale', 'Mission', 'Innovation', 'Mentorship', 'Impact'],
    sampleAnswerHint: 'Connect your personal projects and learning curve to the company mission and active technical roadmap.'
  }
];

export const INITIAL_PROJECT_SQUADS: ProjectSquad[] = [
  {
    id: 'squad-1',
    projectTitle: 'Visionary CRM & Workflow AI',
    description: 'Autonomous customer relationship platform with predictive deal scoring and automated voice summaries.',
    phase: 'Prototyping',
    leadName: 'Alex Mwansa',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    members: [
      { name: 'Alex Mwansa', role: 'Full-Stack Lead', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { name: 'Marcus Chen', role: 'AI / ML Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
      { name: 'Elena Rodriguez', role: 'UI/UX Designer', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80' }
    ],
    tasks: [
      {
        id: 't-1',
        title: 'Design PostgreSQL schema for tenant isolation',
        assignedTo: 'Alex Mwansa',
        assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        role: 'Full-Stack Lead',
        status: 'completed',
        dueDate: 'Oct 12'
      },
      {
        id: 't-2',
        title: 'Train Gemini scoring model on synthetic sales logs',
        assignedTo: 'Marcus Chen',
        assignedAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        role: 'AI / ML Engineer',
        status: 'in-progress',
        dueDate: 'Oct 18'
      },
      {
        id: 't-3',
        title: 'Create high-fidelity Tailwind dashboard wireframes',
        assignedTo: 'Elena Rodriguez',
        assignedAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
        role: 'UI/UX Designer',
        status: 'completed',
        dueDate: 'Oct 10'
      },
      {
        id: 't-4',
        title: 'Implement real-time WebSocket notifications',
        assignedTo: 'Alex Mwansa',
        assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        role: 'Full-Stack Lead',
        status: 'todo',
        dueDate: 'Oct 25'
      }
    ],
    milestones: [
      { id: 'm-1', title: 'Architecture Review & Wireframes', targetDate: 'Oct 10', completed: true },
      { id: 'm-2', title: 'AI Model Integration & Backend API', targetDate: 'Oct 18', completed: false },
      { id: 'm-3', title: 'Beta Testing with 5 Pilot Users', targetDate: 'Nov 02', completed: false }
    ],
    progressPercentage: 55
  },
  {
    id: 'squad-2',
    projectTitle: 'Decentralized Campus Exchange',
    description: 'Peer-to-peer textbook and lab equipment marketplace secured with campus credentials.',
    phase: 'Ideation',
    leadName: 'Sarah Jenkins',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    members: [
      { name: 'Sarah Jenkins', role: 'Smart Contract Dev', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80' },
      { name: 'David Kim', role: 'Mobile Dev (React Native)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' }
    ],
    tasks: [
      {
        id: 't-201',
        title: 'Draft smart contract specification',
        assignedTo: 'Sarah Jenkins',
        assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        role: 'Smart Contract Dev',
        status: 'completed',
        dueDate: 'Oct 05'
      },
      {
        id: 't-202',
        title: 'Set up React Native mobile skeleton',
        assignedTo: 'David Kim',
        assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        role: 'Mobile Dev',
        status: 'in-progress',
        dueDate: 'Oct 20'
      }
    ],
    milestones: [
      { id: 'm-201', title: 'Contract Security Audit', targetDate: 'Oct 25', completed: false },
      { id: 'm-202', title: 'Campus Alpha Launch', targetDate: 'Nov 15', completed: false }
    ],
    progressPercentage: 30
  }
];

