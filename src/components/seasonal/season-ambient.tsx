import type { CSSProperties, ReactNode } from "react";
import { Heart, Sparkle } from "lucide-react";

// Fixed values (not Math.random) so server and client markup always match.
// Kept sparse and faint: the season should register, never pull focus.

type Particle = {
  left: number; // %
  top?: number; // %
  size: number; // px
  duration: number; // s
  delay: number; // s (negative = already mid-flight on first paint)
  drift?: number; // px
  spin?: number; // deg
};

const SNOW: Particle[] = [
  { left: 4, size: 3, duration: 16, delay: -2, drift: 18 },
  { left: 11, size: 2, duration: 21, delay: -11, drift: -12 },
  { left: 19, size: 4, duration: 18, delay: -6, drift: 10 },
  { left: 27, size: 2, duration: 23, delay: -15, drift: 16 },
  { left: 34, size: 3, duration: 17, delay: -9, drift: -18 },
  { left: 42, size: 2, duration: 20, delay: -3, drift: 12 },
  { left: 50, size: 3, duration: 22, delay: -13, drift: -10 },
  { left: 57, size: 2, duration: 16, delay: -7, drift: 14 },
  { left: 64, size: 4, duration: 19, delay: -17, drift: -16 },
  { left: 71, size: 2, duration: 24, delay: -5, drift: 10 },
  { left: 78, size: 3, duration: 18, delay: -12, drift: -12 },
  { left: 85, size: 2, duration: 21, delay: -1, drift: 18 },
  { left: 92, size: 3, duration: 17, delay: -14, drift: -14 },
  { left: 97, size: 2, duration: 22, delay: -8, drift: 8 },
];

const HEARTS: Particle[] = [
  { left: 8, top: 92, size: 10, duration: 19, delay: -4, drift: 14 },
  { left: 23, top: 96, size: 8, duration: 23, delay: -14, drift: -10 },
  { left: 46, top: 94, size: 9, duration: 21, delay: -9, drift: 12 },
  { left: 61, top: 98, size: 7, duration: 25, delay: -2, drift: -14 },
  { left: 88, top: 95, size: 10, duration: 20, delay: -17, drift: 10 },
];

const SPARKLES: Particle[] = [
  { left: 6, top: 18, size: 10, duration: 3.2, delay: -0.4 },
  { left: 18, top: 72, size: 8, duration: 4.1, delay: -2.1 },
  { left: 41, top: 9, size: 9, duration: 3.6, delay: -1.2 },
  { left: 55, top: 86, size: 7, duration: 4.4, delay: -3.0 },
  { left: 67, top: 6, size: 8, duration: 3.9, delay: -0.9 },
  { left: 93, top: 64, size: 10, duration: 3.4, delay: -2.6 },
];

const CONFETTI: Particle[] = [
  { left: 7, size: 6, duration: 17, delay: -3, drift: 22, spin: 280 },
  { left: 18, size: 5, duration: 21, delay: -12, drift: -16, spin: -220 },
  { left: 31, size: 6, duration: 19, delay: -7, drift: 14, spin: 320 },
  { left: 44, size: 4, duration: 23, delay: -16, drift: -20, spin: -260 },
  { left: 58, size: 6, duration: 18, delay: -1, drift: 18, spin: 240 },
  { left: 71, size: 5, duration: 22, delay: -10, drift: -12, spin: -300 },
  { left: 84, size: 6, duration: 20, delay: -5, drift: 16, spin: 260 },
  { left: 95, size: 4, duration: 24, delay: -14, drift: -18, spin: -240 },
];

const CONFETTI_COLORS = ["var(--season)", "var(--season-2)", "#eab308"];

// Plum-blossom petals: the spring-festival flower across East Asia.
const PETALS: Particle[] = [
  { left: 9, size: 7, duration: 22, delay: -4, drift: 40, spin: 220 },
  { left: 24, size: 6, duration: 26, delay: -15, drift: -30, spin: -260 },
  { left: 38, size: 8, duration: 24, delay: -9, drift: 36, spin: 300 },
  { left: 63, size: 6, duration: 27, delay: -19, drift: -34, spin: -240 },
  { left: 79, size: 7, duration: 23, delay: -2, drift: 30, spin: 280 },
  { left: 94, size: 6, duration: 25, delay: -12, drift: -26, spin: -220 },
];

// Embers / fireflies drifting up through the dusk.
const EMBERS: Particle[] = [
  { left: 7, top: 94, size: 3, duration: 14, delay: -3, drift: 16 },
  { left: 21, top: 98, size: 2, duration: 18, delay: -11, drift: -12 },
  { left: 36, top: 96, size: 3, duration: 16, delay: -6, drift: 10 },
  { left: 58, top: 99, size: 2, duration: 19, delay: -15, drift: -14 },
  { left: 74, top: 95, size: 3, duration: 15, delay: -1, drift: 12 },
  { left: 91, top: 97, size: 2, duration: 17, delay: -9, drift: -10 },
];

const motion = (p: Particle, animation: string): CSSProperties =>
  ({
    left: `${p.left}%`,
    top: p.top === undefined ? 0 : `${p.top}%`,
    animation: `${animation} ${p.duration}s ${p.delay}s infinite`,
    "--drift": `${p.drift ?? 0}px`,
    "--spin": `${p.spin ?? 0}deg`,
  }) as CSSProperties;

function Layer({ season, children }: { season: string; children: ReactNode }) {
  return (
    <div
      aria-hidden
      data-season-only={season}
      data-season-ambient=""
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {children}
    </div>
  );
}

/** Hero background: an accent glow for every season, plus faint drifting particles for some. */
function SeasonAmbient() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 season-glow"
      />

      <Layer season="christmas">
        {SNOW.map((p, i) => (
          <span
            key={i}
            className="season-particle rounded-full bg-muted-foreground opacity-35"
            style={{
              ...motion(p, "season-fall linear"),
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </Layer>

      <Layer season="valentines">
        {HEARTS.map((p, i) => (
          <Heart
            key={i}
            className="season-particle text-season-2"
            style={{
              ...motion(p, "season-rise ease-in-out"),
              ["--peak" as string]: 0.4,
            }}
            size={p.size}
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </Layer>

      <Layer season="new-year">
        {SPARKLES.map((p, i) => (
          <Sparkle
            key={i}
            className="season-particle text-season-2 opacity-60"
            style={motion(p, "season-twinkle ease-in-out")}
            size={p.size}
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </Layer>

      <Layer season="lunar-new-year">
        {PETALS.map((p, i) => (
          <span
            key={i}
            className="season-particle rounded-[70%_0_70%_0] opacity-45"
            style={{
              ...motion(p, "season-fall linear"),
              width: p.size,
              height: p.size,
              background: "color-mix(in oklab, var(--season-2) 55%, #ffd6dc)",
            }}
          />
        ))}
      </Layer>

      <Layer season="halloween">
        {EMBERS.map((p, i) => (
          <span
            key={i}
            className="season-particle rounded-full bg-season"
            style={{
              ...motion(p, "season-rise ease-in-out"),
              ["--peak" as string]: 0.55,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 6px var(--season)",
            }}
          />
        ))}
      </Layer>

      <Layer season="birthday">
        {CONFETTI.map((p, i) => (
          <span
            key={i}
            className="season-particle rounded-[1px] opacity-45"
            style={{
              ...motion(p, "season-fall linear"),
              width: p.size,
              height: p.size * 0.5,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            }}
          />
        ))}
      </Layer>
    </>
  );
}

export { SeasonAmbient };
