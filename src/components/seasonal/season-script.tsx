import { SEASON_CONFIG } from "@/constants/seasons";
import { seasonBootScript } from "@/lib/seasons";

/** Sets <html data-season> before first paint, from the visitor's own date. */
function SeasonScript() {
  return (
    <script
      // Static, build-time string built from our own config — no user input.
      dangerouslySetInnerHTML={{ __html: seasonBootScript(SEASON_CONFIG) }}
    />
  );
}

export { SeasonScript };
