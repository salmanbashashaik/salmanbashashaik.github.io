interface SectionHeaderProps {
  label: string;
  title: string;
}

export default function SectionHeader({ label, title }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <p className="section-label mb-3">{label}</p>
      <h2
        className="text-[clamp(1.8rem,4vw,2.75rem)] font-extrabold tracking-[-0.03em] leading-none"
        style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
      >
        {title}
      </h2>
    </div>
  );
}
