import React from "react";

/** Radial glow that sits behind a section’s content */
export default function SectionGlow() {
  return (
    <div
      aria-hidden
      className="absolute -inset-8 bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/20 to-sky-500/20 blur-3xl"
    />
  );
}
