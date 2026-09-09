"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="mx-auto max-w-lg px-6 py-24">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="my-4 leading-7 text-muted-foreground">
        Try loading this page again. If it keeps happening, check the terminal
        running your app for details.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
