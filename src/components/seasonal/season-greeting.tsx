import { SEASONS } from "@/constants/seasons";

/** One pill per season; CSS shows only the one matching <html data-season>. */
function SeasonGreeting() {
  return (
    <>
      {SEASONS.map(({ id, greeting, icon: Icon }) => (
        <p
          key={id}
          data-season-only={id}
          className="season-pill inline-flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-medium text-season"
        >
          <Icon size={14} className="text-season-2" aria-hidden />
          <span>
            {greeting}
            {id === "new-year" ? (
              <span className="season-year before:content-['_']" />
            ) : null}
          </span>
        </p>
      ))}
    </>
  );
}

export { SeasonGreeting };
