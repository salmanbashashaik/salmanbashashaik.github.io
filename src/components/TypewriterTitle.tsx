import React, { useEffect, useMemo, useRef, useState } from "react";

/** Typewriter that cycles through items */
export default function TypewriterTitle({
  items,
  typeSpeed = 50,
  eraseSpeed = 35,
  holdTime = 900,
  gapTime = 300,
}: {
  items: string[];
  typeSpeed?: number;
  eraseSpeed?: number;
  holdTime?: number;
  gapTime?: number;
}) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">("typing");
  const indexRef = useRef(0);

  const target = items[indexRef.current % items.length];
  const nextTarget = useMemo(
    () => items[(indexRef.current + 1) % items.length],
    [items, indexRef.current]
  );

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | null = null;

    if (phase === "typing") {
      if (text.length < target.length) {
        t = setTimeout(() => setText(target.slice(0, text.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("holding"), holdTime);
      }
    } else if (phase === "holding") {
      t = setTimeout(() => setPhase("erasing"), holdTime);
    } else if (phase === "erasing") {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), eraseSpeed);
      } else {
        indexRef.current += 1;
        t = setTimeout(() => setPhase("typing"), gapTime);
      }
    }

    return () => t && clearTimeout(t);
  }, [text, phase, target, typeSpeed, eraseSpeed, holdTime, gapTime]);

  return (
    <span className="inline-flex items-center">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-sky-500">
        {text || nextTarget.slice(0, 0)}
      </span>
      <span className="ml-0.5 h-[1.1em] w-[0.5ch] animate-pulse rounded-sm bg-indigo-500/70 dark:bg-indigo-400/80" />
    </span>
  );
}
