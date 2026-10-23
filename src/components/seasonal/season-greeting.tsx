import { SEASONS } from "@/constants/seasons";

/** One pill per season; CSS shows only the one matching <html data-season>. */
function SeasonGreeting() {
  return (
    <>
      {SEASONS.map(({ id, greeting, icon: Icon }) => (
        <p
          key={id}
          data-season-only={id}
          className="inline-flex h-8 items-center gap-2 rounded-full border border-season/35 bg-card px-3 text-[13px] text-season"
        >
          <Icon size={14} aria-hidden />
          {greeting}
        </p>
      ))}
    </>
  );
}

export { SeasonGreeting };
