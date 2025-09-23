import ContactForm from '@/components/contact-form';

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-12 px-4 py-16">
      <section className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Let&apos;s build something great together
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Have a project in mind or just want to say hi? Drop a message below and it will be sent straight to my inbox.
        </p>
      </section>
      <ContactForm />
    </main>
  );
}
