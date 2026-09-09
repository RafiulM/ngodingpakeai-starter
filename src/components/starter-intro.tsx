"use client";

import { motion } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Code2,
  Database,
  Fingerprint,
  Sparkles,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CopyPrompt } from "@/components/copy-prompt";

const prompt =
  "Read AGENTS.md and the relevant project skills. Help me build [describe your app] using this starter. Use Context7 for current library docs. Start with the smallest working feature, keep the existing authentication, and explain what you changed in plain language.";
const stack = [
  {
    icon: Code2,
    title: "Next.js",
    detail: "Your app, front to back",
    href: "https://nextjs.org/docs",
  },
  {
    icon: Database,
    title: "Drizzle + PostgreSQL",
    detail: "A database that grows with you",
    href: "https://orm.drizzle.team/docs/get-started-postgresql",
  },
  {
    icon: Fingerprint,
    title: "Better Auth",
    detail: "Accounts and sign in",
    href: "https://better-auth.com/docs",
  },
  {
    icon: Workflow,
    title: "Tailwind + shadcn/ui",
    detail: "Building blocks for your UI",
    href: "https://ui.shadcn.com/docs",
  },
  {
    icon: Sparkles,
    title: "Motion",
    detail: "A little movement",
    href: "https://motion.dev/docs/react",
  },
];

export function StarterIntro({ signedIn }: { signedIn: boolean }) {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-20"
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1 }}
        className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20"
      >
        <section>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" /> Your starting
            point
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl">
            A small base.
            <br />
            <span className="text-muted-foreground">A world of ideas.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
            The setup is here. Make it yours with a prompt, one useful feature
            at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href={signedIn ? "/app" : "/sign-up"}>
                {signedIn ? "Open your app" : "Create an account"}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            {!signedIn && (
              <Button asChild variant="ghost" size="lg">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            )}
          </div>
          <div className="mt-12 border-t pt-6">
            <p className="text-sm font-medium">Small by design</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Start with accounts, a database, and a blank app. Add a dashboard,
              a chatbot, or something entirely your own when you need it.
            </p>
          </div>
        </section>
        <section
          aria-labelledby="first-prompt"
          className="self-start overflow-hidden rounded-2xl border bg-card shadow-[0_4px_24px_#00000004]"
        >
          <div className="flex items-center justify-between border-b px-6 py-4">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />{" "}
              Build with your AI editor
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              01 / START
            </span>
          </div>
          <div className="p-6 sm:p-7">
            <h2
              id="first-prompt"
              className="text-xl font-semibold tracking-tight"
            >
              What would you like to build?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Open this project in your AI editor. Copy this prompt and replace
              the brackets with your idea.
            </p>
            <div className="my-5 rounded-xl border bg-muted/70 p-5">
              <p className="font-mono text-sm leading-7">{prompt}</p>
            </div>
            <CopyPrompt text={prompt} />
          </div>
          <div className="flex items-start gap-2 border-t bg-muted/40 px-6 py-4 text-sm leading-6 text-muted-foreground">
            <Check
              className="mt-1 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              Project skills guide the work. Enable Context7 in your editor to
              give your AI current documentation.
            </p>
          </div>
        </section>
      </motion.div>
      <section
        aria-labelledby="foundation"
        className="mt-16 border-t pt-8 sm:mt-24"
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 id="foundation" className="text-sm font-semibold">
            Your foundation, connected.
          </h2>
          <span className="text-sm text-muted-foreground">
            Fewer setup steps. More building.
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stack.map(({ icon: Icon, title, detail, href }) => (
            <motion.a
              key={title}
              href={href}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3 }}
              className="group rounded-xl border bg-card p-5 transition-colors hover:border-foreground/30 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <div className="flex items-center justify-between">
                <Icon
                  className="size-5 text-muted-foreground"
                  aria-hidden="true"
                />
                <ArrowUpRight
                  className="size-4 text-muted-foreground/70"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 text-sm font-semibold">
                {title}
                <span className="sr-only">
                  {" "}
                  documentation (opens in a new tab)
                </span>
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                {detail}
              </p>
            </motion.a>
          ))}
        </div>
      </section>
    </main>
  );
}
