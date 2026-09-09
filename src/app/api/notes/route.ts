import { readJson, withApiSession } from "@/lib/api";
import { createNote, listNotes } from "@/services/notes.service";
import { createNoteSchema, listNotesSchema } from "@/validators/notes";

export const runtime = "nodejs";

export function GET(request: Request) {
  return withApiSession(request, async (session) => {
    const query = listNotesSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    return Response.json(await listNotes(session.user.id, query));
  });
}

export function POST(request: Request) {
  return withApiSession(request, async (session) => {
    const input = createNoteSchema.parse(await readJson(request));
    const note = await createNote(session.user.id, input);
    return Response.json(
      { data: note },
      { status: 201, headers: { Location: `/api/notes/${note.id}` } },
    );
  });
}
