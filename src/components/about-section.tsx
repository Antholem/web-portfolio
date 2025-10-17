import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const focusAreas = [
  {
    title: "Human-centered systems",
    description:
      "I help teams translate complex requirements into intuitive products by pairing research-backed UX with maintainable design systems.",
  },
  {
    title: "Reliable engineering",
    description:
      "From architecture decisions to deployment pipelines, I guide the delivery of resilient, observable software that scales with confidence.",
  },
  {
    title: "AI-augmented workflows",
    description:
      "I experiment with emerging tooling to automate rote tasks, accelerate insight, and keep teams focused on the creative work that matters.",
  },
] as const;

const quickFacts = [
  {
    label: "Years shipping products",
    value: "7+",
    description: "Leading end-to-end initiatives across startups, agencies, and enterprise teams.",
  },
  {
    label: "Core strengths",
    value: "Design × Code",
    description: "Bridging product strategy, UX, and full-stack engineering to deliver cohesive experiences.",
  },
  {
    label: "Collaboration style",
    value: "Partner & Coach",
    description: "Embedding with teams to mentor, document, and uplift sustainable delivery practices.",
  },
] as const;

export default function AboutSection() {
  return (
    <section id="about" className="bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/80">About</p>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Building resilient products through thoughtful collaboration
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                I’m Sam Antholem Manalo, a software engineer focused on crafting scalable digital platforms that feel effortless
                to use. My work spans discovery, architecture, and delivery—helping teams connect business goals with meaningful,
                measurable experiences.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                Whether it’s designing modular component systems, orchestrating cloud-native infrastructure, or coaching teams on
                AI-assisted workflows, I thrive at the intersection of craft and systems thinking. I partner closely with product
                leaders, designers, and engineers to turn complex problems into clear, actionable roadmaps.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {focusAreas.map((area) => (
                <Card key={area.title} className="h-full border-primary/10 bg-muted/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">{area.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {area.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="h-full border-primary/10 bg-muted/20">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl text-foreground">Quick facts</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Context that shapes how I approach every engagement.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="border-t border-white/5 pt-6 first:mt-0 first:border-t-0 first:pt-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">{fact.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{fact.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fact.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
