export const chatIntroMessage =
  "Hello! I'm Sam's AI portfolio guide. Ask me about his background, skills, services, featured projects, or how to get in touch. I can also point you to his resume.";

const resumeUrl = "/assets/resume.pdf";

const topicResponses: { keywords: string[]; response: string }[] = [
  {
    keywords: [
      "about",
      "background",
      "experience",
      "bio",
      "career",
      "history",
      "story",
    ],
    response:
      "Sam Antholem Manalo is a principal software engineer based in Clark, Pampanga, Philippines. He partners with founders and product leaders to translate ambitious ideas into resilient, human-centered software that balances accessibility, systems thinking, and AI-accelerated workflows. Over nine years, he has led distributed teams, modernized platforms, and shipped data-informed experiences across finance, commerce, and SaaS domains.",
  },
  {
    keywords: ["highlight", "focus", "strength", "approach", "specialty"],
    response:
      "Core focus areas include principal engineering leadership, evolving platforms and design systems, crafting experience strategies, and blending automation with human insight to deliver confident, measurable outcomes.",
  },
  {
    keywords: ["skill", "stack", "technology", "tool", "capability", "competence"],
    response:
      "Sam's toolkit spans front-end engineering (React, Next.js, Tailwind, Chakra UI, Material UI, Shadcn), backend and APIs (Node.js, Express, PHP, Python, Java), data platforms (MongoDB, MySQL, PostgreSQL, Firebase, Supabase), and DevOps delivery (Docker, Vercel, GitHub, GitLab). He also collaborates through design tooling like Figma and Adobe XD, and explores AI platforms including Hugging Face and Google Gemini.",
  },
  {
    keywords: ["service", "offer", "engagement", "help", "partner"],
    response:
      "He offers design systems and experience design, full-stack web engineering, and AI-assisted product enablement. Engagements cover component libraries and accessibility audits, Next.js and API development, performance tuning, workflow automation, and ethical AI guidance tailored to different stages of product growth.",
  },
  {
    keywords: ["project", "work", "portfolio", "case"],
    response:
      "Featured work includes the Atlas Insights Dashboard (a real-time marketing analytics platform built with Next.js, TypeScript, and Tailwind CSS), the Aurora Commerce Platform (a headless commerce experience powered by Next.js, Shopify, and GraphQL), and the Horizon Studio Portfolio (a cinematic creative showcase built with Next.js, Contentful, and Framer Motion).",
  },
  {
    keywords: ["resume", "cv", "curriculum", "download"],
    response:
      `You can view or download Sam's resume anytime at ${resumeUrl}. The hero section also includes quick access if you'd like to grab a copy for later.`,
  },
  {
    keywords: ["contact", "email", "phone", "reach", "connect", "call"],
    response:
      "You can connect with Sam at antholemlemmanalo@gmail.com or by phone at +63 977 333 6944. There is also a contact form on the site if you'd like to share details about a collaboration.",
  },
  {
    keywords: ["location", "based", "where", "city"],
    response: "Sam is currently based in Clark and Mabalacat, Pampanga in the Philippines.",
  },
  {
    keywords: ["social", "github", "linkedin", "profile"],
    response:
      "You can explore more through his GitHub (https://github.com/antholem) and LinkedIn (https://www.linkedin.com/in/antholem). Those links are also available in the hero section for quick access.",
  },
];

const greetingKeywords = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening"];

export function generateChatResponse(message: string) {
  const normalized = message.toLowerCase();

  if (greetingKeywords.some((keyword) => normalized.includes(keyword))) {
    return "Hi there! I'm ready to share anything about Sam's experience, expertise, services, projects, or contact details.";
  }

  const responses = topicResponses
    .filter((topic) => topic.keywords.some((keyword) => normalized.includes(keyword)))
    .map((topic) => topic.response);

  if (responses.length > 0) {
    return responses.join("\n\n");
  }

  return "I can help with questions about Sam's background, skills, services, projects, ways to get in touch, and even provide his resume. What would you like to know?";
}

export const suggestedPrompts = [
  "What are Sam's core skills?",
  "Can I see Sam's resume?",
  "Tell me about Sam's featured projects.",
  "How can I contact Sam?",
];
