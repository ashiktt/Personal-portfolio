import { SiteProfile, Project, Certificate, ToolItem, SkillGroup } from '../types';

export const INITIAL_PROFILE: SiteProfile = {
  name: 'Ashikur Rahman',
  role: 'UI/UX Designer • CSE Student',
  availability: 'Open to Product Design internships',
  heroHeadline: 'Designing intuitive digital experiences that make complex user journeys simpler.',
  heroIntro: "I'm a Computer Science & Engineering student focused on UI/UX design, interaction design, and mobile product experiences.",
  aboutText: `I'm currently pursuing a B.Tech in Computer Science & Engineering at Gulzar Group of Institutes (2023–2027), while building my skills in UI/UX design, interaction design, and frontend development.

I leverage user research, wireframing, prototyping, and AI-assisted product development to create intuitive, practical digital experiences.`,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  email: 'tusarashikur@gmail.com',
  phone: '+91 6280321270',
  location: 'Ludhiana, Punjab, India',
  timezone: 'India Standard Time (IST, UTC+5:30)',
  educationDegree: 'B.Tech in Computer Science & Engineering',
  educationInstitute: 'Gulzar Group of Institutes',
  educationYear: '2023–2027',
  linkedInUrl: 'https://www.linkedin.com/in/ashikur-rahman-92aa1a372',
  githubUrl: 'https://github.com/ashiktt',
  dribbbleUrl: 'https://dribbble.com',
  resumeUrl: '#resume',
  emailJsConfig: {
    serviceId: 'service_contact',
    templateId: 'template_portfolio',
    publicKey: 'user_public_key',
  },
  adminPasscode: 'ashikur2026',
  hideAdminFooterLink: false,
  adminSecretHint: 'Default year 2026',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-travel-app',
    title: 'Travel Booking App',
    subtitle: 'UI/UX Design • Mobile App • Case Study',
    category: 'Mobile App',
    shortDescription: 'A mobile travel booking experience designed to simplify the process of searching, comparing, and booking flights through a clear and intuitive user flow.',
    thumbnail: 'https://images.unsplash.com/photo-1512753360435-329c4535a9a7?auto=format&fit=crop&w=1200&q=80',
    tools: ['Figma', 'FigJam', 'Mobile UI/UX', 'User Flow', 'Wireframing'],
    order: 1,
    isPublished: true,
    featured: true,
    statusBadge: 'In Progress (High-Fidelity UI & Prototype)',
    caseStudy: {
      overview: 'The Travel Booking App is a user-centered mobile application concept engineered to remove friction from flight discovery and booking. By restructuring information hierarchy and simplifying the multi-step transaction process into an intuitive sequential journey, the app helps users compare flight options and complete bookings with minimal cognitive load.',
      problem: 'Many existing flight booking applications present cluttered search filters, hidden ancillary fees, and complicated seat-selection layouts on mobile viewports. First-time and frequent travelers often experience choice fatigue and frustration during checkout.',
      goal: 'Design a clean, 7-step mobile flight booking flow that prioritizes price transparency, thumb-friendly navigation, and clear visual feedback at every milestone from search to ticket confirmation.',
      targetUsers: 'Students, young professionals, and frequent travelers who prefer fast, transparent mobile flight comparisons without unnecessary clutter or deceptive UI patterns.',
      solution: 'Created an intuitive mobile interface featuring clean filter chips, visual flight timeline comparison cards, an interactive plane seat selector, and a clear breakdown of pricing before final booking confirmation.',
      projectStatus: [
        { stage: 'User Research & Problem Definition', status: 'Completed' },
        { stage: 'User Flow Architecture', status: 'Completed' },
        { stage: 'Low-Fidelity Wireframing', status: 'Completed' },
        { stage: 'High-Fidelity UI Design', status: 'In Progress' },
        { stage: 'Interactive Prototyping', status: 'In Progress' },
        { stage: 'Usability Testing & Feedback', status: 'Planned' },
      ],
      userFlow: [
        'Search',
        'Results',
        'Flight Details',
        'Booking Details',
        'Seat Selection',
        'Payment',
        'Confirmation',
      ],
      wireframes: [
        {
          title: 'Search & Flight Discovery Layout',
          desc: 'Defined intuitive origin/destination inputs, departure & return date pickers, and passenger selectors within comfortable thumb-reach zones.',
        },
        {
          title: 'Flight Results & Filter Cards',
          desc: 'Structured comparison cards highlighting airline logos, departure/arrival times, flight duration, layovers, and transparent total prices.',
        },
        {
          title: 'Interactive Seat Selection Matrix',
          desc: 'Designed a visual aircraft cabin grid with distinct color cues for available, selected, and occupied seats with price indicators.',
        },
        {
          title: 'Passenger Details & Checkout Flow',
          desc: 'Streamlined passenger data input with saved traveler profiles, clear add-on toggles (baggage, meals), and secure payment options.',
        },
      ],
      designDecisions: [
        {
          title: '1. Thumb-Zone First Interaction',
          desc: 'Placed primary action buttons ("Search Flights", "Continue to Seat Selection", "Confirm Booking") at the bottom 30% of the screen for effortless one-handed mobile use.',
        },
        {
          title: '2. Transparent Upfront Pricing',
          desc: 'Eliminated hidden fee surprises by showing total cost including taxes on all flight cards, building user trust and reducing checkout drop-off.',
        },
        {
          title: '3. Visual Hierarchy & Progressive Disclosure',
          desc: 'Displayed critical flight essentials first (time, duration, price) while keeping baggage policies and cancellation rules accessible via 1-tap bottom sheets.',
        },
        {
          title: '4. Consistent Contrast & Mobile Typography',
          desc: 'Applied a clean, modern typography scale with high contrast ratios for legibility under bright outdoor conditions.',
        },
      ],
      highFidelityUI: [
        {
          title: 'Flight Search & Discovery',
          desc: 'Clean mobile home screen with one-tap city swap, intuitive date pickers, and recent search shortcuts.',
        },
        {
          title: 'Flight Comparison Results',
          desc: 'Scannable cards with airline identity, departure/arrival times, stops, duration, and price badges.',
        },
        {
          title: 'Aircraft Seat Picker',
          desc: 'Interactive cabin seat map categorized into Standard, Extra Legroom, and Business class.',
        },
        {
          title: 'Digital Boarding Pass & Confirmation',
          desc: 'Post-booking screen with scannable QR code, gate info, countdown timer, and apple wallet integration prompt.',
        },
      ],
      keyFeatures: [
        'Streamlined 7-step progressive booking journey',
        'Clear flight duration and layover timeline indicators',
        'Visual aircraft seat selection with class color codes',
        'Upfront price breakdowns with no hidden fee surprises',
        'Instant digital boarding pass generation with QR code',
      ],
      learnings: [
        'Designing for mobile viewports requires ruthless prioritization of information to prevent cognitive overload.',
        'Complex forms feel significantly faster and more approachable when broken into bite-sized sequential steps.',
        'Building reusable Figma component variants (FlightCard, SeatGrid, PriceSummary) speeds up design iteration and ensures design consistency.',
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      ],
      figmaUrl: 'https://www.figma.com',
      liveUrl: '',
      githubUrl: 'https://github.com/ashiktt',
    },
    createdAt: '2026-02-28',
  },
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: 'Google UX Design Professional Certificate',
    issuer: 'Google (Coursera)',
    issueDate: 'December 2025',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80',
    credentialUrl: 'https://coursera.org',
    skills: ['User Research', 'Wireframing', 'Figma Prototyping', 'Usability Testing'],
    createdAt: '2025-12-15',
  },
  {
    id: 'cert-2',
    title: 'Enterprise Design Thinking Practitioner',
    issuer: 'IBM',
    issueDate: 'October 2025',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    credentialUrl: 'https://ibm.com',
    skills: ['Design Thinking', 'Empathy Mapping', 'User Journey Mapping', 'Agile UX'],
    createdAt: '2025-10-18',
  },
];

export const INITIAL_TOOLS: ToolItem[] = [
  {
    id: 'tool-figma',
    name: 'Figma',
    category: 'UI/UX Design & Prototyping',
    description: 'Primary design tool for wireframing, high-fidelity mockups, auto-layout components, and interactive user prototypes.',
    color: '#F24E1E',
    badge: 'Core Tool',
    iconType: 'figma',
    order: 1,
  },
  {
    id: 'tool-figjam',
    name: 'FigJam',
    category: 'User Flows & Brainstorming',
    description: 'Collaborative whiteboarding for user flows, empathy mapping, information architecture, and design ideation.',
    color: '#9747FF',
    badge: 'UX Ideation',
    iconType: 'design',
    order: 2,
  },
  {
    id: 'tool-ai-workflows',
    name: 'AI Product & Dev Workflows',
    category: 'AI-Assisted Development',
    description: 'Leveraging LLMs, generative UI tools, and prompt engineering to accelerate product ideation, user journey validation, and frontend development.',
    color: '#8B5CF6',
    badge: 'AI Innovation',
    iconType: 'code',
    order: 3,
  },
  {
    id: 'tool-htmlcss',
    name: 'HTML / CSS',
    category: 'Frontend Foundations',
    description: 'Knowledge of semantic HTML5, modern CSS layouts (Flexbox, Grid), and responsive design principles for smooth developer collaboration.',
    color: '#E34F26',
    badge: 'Frontend',
    iconType: 'code',
    order: 4,
  },
  {
    id: 'tool-github',
    name: 'GitHub',
    category: 'Version Control & Code',
    description: 'Version control, repository management, collaborative code review, and hosting technical projects.',
    color: '#6e5494',
    badge: 'Engineering',
    iconType: 'github',
    order: 5,
  },
];

export const INITIAL_SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'group-ux',
    category: 'UX DESIGN',
    items: [
      'User Research',
      'User Flows',
      'Information Architecture',
      'Wireframing',
      'Usability Testing',
    ],
    order: 1,
  },
  {
    id: 'group-ui',
    category: 'UI DESIGN',
    items: [
      'Visual Design',
      'Design Systems',
      'Responsive Design',
      'Interaction Design',
      'Prototyping',
    ],
    order: 2,
  },
  {
    id: 'group-ai-product',
    category: 'AI-ASSISTED PRODUCT DEV',
    items: [
      'AI Workflow Integration',
      'Prompt Engineering for UX',
      'Generative UI Prototyping',
      'AI Market & User Discovery',
      'Synthetic Persona Testing',
    ],
    order: 3,
  },
  {
    id: 'group-tools',
    category: 'TOOLS & CODE',
    items: [
      'Figma & FigJam',
      'AI Design Tools',
      'HTML5 / Modern CSS',
      'Git & GitHub',
    ],
    order: 4,
  },
];

// Backward compatibility
export const TOOLS_LIST = INITIAL_TOOLS;
export const DESIGN_SKILLS = INITIAL_SKILL_GROUPS;
