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

/* ------------------------------- Christmas ------------------------------- */

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
      {BULBS.map((bulb, i) => {
        const color = BULB_COLORS[i % BULB_COLORS.length];
        return (
          <span
            key={i}
            className="absolute -translate-x-1/2"
            style={{ left: `${bulb.left}%`, top: `${bulb.top}px` }}
          >
            {/* Socket */}
            <span className="absolute -top-0.75 left-1/2 h-1 w-1.25 -translate-x-1/2 rounded-[1px] bg-subtle-foreground" />
            <span
              className="block h-2.75 w-2 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 9px ${color}`,
                animation: `season-twinkle ${2.6 + (i % 3) * 0.7}s ${-i * 0.45}s ease-in-out infinite`,
              }}
            />
          </span>
        );
      })}
    </div>
  );
}

/* ---------------------------- Lunar New Year ----------------------------- */

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
      style={{
        animation: `season-sway 5.5s ${delay}s ease-in-out infinite`,
        filter:
          "drop-shadow(0 0 7px color-mix(in oklab, var(--season-2) 50%, transparent))",
      }}
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
      <ellipse cx="9" cy="22" rx="2.5" ry="5" fill="#fff" fillOpacity="0.18" />
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

/* ------------------------------- Halloween ------------------------------- */

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

function JackOLantern({ className }: { className: string }) {
  const rib = "color-mix(in oklab, var(--season) 78%, #000)";
  return (
    <svg viewBox="0 0 44 38" className={`absolute ${className}`}>
      <path
        d="M21.5 9c0-3.2 1-5.6 3.8-7"
        stroke="#6b5a35"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="13" cy="23" rx="11" ry="12.5" style={{ fill: rib }} />
      <ellipse cx="31" cy="23" rx="11" ry="12.5" style={{ fill: rib }} />
      <ellipse cx="22" cy="23" rx="11.5" ry="13.5" fill="var(--season)" />
      {/* Candle-lit face */}
      <g
        fill="#fde68a"
        style={{ animation: "season-flicker 3.2s ease-in-out infinite" }}
      >
        <path d="M12.5 19.5l4.5-4.5 2 6z" />
        <path d="M31.5 19.5l-4.5-4.5-2 6z" />
        <path d="M22 21.5l-1.8 3h3.6z" />
        <path d="M11.5 27c3.5 5 17.5 5 21 0l-2.6.6-1.6 1.8-1.8-1.6-2.4 1.8-2.2-1.8-2.4 1.8-1.8-1.6-1.6 1.6z" />
      </g>
    </svg>
  );
}

/* ------------------------------- Birthday -------------------------------- */

function Balloon({
  className,
  color,
  delay,
}: {
  className: string;
  color: string;
  delay: number;
}) {
  return (
    <svg
      viewBox="0 0 24 46"
      className={`absolute ${className}`}
      style={{ animation: `season-bob 4.6s ${delay}s ease-in-out infinite` }}
    >
      <path
        d="M12 27c-2.6 3.5 2.6 6.5 0 10s2 5.5 0 8"
        stroke="currentColor"
        strokeOpacity="0.5"
        fill="none"
      />
      <ellipse cx="12" cy="13" rx="10" ry="12" fill={color} />
      <ellipse cx="8" cy="8.5" rx="2.4" ry="4" fill="#fff" fillOpacity="0.32" />
      <path d="M10.4 24.6h3.2L12 27z" fill={color} />
    </svg>
  );
}

const CONFETTI = [
  { x: 70, y: -8, r: 20, c: 2 },
  { x: 62, y: 2, r: -35, c: 0 },
  { x: 96, y: 6, r: 55, c: 1 },
  { x: 88, y: 14, r: -15, c: 2 },
  { x: 76, y: 10, r: 40, c: 1 },
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
        <JackOLantern className="right-14 -bottom-3.5 w-12" />
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
        <span className="absolute -top-3 left-6 rounded-full border border-season/40 bg-card px-2.5 py-0.5 font-mono text-[11px] tracking-[0.08em] text-season shadow-elevated">
          <span className="season-year" />
        </span>
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
        <Balloon
          className="-top-13 right-5 w-7 text-subtle-foreground"
          color="var(--season)"
          delay={0}
        />
        <Balloon
          className="-top-9 right-13 w-5 text-subtle-foreground"
          color="var(--season-2)"
          delay={-1.7}
        />
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
