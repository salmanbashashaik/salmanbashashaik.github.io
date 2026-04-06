import { ThemeProvider } from "./theme";
import Header from "./components/Header";
import ParticleField from "./components/ParticleField";
import CursorGlow from "./components/CursorGlow";
import SystemPanel from "./components/SystemPanel";
import Hero from "./components/Hero";
import PipelineViz from "./components/PipelineViz";
import SystemStatus from "./components/SystemStatus";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ContactSection from "./components/ContactSection";
import Container from "./components/Container";

export default function App() {
  return (
    <ThemeProvider>
      <div className="noise min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <ParticleField />
        <CursorGlow />
        <Header />
        <SystemPanel />

        <main>
          <Hero />
          <PipelineViz />

          <Container>
            <SystemStatus />
          </Container>

          <div className="divider my-20 mx-4 md:mx-8" />
          <EducationSection />

          <div className="divider mx-4 md:mx-8" />
          <ExperienceSection />

          <div className="divider mx-4 md:mx-8" />
          <ProjectsSection />

          <div className="divider mx-4 md:mx-8" />
          <SkillsSection />

          <div className="divider mx-4 md:mx-8" />
          <ContactSection />
        </main>

        <footer className="py-10 text-center" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[12px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>
            © {new Date().getFullYear()} Shaik Salman Basha
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
