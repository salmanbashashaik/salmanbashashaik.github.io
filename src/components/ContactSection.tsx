import { motion } from "framer-motion";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import SectionHeader from "./SectionHeader";

const LINKS = [
  { label: "Email", value: "salmanbasha.shaik@unb.ca", href: "mailto:salmanbasha.shaik@unb.ca", icon: Mail },
  { label: "LinkedIn", value: "salman-shaik-798727225", href: "https://www.linkedin.com/in/salman-shaik-798727225", icon: Linkedin },
  { label: "GitHub", value: "salmanbashashaik", href: "https://github.com/salmanbashashaik", icon: Github },
];

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader label="// get in touch" title="Contact" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[15px] leading-[1.75] mb-5" style={{ color: "var(--text-2)" }}>
              I'm heading to{" "}
              <span style={{ color: "var(--text)" }} className="font-medium">
                Waterloo for my MMath
              </span>{" "}
              in Fall 2026, and open to interesting conversations about research, data engineering,
              and AI/ML — now and beyond.
            </p>
            <div
              className="inline-flex items-center gap-2 text-[13px]"
              style={{ color: "var(--text-3)" }}
            >
              <MapPin size={13} />
              New Brunswick, Canada · Open to remote
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            {LINKS.map(({ label, value, href, icon: Icon }, i) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3.5 p-4 rounded-xl surface grad-border transition-all duration-200 group"
              >
                <div
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{
                    background: "var(--accent-subtle)",
                    border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={15} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                    {label}
                  </p>
                  <p
                    className="text-[13px] font-medium font-mono transition-colors duration-200 group-hover:text-[var(--accent)]"
                    style={{ color: "var(--text)" }}
                  >
                    {value}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
