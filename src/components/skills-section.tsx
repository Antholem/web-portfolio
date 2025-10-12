type SkillCategory = {
  title: string;
  description: string;
  skills: string[];
};

const coreSkills: SkillCategory[] = [
  {
    title: "Frontend Frameworks",
    description:
      "Modern component-driven frameworks used to build responsive, accessible interfaces.",
    skills: ["React", "Next.js", "Remix", "Astro"],
  },
  {
    title: "Languages",
    description:
      "Strong foundations across languages that power both client and server rendering.",
    skills: ["TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Styling & Animation",
    description:
      "Design systems and motion libraries that keep experiences polished and on-brand.",
    skills: ["Tailwind CSS", "Framer Motion", "Styled Components", "Radix UI"],
  },
  {
    title: "Tooling & Platforms",
    description:
      "Infrastructure and workflow tooling that keep teams shipping with confidence.",
    skills: ["Vercel", "Node.js", "Storybook", "Playwright"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/40 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Expertise
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills that ship production-grade products
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A cross-disciplinary toolkit spanning frontend engineering, animation, and deployment workflows to deliver quality experiences at scale.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreSkills.map((category) => (
            <div
              key={category.title}
              className="flex h-full flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
