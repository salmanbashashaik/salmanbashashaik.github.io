import Container from "../components/Container";
import Card from "../components/Card";
import SectionGlow from "../components/SectionGlow";
import { Github, Linkedin, Mail } from "lucide-react";

const email = "salmanbasha.shaik@unb.ca";
const linkedin = "https://www.linkedin.com/in/salman-shaik-798727225";
const github = "https://github.com/salmanbashashaik";

export default function Contact() {
  return (
    <Container>
      <section className="relative py-12">
        <SectionGlow />
        <h2 className="relative text-2xl font-semibold tracking-tight">Contact</h2>
        <div className="relative mt-5">
          <Card>
            <div className="p-5 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
              >
                <Mail size={16} /> Email
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 px-4 py-2 text-sm"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 px-4 py-2 text-sm"
              >
                <Github size={16} /> GitHub
              </a>
            </div>
          </Card>
        </div>
      </section>
    </Container>
  );
}
