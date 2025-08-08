import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ExternalLink, Moon, Sun, MapPin, Calendar } from "lucide-react";

/* --- minimal UI primitives (no shadcn needed) --- */
const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }: any) => <div className={className}>{children}</div>;
const Button = ({ children, onClick, className = "", variant = "default", size = "md", href }: any) => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-900";
  const variants: Record<string,string> = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    outline: "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800",
  };
  const sizes: Record<string,string> = { sm: "px-3 py-1 text-sm", md: "px-4 py-2 text-sm", icon: "p-2" };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  return href ? (
    <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{children}</a>
  ) : (
    <button onClick={onClick} className={cls}>{children}</button>
  );
};

/* --- content pulled from your resume --- */
const profile = {
  name: "Shaik Salman Basha",
  title: "Computer Science (Honours) @ UNB · Data & Software Engineering",
  location: "Fredericton, New Brunswick, Canada",
  availability: "Open to internships & new-grad roles (2026)",
  email: "salmanbasha.shaik@unb.ca",
  linkedin: "https://www.linkedin.com/in/salman-shaik-798727225",
  leetcode: "https://leetcode.com/u/salman2807/",
  headshot: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=640&q=80&auto=format&fit=crop", // replace with your photo
  summary:
    "Final-year CS honours student focused on designing and optimizing data pipelines. Hands-on with ETL, enterprise app integration (SAP), and analytics. Proficient in Java, Python, SQL, Docker, Power BI, and Tableau.",
};

const education = {
  school: "University of New Brunswick (UNB)",
  degree: "Bachelor of Computer Science",
  date: "Apr 2026",
  gpa: "3.7",
  honors: "Dean’s List (2022–2024)",
  coursework: ["Advanced Algorithms (Java)", "Software Engineering", "Big Data & NLP (Python)"],
};

const experience = [
  {
    company: "Agriculture and Agri-Food Canada (AAFC)",
    role: "Data Engineer Intern – Bioinformatics",
    date: "Jan 2025 – Present",
    bullets: [
      "Accelerated data ingestion by 23× (11 → 260 files/sec) via parallelism and I/O optimizations.",
      "Built ETL to migrate 1,000+ indexed metadata records from Elasticsearch to PostgreSQL with integrity checks.",
      "Benchmarked NLP tools (spaCy, SciSpaCy) to improve NER accuracy in the Transform stage.",
      "Handled raw sequencing files with QC to ensure accuracy, privacy, security, and compliance.",
    ],
  },
  {
    company: "New Brunswick Power Corporation",
    role: "Software Engineer Intern",
    date: "Sep 2023 – Apr 2024",
    bullets: [
      "Developed and maintained .NET/C# apps integrated with core SAP systems.",
      "Built internal tools and dashboards with Power Apps, Power BI, and Tableau.",
      "Delivered features across a large system, strengthening adaptability to complex architectures.",
    ],
  },
];

const projects = [
  {
    name: "Tennis Match Prediction",
    description:
      "End-to-end classification pipeline to predict match outcomes for two players. Compared Naive Bayes, Logistic Regression, and Neural Networks with preprocessing and metrics (Accuracy, Precision, F1).",
    tags: ["Python", "scikit-learn", "Data Cleaning", "Model Evaluation"],
    link: "#",
  },
  {
    name: "Science Data Inventory @ AAFC",
    description:
      "Automated pipeline extracting metadata from sequencing files (Tika + shell tools) and ingesting into Elasticsearch via Logstash (Dockerized) for fast, searchable access through an ELK-based platform.",
    tags: ["ETL", "Elasticsearch", "Logstash", "Docker", "Tika"],
    link: "#",
  },
];

const skills = [
  { group: "Languages & Libraries", items: ["Python (pandas, matplotlib, seaborn)", "Java", "SQL", "scikit-learn", "spaCy", "TensorFlow"] },
  { group: "Tools & Platforms", items: ["Elasticsearch", "Docker", "Jupyter", "Power BI", "Tableau", "CKAN", "Hadoop", "APIs"] },
  { group: "Concepts", items: ["Data Engineering (ETL)", "Data Science", "Software Design & Development", "Full-Stack Development"] },
  { group: "Certifications", items: ["HackerRank SQL (Advanced)", "Kaggle Notebooks Expert (Top 6%)", "Lean Six Sigma"] },
];

/* --- helpers/components --- */
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("sal-theme");
    const prefers = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(stored ? stored === "dark" : prefers);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("sal-theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, setDark };
}
const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="scroll-mt-24 py-14">
    <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</motion.h2>
    <div className="mt-6">{children}</div>
  </section>
);
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs md:text-sm">{children}</span>
);

/* --- page --- */
export default function PersonalSite() {
  const { dark, setDark } = useDarkMode();
  const year = useMemo(() => new Date().getFullYear(), []);
  const nav = [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];
  const navClick = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur border-b border-neutral-200/60 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile.headshot} alt="Headshot" className="w-9 h-9 rounded-full object-cover" />
            <span className="font-semibold">{profile.name}</span>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {nav.map((n) => (
              <button key={n.id} onClick={() => navClick(n.id)} className="text-sm hover:underline underline-offset-4">
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setDark(!dark)}>
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4">
        <section className="py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold leading-tight">{profile.title}</motion.h1>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300 leading-relaxed">{profile.summary}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Pill><MapPin className="mr-1 h-3.5 w-3.5" /> {profile.location}</Pill>
              <Pill><Calendar className="mr-1 h-3.5 w-3.5" /> {profile.availability}</Pill>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href={`mailto:${profile.email}`} className="gap-2">Contact <Mail size={16} /></Button>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:underline">
                <Linkedin size={18} /> LinkedIn
              </a>
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:underline">
                <Github size={18} /> LeetCode
              </a>
            </div>
          </div>
          <div className="relative">
            <motion.img initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
              src={profile.headshot} alt="Salman" className="rounded-2xl shadow-xl w-full object-cover" />
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-4 py-2 text-xs shadow-lg">
              Building practical data systems
            </div>
          </div>
        </section>

        <Section id="about" title="About">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              I design, optimize, and ship data pipelines and internal tools that actually move the needle:
              fast ETL, searchable metadata, and crisp dashboards. Fluent across Python/Java/SQL and comfortable
              with Docker, Elasticsearch, and BI stacks.
            </p>
          </div>
        </Section>

        <Section id="education" title="Education">
          <Card><CardContent className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold">{education.school}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300">{education.degree}</p>
              </div>
              <span className="text-xs opacity-80">{education.date}</span>
            </div>
            <ul className="mt-3 text-sm space-y-1">
              <li>GPA: {education.gpa} · {education.honors}</li>
              <li>Relevant courses: {education.coursework.join(", ")}</li>
            </ul>
          </CardContent></Card>
        </Section>

        <Section id="experience" title="Experience">
          <div className="space-y-4">
            {experience.map((e) => (
              <Card key={e.company}><CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{e.role}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{e.company}</p>
                  </div>
                  <span className="text-xs opacity-80">{e.date}</span>
                </div>
                <ul className="mt-3 list-disc pl-5 space-y-1 text-sm">
                  {e.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </CardContent></Card>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p) => (
              <Card key={p.name} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <a href={p.link} target="_blank" rel="noreferrer" className="text-sm inline-flex items-center gap-1 hover:underline">
                      Repo <ExternalLink size={16} />
                    </a>
                  </div>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">{t}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((s) => (
              <Card key={s.group}><CardContent className="p-5">
                <h4 className="font-medium">{s.group}</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.items.map((it) => <span key={it} className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">{it}</span>)}
                </div>
              </CardContent></Card>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact">
          <Card><CardContent className="p-5">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Interested in data engineering or software roles? Reach out and I’ll send a project or two that shows how I work.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button href={`mailto:${profile.email}`} className="gap-2">Email <Mail size={16} /></Button>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:underline">
                <Linkedin size={18} /> LinkedIn
              </a>
              <a href={profile.leetcode} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm hover:underline">
                <Github size={18} /> LeetCode
              </a>
            </div>
          </CardContent></Card>
        </Section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-200/60 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {year} {profile.name}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href={profile.linkedin} className="inline-flex items-center gap-1 hover:underline" target="_blank" rel="noreferrer">
              <Linkedin size={16} /> LinkedIn
            </a>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 hover:underline">
              <Mail size={16} /> Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
