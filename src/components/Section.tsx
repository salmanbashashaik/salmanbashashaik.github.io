import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  // oversized numeral drifts against the scroll behind the title
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  return (
    <section ref={ref} id={id} style={{ borderTop: "1px solid var(--border-soft)" }}>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-[200px_1fr] gap-10 md:gap-16 items-start">
        <Reveal>
          <div className="relative md:sticky md:top-28 flex md:block items-baseline gap-4">
            <motion.span aria-hidden className="ghost-num hidden md:block" style={{ y: ghostY }}>
              {index}
            </motion.span>
            <p className="eyebrow relative z-10 mb-0 md:mb-3">{index}</p>
            <h2 className="display relative z-10 text-[2rem] md:text-[2.4rem]">{title}</h2>
          </div>
        </Reveal>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
