import Section from "./Section";
import { Reveal } from "../lib/motion";
import LatentMap from "./viz/LatentMap";

export default function Distribution() {
  return (
    <Section
      id="distribution"
      index="05"
      title="Distribution"
      aside={
        <p className="annotation text-[0.85rem] leading-relaxed">
          Drag the sample out of the clusters. Everything on this page is
          evaluated in the region where it stops being supported.
        </p>
      }
    >
      <Reveal>
        <p className="lede max-w-[58ch]">
          A model is only as good as the neighbourhood it was fit in. Move a
          sample far enough from the cohorts it learned, and confidence stops
          meaning anything.
        </p>
        <p className="mt-6 max-w-[58ch] text-[0.94rem]" style={{ color: "var(--ink-2)" }}>
          Each cloud below is a cohort in a two-dimensional stand-in for the
          model's latent space. The gaps between them are where cross-cohort
          transfer actually happens — a new hospital, a different sequencing
          assay, a pediatric scan when every training example was an adult. That
          gap is the whole research problem, so it seemed worth letting you
          stand in it.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <LatentMap className="mt-10" />
      </Reveal>
    </Section>
  );
}
