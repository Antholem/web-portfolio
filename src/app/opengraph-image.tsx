import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { siteConfig } from "@/constants/site";
import { hero } from "@/lib/data";
import { SITE_URL } from "@/lib/site-url";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dataUri = (png: Buffer) =>
  `data:image/png;base64,${png.toString("base64")}`;

// Read once per build: the image is static, so this never runs per request.
// Literal paths, so the bundler can trace exactly these files.
const [sans, sansSemiBold, mono, portrait, monogram] = await Promise.all([
  readFile(
    join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf",
    ),
  ),
  readFile(
    join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf",
    ),
  ),
  readFile(
    join(
      process.cwd(),
      "node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf",
    ),
  ),
  readFile(join(process.cwd(), "public/images/portrait-hero.png")),
  readFile(join(process.cwd(), "public/images/logo-sa.png")),
]);

// Dark-theme tokens from globals.css (Satori cannot read CSS variables).
const C = {
  background: "#0a0a0a",
  foreground: "#fafafa",
  muted: "#a1a1a1",
  subtle: "#8f8f8f",
  border: "#232323",
  input: "#363636",
  success: "#3ecf8e",
  stage:
    "radial-gradient(120% 90% at 50% 28%, #2e2e31 0%, #19191b 55%, #111112 100%)",
  gridLine: "rgba(255, 255, 255, 0.05)",
};

// Portrait frame; the photo's head sits at 45.3% of its width (see HeroPortrait).
const FRAME = { width: 420, height: 518 };
const PHOTO = { width: 470, height: Math.round((470 * 1581) / 1100) };

export default function Image() {
  const tagline = hero.tagline.replace(/\*\*/g, "");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "56px 64px 56px 72px",
        background: C.background,
        backgroundImage: `linear-gradient(${C.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${C.gridLine} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        color: C.foreground,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 610,
          height: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: C.foreground,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>. */}
            <img src={dataUri(monogram)} width={36} height={30} alt="" />
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span
              style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.5 }}
            >
              {siteConfig.handle}
            </span>
            <span
              style={{
                fontFamily: "Geist Mono",
                fontSize: 18,
                color: C.subtle,
              }}
            >
              / {siteConfig.role.toLowerCase()}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: -3.4,
            }}
          >
            <span>{hero.nameLines[0]}</span>
            <span style={{ color: C.muted }}>{hero.nameLines[1]}</span>
          </div>
          <div style={{ fontSize: 26, lineHeight: 1.45, color: C.muted }}>
            {tagline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 18px",
              borderRadius: 999,
              border: `1px solid ${C.input}`,
              fontSize: 18,
              color: C.muted,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: C.success,
              }}
            />
            {hero.availability}
          </div>
          <span
            style={{ fontFamily: "Geist Mono", fontSize: 17, color: C.subtle }}
          >
            {SITE_URL.host}
          </span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "relative",
          overflow: "hidden",
          width: FRAME.width,
          height: FRAME.height,
          borderRadius: 28,
          border: `1px solid ${C.border}`,
          backgroundImage: C.stage,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>. */}
        <img
          src={dataUri(portrait)}
          width={PHOTO.width}
          height={PHOTO.height}
          alt=""
          style={{
            position: "absolute",
            top: 18,
            left: Math.round(FRAME.width / 2 - PHOTO.width * 0.453),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 22,
            right: 22,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Geist Mono",
            fontSize: 13,
            letterSpacing: 0.8,
            color: C.subtle,
          }}
        >
          <span>{siteConfig.location.coordinates}</span>
          <span>{hero.portraitCaption}</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: sans, weight: 400, style: "normal" },
        { name: "Geist", data: sansSemiBold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
