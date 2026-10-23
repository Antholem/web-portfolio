import type { ReactNode } from "react";
import { Heart, Sparkle } from "lucide-react";

/**
 * Small ornaments anchored to the hero portrait card — the one place each
 * season is unmistakable, away from the text people read. Decorative only.
 */

function Decor({ season, children }: { season: string; children: ReactNode }) {
  return (
    <div
      aria-hidden
      data-season-only={season}
      data-season-decor=""
      className="pointer-events-none absolute inset-0 z-10"
    >
      {children}
    </div>
  );
}

const BULB_COLORS = ["var(--season)", "#eab308", "var(--season-2)"];
const BULBS = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.5) / 9;
  // Sag of a wire hung between three hooks (three shallow arcs).
  const arc = (t * 3) % 1;
  return { left: t * 100, top: 4 + Math.sin(arc * Math.PI) * 7 };
});

function StringLights() {
  return (
    <div className="absolute inset-x-6 -top-1.5 h-6">
      <svg
        viewBox="0 0 300 24"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full text-subtle-foreground/60"
      >
        <path
          d="M0 4 Q50 18 100 4 T200 4 T300 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {BULBS.map((bulb, i) => (
        <span
          key={i}
          className="absolute size-2 -translate-x-1/2 rounded-full"
          style={{
            left: `${bulb.left}%`,
            top: `${bulb.top}px`,
            background: BULB_COLORS[i % BULB_COLORS.length],
            boxShadow: `0 0 8px ${BULB_COLORS[i % BULB_COLORS.length]}`,
            animation: `season-twinkle ${2.6 + (i % 3) * 0.7}s ${-i * 0.45}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Lantern({
  className,
  delay,
  size,
}: {
  className: string;
  delay: number;
  size: number;
}) {
  return (
    <svg
      viewBox="0 0 24 56"
      width={size}
      height={(size * 56) / 24}
      className={`absolute origin-top ${className}`}
      style={{ animation: `season-sway 5.5s ${delay}s ease-in-out infinite` }}
    >
      <line
        x1="12"
        y1="0"
        x2="12"
        y2="12"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      <rect x="7" y="12" width="10" height="3" rx="1" fill="var(--season)" />
      <ellipse cx="12" cy="26" rx="10" ry="11" fill="var(--season-2)" />
      <path
        d="M12 15v22M6.5 17.5c-2 5.5-2 11.5 0 17M17.5 17.5c2 5.5 2 11.5 0 17"
        stroke="var(--season)"
        strokeOpacity="0.55"
        fill="none"
      />
      <rect x="7" y="36" width="10" height="3" rx="1" fill="var(--season)" />
      <path
        d="M12 39v10M10 41v8M14 41v8"
        stroke="var(--season)"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Corner web: spokes from the corner, sagging threads between them.
const WEB = (() => {
  const angles = [0, 22.5, 45, 67.5, 90].map((a) => (a * Math.PI) / 180);
  const point = (r: number, a: number) =>
    [r * Math.cos(a), r * Math.sin(a)] as const;
  const spokes = angles.map((a) => point(78, a));
  const rings = [22, 42, 62].map((r) =>
    angles
      .slice(1)
      .map((a, i) => {
        const [x1, y1] = point(r, angles[i]);
        const [x2, y2] = point(r, a);
        const [cx, cy] = point(r * 0.86, (angles[i] + a) / 2);
        return `${i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)} ` : ""}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      })
      .join(" "),
  );
  return { spokes, rings };
})();

function Cobweb() {
  return (
    <svg
      viewBox="0 0 80 80"
      className="absolute right-0 bottom-0 size-24 rotate-180 text-muted-foreground/45"
    >
      {WEB.spokes.map(([x, y], i) => (
        <line
          key={i}
          x1="0"
          y1="0"
          x2={x.toFixed(1)}
          y2={y.toFixed(1)}
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}
      {WEB.rings.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  );
}

function Bat({ className, delay }: { className: string; delay: number }) {
  return (
    <svg
      viewBox="0 0 32 14"
      className={`absolute w-7 text-season-2 ${className}`}
      style={{ animation: `season-bob 4s ${delay}s ease-in-out infinite` }}
    >
      <path
        fill="currentColor"
        d="M16 4.2c.7-1.6 1.4-2.4 2-2.4l.5 1.7 1.6-.8c1.4 2.2 4.2 3.2 9.4 2.4-2 1.4-2.8 3.4-2.8 5.9-1.7-1.4-3.7-1.7-5.7-.8-1.1.5-2 1.4-2.8 3.1-.8-1.7-1.7-2.6-2.8-3.1-2-.9-4-.6-5.7.8 0-2.5-.8-4.5-2.8-5.9 5.2.8 8-.2 9.4-2.4l1.6.8.5-1.7c.6 0 1.3.8 2 2.4z"
      />
    </svg>
  );
}

const CONFETTI = [
  { x: 82, y: -10, r: 20, c: 0 },
  { x: 90, y: -4, r: -35, c: 1 },
  { x: 74, y: -14, r: 55, c: 2 },
  { x: 96, y: 4, r: -15, c: 0 },
  { x: 86, y: 8, r: 40, c: 2 },
  { x: 68, y: -6, r: -50, c: 1 },
  { x: 93, y: 16, r: 70, c: 1 },
  { x: 78, y: 2, r: -25, c: 2 },
];
const CONFETTI_COLORS = ["var(--season)", "var(--season-2)", "#eab308"];

/** Rendered inside the portrait wrapper (position: relative). */
function SeasonDecor() {
  return (
    <>
      <Decor season="christmas">
        <StringLights />
      </Decor>

      <Decor season="lunar-new-year">
        <Lantern
          className="-top-11 right-8 text-subtle-foreground"
          delay={0}
          size={22}
        />
        <Lantern
          className="-top-9 right-17 text-subtle-foreground"
          delay={-1.8}
          size={16}
        />
      </Decor>

      <Decor season="halloween">
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <Cobweb />
        </div>
        <Bat className="-top-5 right-10" delay={0} />
        <Bat className="-top-9 right-22 w-5 opacity-70" delay={-1.6} />
      </Decor>

      <Decor season="valentines">
        {[
          { size: 16, cls: "-top-3 right-6", delay: 0 },
          { size: 11, cls: "top-1 right-12", delay: -1.3 },
          { size: 9, cls: "-top-5 right-16", delay: -2.4 },
        ].map((h, i) => (
          <Heart
            key={i}
            size={h.size}
            fill="currentColor"
            strokeWidth={0}
            className={`absolute ${h.cls} ${i === 1 ? "text-season-2" : "text-season"}`}
            style={{
              animation: `season-bob 3.6s ${h.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </Decor>

      <Decor season="new-year">
        {[
          { size: 18, cls: "-top-3 right-7", delay: 0 },
          { size: 11, cls: "top-3 right-2", delay: -1.1 },
          { size: 9, cls: "-top-4 right-15", delay: -2 },
        ].map((s, i) => (
          <Sparkle
            key={i}
            size={s.size}
            fill="currentColor"
            strokeWidth={0}
            className={`absolute ${s.cls} ${i === 1 ? "text-season" : "text-season-2"}`}
            style={{
              animation: `season-twinkle 2.8s ${s.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </Decor>

      <Decor season="birthday">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute h-1 w-2.5 rounded-[1px]"
            style={{
              left: `${c.x}%`,
              top: `${c.y}px`,
              background: CONFETTI_COLORS[c.c],
              transform: `rotate(${c.r}deg)`,
            }}
          />
        ))}
      </Decor>
    </>
  );
}

export { SeasonDecor };
