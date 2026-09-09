import type { Metadata } from "next";
import { ArrowUpRight, Check, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { hasPermission, requireSession } from "@/lib/session";
import { CopyPrompt } from "@/components/copy-prompt";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your app" };

export default async function AppPage() {
  const { user } = await requireSession();
  // Hiding the link is presentation only. /admin and its API guard themselves.
  const isAdmin = await hasPermission(user.id, { notes: ["read-any"] });
  const prompt =
    "Read AGENTS.md and use the build-feature skill. Replace the blank app page with [describe your first feature]. Keep authentication working, store any user data with Drizzle and PostgreSQL, and use Context7 to check library APIs.";

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        <Check className="size-4" aria-hidden="true" /> You’re signed in
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Welcome, {user.name}.
      </h1>
      <p className="mt-3 text-lg leading-7 text-muted-foreground">
        This is your app. Let’s give it something to do.
      </p>
      <section
        className="mt-9 rounded-2xl border border-dashed bg-card px-6 py-10 sm:px-10"
        aria-labelledby="blank-canvas"
      >
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl border bg-muted">
          <Plus className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 id="blank-canvas" className="text-xl font-semibold tracking-tight">
          Your first feature starts here
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          A reading list? A space for project ideas? Tell your AI editor what
          you need, and build from this blank canvas.
        </p>
        <blockquote className="my-6 border-l-2 border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
          {prompt}
        </blockquote>
        <CopyPrompt text={prompt} />
      </section>
      {isAdmin && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Your role can read every account’s notes.
          </p>
          <Button variant="outline" asChild size="sm">
            <Link href="/admin">
              <ShieldCheck aria-hidden="true" />
              Open admin
            </Link>
          </Button>
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <span className="break-all text-muted-foreground">
          Signed in as {user.email}
        </span>
        <Button variant="ghost" asChild size="sm">
          <Link href="/">
            Back to the starter
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
