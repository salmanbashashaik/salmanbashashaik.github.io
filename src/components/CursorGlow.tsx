import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf: number;
    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cx = lerp(cx, x, 0.06);
      cy = lerp(cy, y, 0.06);
      el.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-0 hidden md:block"
      style={{
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 70%)",
        filter: "blur(80px)",
        willChange: "transform",
      }}
    />
  );
}
