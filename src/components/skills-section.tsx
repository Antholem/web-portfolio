const skillGroups = [
  {
    category: "Frontend",
    description:
      "Interface engineering focused on accessible, responsive, and high-performing web experiences.",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js"],
  },
  {
    category: "Styling & Design",
    description:
      "Systems that translate design language into reusable components with consistent visual execution.",
    skills: ["Tailwind CSS", "Chakra UI", "Radix UI", "Figma"],
  },
  {
    category: "Tooling & Workflow",
    description:
      "Developer tooling and automation that keep shipping velocity high without sacrificing quality.",
    skills: ["Git", "GitHub Actions", "Vite", "ESLint", "Prettier"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-muted/20 py-16 lg:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">
            Core Skills
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Modern tooling for building resilient web products
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            A snapshot of the technologies and practices I rely on to design, develop, and ship web interfaces that scale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="flex h-full flex-col rounded-2xl border border-border bg-background/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">{group.category}</h3>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>

              <ul className="mt-6 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium tracking-wide text-secondary-foreground"
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
