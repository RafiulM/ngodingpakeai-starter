import { ApiError, readJson, withApiSession } from "@/lib/api";
import { deleteNote, getNote, updateNote } from "@/services/notes.service";
import { noteIdSchema, updateNoteSchema } from "@/validators/notes";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

export function GET(request: Request, context: Context) {
  return withApiSession(request, async (session) => {
    const id = noteIdSchema.parse((await context.params).id);
    const note = await getNote(session.user.id, id);
    if (!note) throw new ApiError(404, "NOT_FOUND", "Note not found.");
    return Response.json({ data: note });
  });
}

export function PATCH(request: Request, context: Context) {
  return withApiSession(request, async (session) => {
    const id = noteIdSchema.parse((await context.params).id);
    const input = updateNoteSchema.parse(await readJson(request));
    const note = await updateNote(session.user.id, id, input);
    if (!note) throw new ApiError(404, "NOT_FOUND", "Note not found.");
    return Response.json({ data: note });
  });
}

export function DELETE(request: Request, context: Context) {
  return withApiSession(request, async (session) => {
    const id = noteIdSchema.parse((await context.params).id);
    if (!(await deleteNote(session.user.id, id)))
      throw new ApiError(404, "NOT_FOUND", "Note not found.");
    return new Response(null, { status: 204 });
  });
}
