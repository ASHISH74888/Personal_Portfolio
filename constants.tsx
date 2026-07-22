import React from "react";
import {
  Github,
  Linkedin,
  UploadCloud as Drive,
  FileUser,
  Mail,
  Phone,
  Code2,
  Database,
  Cloud,
  Terminal,
  Server,
  Layers,
  Cpu,
} from "lucide-react";

export const PERSONAL_INFO = {
  name: "Ashish Kumar Singh",
  title: "Software Engineer",
  email: "singhashish74888@gmail.com",
  phone: "+91-7488837369",
  location: "Mumbai Maharashtra, India",
  summary:
    "Full-stack engineer with production experience building scalable, event-driven systems. Currently at Praan.inc building a real-time IoT + SaaS analytics dashboard; previously architected Kafka + Elasticsearch pipelines at Bolt.Earth. At home across Node.js, TypeScript, React, MongoDB, Redis, and the tooling that keeps distributed systems observable.",
  // profileImage: "https://images.unsplash.com/photo-1628563694622-5a76957fd09c?q=80&w=1000&auto=format&fit=crop",
  socials: [
    {
      name: "GitHub",
      icon: <Github className="w-6 h-6" />,
      url: "https://github.com/ASHISH74888",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" />,
      url: "https://www.linkedin.com/in/ashish-kumar-singh-668a12251/",
    },
    {
      name: "Resume",
      icon: <FileUser className="w-6 h-6" />,
      url: "https://drive.google.com/file/d/17vMhI71-bfpaU-K_F-EV7BYAa7Z8AV9C/view?usp=sharing",
    },
  ],
};

export const EXPERIENCE = [
  {
    company: "Praan.inc",
    role: "Full Stack Developer",
    period: "Feb 2025 — Present",
    location: "Mumbai, India",
    description: [
      "Leading end-to-end development of a scalable SaaS enterprise dashboard for industry and consumer users — powering operational visibility, analytics, and revenue-generating business workflows.",
      "Designed a robust Role-Based Access Control (RBAC) architecture with fine-grained permissions, multi-role management, and secure access across organizational hierarchies.",
      "Optimized large-scale MongoDB pipelines for live and hourly sensor data using Redis caching, cron-driven aggregation, and query optimization — significantly improving dashboard response times.",
      "Engineered real-time MQTT communication pipelines for IoT devices, improving sensor throughput, connection reliability, and low-latency data synchronization.",
      "Integrated centralized error monitoring, logging, and observability tooling to proactively track performance and improve debugging efficiency across services.",
    ],
  },
  {
    company: "Bolt.Earth",
    role: "Software Engineer Intern",
    period: "Feb 2025 — Nov 2025",
    location: "Bengaluru, India",
    description: [
      "Architected an event-driven Connectionless Sync system using Kafka, an AVRO schema registry, and Elasticsearch — enabling autonomous log sync on app open and improving user experience by 90% across distributed charging infrastructure.",
      "Engineered a wallet rewards management platform with microservices and CRON-driven workflows, generating $5K+ additional revenue through new reward flows.",
      "Automated BLE charger log processing via Kafka + Elasticsearch, improving booking data reliability and saving $2.4K annually in operational overhead.",
      "Implemented a cron-based monthly revenue transfer system using Cashfree, with robust idempotency safeguards for transaction reliability.",
      "Refactored critical dashboard APIs, reducing MongoDB calls from 4 → 1 and improving query performance for 6K+ records.",
    ],
  },
  {
    role: "Software Developer Engineer Intern",
    company: "Celebal Technologies",
    period: "Jun 2024 — Aug 2024",
    location: "Bhubaneswar, India",
    description: [
      "Collaborated with the backend team on designing scalable APIs and cloud-based services using Node.js and Express.js.",
      "Gained hands-on experience with cloud deployment workflows and enterprise backend architecture.",
      "Optimized API performance and strengthened security layers for service endpoints.",
      "Participated in code reviews, agile ceremonies, sprint planning, and task estimation.",
    ],
  },
];

export const EDUCATION = [
  {
    institution: "Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar",
    degree: "B.Tech in Computer Science and Engineering",
    period: "2021 — 2025",
    // score: "CGPA 8.46 / 10",
  },
];

export const PROJECTS = [
  {
    name: "TALKIO",
    period: "Nov 2023 — Dec 2023",
    role: "Full Stack Developer",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.IO"],
    description:
      "A real-time messaging application supporting one-to-one messaging, group chats, and user profiles.",
    points: [
      "Implemented WebSocket-based communication using Socket.IO for instant message delivery.",
      "Built group management features including adding and removing users from chat groups.",
      "Designed a scalable backend using Node.js and Express.",
    ],
    // Chat Application Interface / Communication Bubble
    image:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "Log Ingestor",
    period: "Sep 2023 — Oct 2023",
    role: "Backend Developer",
    tech: ["Node.js", "Express.js", "MongoDB"],
    description:
      "Real-time system for collecting, processing, and searching application logs.",
    points: [
      "Developed a real-time log ingestion system to collect and analyze logs from multiple services.",
      "Implemented advanced search and filtering by timestamp, resource ID, log level, and message.",
      "Integrated the system with Talkio for instant log updates and efficient error monitoring.",
    ],
    // Code/Terminal/Server Logs
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
  },
];

export const SKILLS = [
  {
    category: "Languages",
    items: [
      "C / C++",
      "Java",
      "Python",
      "JavaScript / TypeScript (ES6+)",
      "HTML + CSS",
    ],
    icon: <Code2 />,
  },
  {
    category: "Backend & Realtime",
    items: [
      "Node.js",
      "Express.js",
      "React.js (Material UI)",
      "Apache Kafka",
      "MQTT",
      "Socket.IO",
      "Elasticsearch",
    ],
    icon: <Server />,
  },
  {
    category: "Cloud & Databases",
    items: [
      "MongoDB",
      "MySQL / SQL",
      "Redis",
      "AWS (S3, EC2, Parameter Store, Secrets Manager)",
      "Firebase",
    ],
    icon: <Cloud />,
  },
  {
    category: "DevOps & Tooling",
    items: [
      "Docker",
      "Kubernetes",
      "Git / GitHub / BitBucket",
      "Jira / Confluence",
      "Sentry",
      "Kibana",
      "Rancher",
      "Fluentbit",
    ],
    icon: <Terminal />,
  },
];

export const ACHIEVEMENTS = [
  "Led high-impact project teams, delivering efficient solutions to complex technical challenges (2024).",
  "Selected for Smart India Hackathon by college, shortlisted from 150+ teams (2023).",
  "Secured a Top 7 position among 30+ teams at a hackathon organized by Devfolio, Polygon, Solana, and Filecoin.",
];
