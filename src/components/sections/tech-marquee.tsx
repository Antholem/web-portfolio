import { techMarquee } from "@/lib/data";

function TechMarquee() {
  // The list is doubled so the -50% translate loops seamlessly.
  const items = [...techMarquee, ...techMarquee];

  return (
    <section
      aria-label="Technologies I work with"
      className="overflow-hidden border-y border-border py-5"
    >
      <div className="overflow-hidden fade-x">
        <ul className="flex w-max animate-marquee items-center gap-10 motion-reduce:animate-none">
          {items.map((tech, i) => (
            <li
              key={`${tech}-${i}`}
              aria-hidden={i >= techMarquee.length || undefined}
              className="inline-flex items-center gap-10 font-mono text-[13px] tracking-[0.06em] whitespace-nowrap text-muted-foreground uppercase"
            >
              {tech}
              <span aria-hidden className="inline-block size-1.25 bg-input" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { TechMarquee };
