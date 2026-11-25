import { Reveal } from "../lib/motion";

export default function Section({
  id,
  title,
  aside,
  children,
}: {
  id: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative"
      style={{ borderTop: "1px solid var(--rule-soft)" }}
    >
      <div className="relative mx-auto max-w-[1120px] px-6 md:px-10 py-24 md:py-36 grid md:grid-cols-[210px_1fr] gap-10 md:gap-16 items-start">
        <Reveal>
          <div className="md:sticky md:top-28">
            <div className="relative">
              <h2 className="display relative text-[2rem] md:text-[2.35rem]">{title}</h2>
              {aside && <div className="relative mt-5 max-w-[24ch]">{aside}</div>}
            </div>
          </div>
        </Reveal>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
