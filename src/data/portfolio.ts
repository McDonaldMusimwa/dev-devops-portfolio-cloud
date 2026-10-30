// All site content lives here so sections stay presentational.

export type Link = { label: string; href: string }

export type PipelineStep = {
  name: string
  detail: string
  status: 'passed' | 'running' | 'queued'
}

export type Skill = { name: string; status: 'production' | 'provisioning' }

export type Project = {
  repo: string
  title: string
  kind: string
  featured?: boolean
  description: string
  // Request path through the system, drawn as an architecture flow.
  flow: string[]
  links: Link[]
}

export type Job = {
  rev: number
  role: string
  company: string
  period: string
  notes: string[]
  active?: boolean
}

export type Post = {
  date: string
  title: string
  source: 'medium' | 'linkedin'
  href: string
}

export const profile = {
  name: 'McDonald Musimwa',
  handle: 'mcdonald',
  account: 'McDonaldMusimwa',
  headshot: '/headshot.jpeg',
  availability: 'open to DevOps roles',
  title: 'Developer → DevOps',
  summary:
    'AWS-certified software developer at Transhumanity AI. I run Docker workloads on ECS with RDS and ship them through CI/CD. Now I want infrastructure to be the job, not the side quest.',
  email: 'musimwamcdonald@gmail.com',
  resume: 'https://drive.google.com/file/d/1cjvzTQkc-1YBu7E6Z4gzLZ60EIJRR4Q2/view?usp=sharing',
  socials: [
    { label: 'GitHub', href: 'https://github.com/McDonaldMusimwa' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mcdonaldmusimwa' },
    { label: 'YouTube', href: 'https://www.youtube.com/@mcdthedev' },
  ] satisfies Link[],
}

export const skills: Skill[] = [
  { name: 'aws.ecs / ec2 / rds / s3', status: 'production' },
  { name: 'aws.lambda / apigw / dynamodb', status: 'production' },
  { name: 'containers.docker', status: 'production' },
  { name: 'ci-cd.github-actions', status: 'production' },
  { name: 'code.ts / node / python / java', status: 'production' },
  { name: 'orchestration.kubernetes', status: 'provisioning' },
  { name: 'iac.terraform', status: 'provisioning' },
]

export const pipeline: PipelineStep[] = [
  { name: 'source', detail: 'B.S. Software Development, BYU–Idaho', status: 'passed' },
  { name: 'build', detail: 'Full-stack apps at DPIT and SkyIT', status: 'passed' },
  { name: 'test', detail: 'AWS Solutions Architect – Associate', status: 'passed' },
  { name: 'deploy', detail: 'ECS + CI/CD at Transhumanity AI', status: 'running' },
  { name: 'release', detail: 'DevOps / Platform Engineer', status: 'queued' },
]

// Used by the shell's `skills` command.
export const engineer: Record<string, string[]> = {
  cloud: ['ECS', 'EC2', 'RDS', 'S3', 'Lambda'],
  ship: ['Docker', 'GitHub Actions', 'CI/CD'],
  code: ['TypeScript', 'Node', 'Python', 'Java'],
  data: ['PostgreSQL', 'DynamoDB'],
  learning: ['Kubernetes', 'Terraform'],
}

// Rendered as `kubectl describe` output in the About section.
export const describe = {
  fields: [
    ['Name', 'McDonald Musimwa'],
    ['Namespace', 'devops'],
    ['Labels', 'role=software-developer'],
    ['', 'track=devops'],
    ['', 'cert=aws-saa'],
    ['Status', 'Migrating'],
    ['Channel', 'youtube.com/@mcdthedev'],
  ],
  events: [
    ['Normal', 'Graduated', 'byu-idaho'],
    ['Normal', 'Certified', 'aws'],
    ['Normal', 'Scaled', 'dpit → skyit → transhumanity'],
  ],
}

export const about = {
  title: 'I care about what happens after the merge.',
  paragraphs: [
    "Over three roles I've moved from building features to owning how they ship: EC2 and RDS deployments and Cognito auth at SkyIT, then multi-service Docker on ECS with CI/CD to staging and production at Transhumanity AI.",
    "I'm curious about every layer of the stack, and I share what I learn on my YouTube channel.",
  ],
}

export const projects: Project[] = [
  {
    repo: 'practiceaws',
    title: 'Practice Solution',
    kind: 'serverless',
    featured: true,
    description: 'Interactive practice to test and strengthen AWS knowledge.',
    flow: ['React', 'Cognito', 'API Gateway', 'Lambda', 'DynamoDB'],
    links: [
      { label: 'Endpoint', href: 'https://staging.d385k1fvsqio60.amplifyapp.com/' },
      { label: 'Source', href: 'https://github.com/McDonaldMusimwa/practiceaws' },
    ],
  },
  {
    repo: 'aitrainer',
    title: 'AI Trainer pipeline',
    kind: 'ci/cd',
    featured: true,
    description: 'GitHub Actions on pinned ubuntu-24.04 runners with Node 24 actions and cached Docker builds.',
    flow: ['git push', 'typecheck', 'docker build (cache)', 'image'],
    links: [{ label: 'Source', href: 'https://github.com/McDonaldMusimwa' }],
  },
  {
    repo: 'finace',
    title: 'Finace',
    kind: 'web · amplify',
    description: 'Turns PDF bank statements into a categorised view of spending and income.',
    flow: ['PDF upload', 'extract', 'categorise', 'overview'],
    links: [
      { label: 'Endpoint', href: 'https://main.d3majrchxii62n.amplifyapp.com/' },
      { label: 'Source', href: 'https://github.com/McDonaldMusimwa/finace' },
    ],
  },
  {
    repo: 'InvoiceToGo',
    title: 'InvoGo',
    kind: 'mobile',
    description: 'Invoicing for handymen, shared straight to WhatsApp.',
    flow: ['React Native', 'Firebase', 'WhatsApp share'],
    links: [
      { label: 'Endpoint', href: 'https://main.d2m7mhv4scf0qf.amplifyapp.com/' },
      { label: 'Source', href: 'https://github.com/McDonaldMusimwa/InvoiceToGo' },
    ],
  },
]

export const jobs: Job[] = [
  {
    rev: 3,
    role: 'Software Developer',
    company: 'Transhumanity AI',
    period: 'Nov 2025 – now',
    active: true,
    notes: [
      'Multi-service Docker on ECS',
      'RDS PostgreSQL per service',
      'CI/CD to staging + prod',
      'REST + WebSocket APIs for AI agents',
    ],
  },
  {
    rev: 2,
    role: 'Software Developer',
    company: 'SkyIT Services',
    period: 'May – Oct 2025',
    notes: ['Next.js + Prisma on EC2', 'RDS + S3', 'Cognito User Pools auth'],
  },
  {
    rev: 1,
    role: 'Software Engineer',
    company: 'DPIT Solutions',
    period: 'Sep 2024 – May 2025',
    notes: ['Java + Node.js back ends', 'React front ends', 'REST APIs', 'Figma to production'],
  },
]

export const degree = {
  title: 'B.S. Software Development',
  description:
    'Brigham Young University–Idaho · Jan 2020 – Dec 2024. Top 10% of the program; software engineering, web, databases, operating systems.',
}

export const certification = {
  title: 'AWS Certified Solutions Architect – Associate',
  description: 'Issuer: Amazon Web Services. Designing scalable, secure, cost-effective applications on AWS.',
  href: 'https://www.credly.com/badges/0b853cd1-9da3-4ea5-8e70-2e74f8c116aa/linked_in',
}

export const blog = {
  allPosts: { label: 'All posts on Medium', href: 'https://medium.com/@mcdonald.musimwa74' },
  posts: [
    {
      date: '2025-11-29',
      title: 'Starting a Node server with TypeScript',
      source: 'medium',
      href: 'https://medium.com/@mcdonald.musimwa74/starting-a-node-js-server-with-typescript-613b3abd7aee',
    },
    {
      date: '2024-11-30',
      title: 'Java vs. JavaScript: event loop meets multi-threading',
      source: 'medium',
      href: 'https://medium.com/@mcdonald.musimwa74/java-vs-javascript-event-loop-meets-multi-threading-ae7bf63c3789',
    },
    {
      date: '2023-11-10',
      title: 'Navigating the evolving realm of technology-driven enterprise',
      source: 'linkedin',
      href: 'https://www.linkedin.com/in/mcdonaldmusimwa',
    },
    {
      date: '2023-10-23',
      title: 'Web apps: static or dynamic?',
      source: 'linkedin',
      href: 'https://www.linkedin.com/in/mcdonaldmusimwa',
    },
  ] satisfies Post[],
}

// Sidebar resources. `file` is what the shell's `ls` prints.
export const sections = [
  { id: 'home', label: 'Overview', crumb: 'overview', file: 'overview' },
  { id: 'terminal', label: 'Cloud shell', crumb: 'cloud-shell', file: 'cloud-shell' },
  { id: 'about', label: 'About', crumb: 'about', file: 'about' },
  { id: 'projects', label: 'Workloads', crumb: 'workloads', file: 'workloads' },
  { id: 'experience', label: 'Deployments', crumb: 'deployments', file: 'deployments' },
  { id: 'education', label: 'Certificates', crumb: 'certificates', file: 'certificates' },
  { id: 'blog', label: 'Logs · Blog', crumb: 'logs', file: 'logs' },
  { id: 'contact', label: 'Hire me', crumb: 'hire-me', file: 'hire-me' },
] as const

export type SectionId = (typeof sections)[number]['id']

export const stats = [
  { label: 'Roles since 2024', value: jobs.length },
  { label: 'Projects shipped', value: projects.length },
  { label: 'AWS certification', value: 'SAA' },
  { label: 'Posts published', value: blog.posts.length },
]
