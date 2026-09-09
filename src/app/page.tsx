import { Brand } from "@/components/brand";
import { StarterIntro } from "@/components/starter-intro";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  return (
    <>
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
        <Brand />
        <span className="rounded-md border px-2.5 py-1 font-mono text-xs text-muted-foreground">
          POSTGRES / 01
        </span>
      </header>
      <StarterIntro signedIn={Boolean(session)} />
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6 pb-8 text-sm text-muted-foreground sm:px-10">
        <span>Made for your next idea.</span>
        <span>ngodingpakeai / starters</span>
      </footer>
    </>
  );
}
