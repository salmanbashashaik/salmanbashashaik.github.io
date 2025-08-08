import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Container from "./components/Container";
import Background from "./components/Background";

import Home from "./pages/Home";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 to-white dark:from-neutral-950 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Background />

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/education" element={<Education />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </main>

      <footer className="border-t border-neutral-200/70 dark:border-neutral-800 mt-16">
        <Container>
          <div className="py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} Shaik Salman Basha</span>
            <div className="text-neutral-500 dark:text-neutral-400">Built with React + Tailwind</div>
          </div>
        </Container>
      </footer>
    </div>
  );
}
