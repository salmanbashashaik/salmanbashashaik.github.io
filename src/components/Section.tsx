import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "../lib/motion";

export default function Section({
  id,
  index,
  title,
  aside,
  children,
}: {
  id: string;
  index: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // the oversized numeral drifts against the scroll, behind the heading
  const y = useTransform(scrollYProgress, [0, 1], [56, -56]);

  return (
    <section
      ref={ref}
      id={id}
      className="relative"
      style={{ borderTop: "1px solid var(--rule-soft)" }}
    >
      <div className="relative mx-auto max-w-[1120px] px-6 md:px-10 py-24 md:py-36 grid md:grid-cols-[210px_1fr] gap-10 md:gap-16 items-start">
        <Reveal>
          <div className="md:sticky md:top-28">
            <div className="relative">
              <motion.span
                aria-hidden
                style={{ y }}
                className="ghost absolute -top-8 -left-2 hidden md:block"
              >
                {index}
              </motion.span>
              <p className="eyebrow relative">{index}</p>
              <h2 className="display relative mt-2 text-[2rem] md:text-[2.35rem]">{title}</h2>
              {aside && <div className="relative mt-5 max-w-[24ch]">{aside}</div>}
            </div>
          </div>
        </Reveal>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
