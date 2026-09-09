import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { requirePermission } from "@/lib/session";
import { listAnyNotes } from "@/services/notes.service";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  // Without notes:read-any this renders not-found, so the route stays invisible
  // to accounts that cannot use it. The layout's session check is not enough.
  const { user } = await requirePermission({ notes: ["read-any"] });
  const { data: notes, meta } = await listAnyNotes({ limit: 50, offset: 0 });

  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
        <ShieldCheck className="size-4" aria-hidden="true" /> Admin access
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Every account’s notes
      </h1>
      <p className="mt-3 text-lg leading-7 text-muted-foreground">
        {user.name}, your role grants <code>notes: read-any</code>. Regular
        accounts only ever see their own rows.
      </p>

      {notes.length === 0 ? (
        <p className="mt-9 rounded-2xl border border-dashed bg-card px-6 py-10 text-center text-muted-foreground">
          No notes yet. Create one through the Notes API and it will show up
          here, whoever owns it.
        </p>
      ) : (
        <ul className="mt-9 space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="rounded-xl border bg-card px-5 py-4">
              <p className="font-medium">{note.title}</p>
              {note.content && (
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {note.content}
                </p>
              )}
              <p className="mt-2 break-all text-xs text-muted-foreground">
                {note.ownerName} · {note.ownerEmail}
              </p>
            </li>
          ))}
        </ul>
      )}

      {meta.hasMore && (
        <p className="mt-4 text-sm text-muted-foreground">
          Showing the first {meta.limit}. Page with{" "}
          <code>?limit=&amp;offset=</code> on <code>/api/admin/notes</code>.
        </p>
      )}

      <div className="mt-8">
        <Button variant="ghost" asChild size="sm">
          <Link href="/app">
            <ArrowLeft aria-hidden="true" />
            Back to your app
          </Link>
        </Button>
      </div>
    </div>
  );
}
