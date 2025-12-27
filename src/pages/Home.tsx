import Container from "../components/Container";
import SectionGlow from "../components/SectionGlow";
import TypewriterTitle from "../components/TypewriterTitle";
import { Calendar, MapPin, Mail, Github, Linkedin } from "lucide-react";

const profile = {
  tagline: "Data & Software Engineering · CS (Honours) @ University Of New Brunswick",
  summary:
    "Experienced Data and Software Engineer graduating with a first class honors in May 2026. Skilled in designing and optimizing data pipelines. Brings hands-on experience developing ETL processes and building applications integrated with enterprise systems like SAP. Proficient in Java, Python, SQL, Docker, and BI tools including Power BI and Tableau",
  location: "New Brunswick, Canada",
  availability: "New-grad roles (2026)",
  email: "salmanbasha.shaik@unb.ca",
  linkedin: "https://www.linkedin.com/in/salman-shaik-798727225",
  github: "https://github.com/salmanbashashaik",
};

export default function Home() {
  return (
    <Container>
      {/* Intro Section */}
      <section className="relative py-16 md:py-24">
        <SectionGlow />
        <p className="relative text-sm font-medium text-indigo-700 dark:text-indigo-300">
          {profile.tagline}
        </p>
        <h1 className="relative mt-3 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          <TypewriterTitle items={["Data Engineer", "Software Developer", "Bioinformatician"]} />
        </h1>
        <p className="relative mt-4 text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
          {profile.summary}
        </p>

        <div className="relative mt-6 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300/70 dark:border-neutral-700 px-3 py-1 text-xs md:text-sm">
            <MapPin className="h-4 w-4" /> {profile.location}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-300/70 dark:border-neutral-700 px-3 py-1 text-xs md:text-sm">
            <Calendar className="h-4 w-4" /> {profile.availability}
          </span>
        </div>

        <div className="relative mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/resume.pdf"
            download="Shaik_Salman_Basha_Resume.pdf"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
          >
            Download Resume (PDF)
          </a>
        </div>
      </section>

      {/* Contact Me Section */}
      <section className="relative py-12 border-t border-neutral-300/50 dark:border-neutral-700/50">
        <h2 className="text-2xl font-semibold tracking-tight text-center">Contact Me</h2>
        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center items-center text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 px-4 py-2"
          >
            <Mail size={16} /> {profile.email}
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 px-4 py-2"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 px-4 py-2"
          >
            <Github size={16} /> GitHub
          </a>
        </div>
      </section>
    </Container>
  );
}
