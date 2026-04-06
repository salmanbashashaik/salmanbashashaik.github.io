import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";

const BOOT_LINES = [
  "Initializing system...",
  "Loading experience data...",
  "Mounting pipeline modules...",
  "System ready. Launching...",
];

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  },
};

export default function Hero() {
  const [booting, setBooting] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const handleExplore = () => {
    if (booting) return;
    setBooting(true);
    setBootLines([]);
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setBootLines((prev) => [...prev, line]);
        if (i === BOOT_LINES.length - 1) {
          setTimeout(() => {
            setBooting(false);
            setBootLines([]);
            document.getElementById("education")?.scrollIntoView({ behavior: "smooth" });
          }, 500);
        }
      }, i * 380);
    });
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center px-4 pt-[60px]">
      {/* Single ambient blob — subtle */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div
          className="animate-blob absolute rounded-full"
          style={{
            width: "700px", height: "700px",
            top: "-200px", left: "-150px",
            background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
            filter: "blur(120px)",
            opacity: 0.1,
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl w-full md:px-4">
        <motion.div variants={stagger.container} initial="initial" animate="animate" className="max-w-2xl">

          {/* Status pill */}
          <motion.div variants={stagger.item} className="mb-8">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
              style={{
                background: "var(--accent-subtle)",
                border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
                color: "var(--accent-2)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse-ring" style={{ background: "#4ade80" }} />
              Incoming MMath @ University of Waterloo · Fall 2026
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={stagger.item}
            className="mb-4 leading-[1.05] tracking-[-0.035em]"
            style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "clamp(2.6rem,7.5vw,5rem)", color: "var(--text)" }}
          >
            Shaik Salman Basha
          </motion.h1>

          {/* Role */}
          <motion.p
            variants={stagger.item}
            className="text-[clamp(0.95rem,2vw,1.15rem)] font-medium mb-5 tracking-[-0.01em]"
            style={{ color: "var(--text-2)", fontFamily: "var(--font-heading)" }}
          >
            Data Engineer · AI / ML · NLP
          </motion.p>

          {/* Summary */}
          <motion.p
            variants={stagger.item}
            className="text-[15px] leading-[1.8] max-w-lg mb-8"
            style={{ color: "var(--text-2)" }}
          >
            CS Honours + Math Minor from UNB. Heading to{" "}
            <span style={{ color: "var(--text)" }} className="font-medium">Waterloo for my MMath</span>{" "}
            in Fall 2026. 16 months co-op building data pipelines, ML systems, and NLP tools at scale.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={stagger.item} className="flex flex-wrap gap-3 mb-8">
            <a
              href="/resume-g.pdf"
              download="Shaik_Salman_Basha_Resume.pdf"
              className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200"
              style={{ background: "var(--accent)", color: "#fff", fontFamily: "var(--font-heading)" }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px var(--accent-glow)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              Download Resume
            </a>
            <button
              onClick={handleExplore}
              className="px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200"
              style={{
                border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
                color: "var(--accent-2)",
                background: "var(--accent-subtle)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {booting ? "Booting..." : "Explore System →"}
            </button>
          </motion.div>

          {/* Boot terminal */}
          <AnimatePresence>
            {booting && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 rounded-xl p-3 space-y-1"
                style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)", border: "1px solid var(--border)", maxWidth: "300px" }}
              >
                {bootLines.map((line, i) => (
                  <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: i === bootLines.length - 1 ? "#4ade80" : "var(--text-2)" }}>
                    <span style={{ color: "var(--accent)" }}>&gt; </span>{line}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Socials */}
          <motion.div variants={stagger.item} className="flex items-center gap-2.5">
            {[
              { href: "https://github.com/salmanbashashaik", icon: Github, label: "GitHub" },
              { href: "https://www.linkedin.com/in/salman-shaik-798727225", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:salmanbasha.shaik@unb.ca", icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label} href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer" aria-label={label}
                className="p-2.5 rounded-xl transition-all duration-200"
                style={{ border: "1px solid var(--border)", color: "var(--text-3)", background: "var(--surface)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-3)"; }}
              >
                <Icon size={16} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-float transition-colors duration-200"
        style={{ color: "var(--text-3)" }} aria-label="Scroll down"
      >
        <ArrowDown size={18} />
      </motion.button>
    </section>
  );
}
