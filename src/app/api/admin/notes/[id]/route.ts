import { ApiError, withApiPermission } from "@/lib/api";
import { deleteAnyNote } from "@/services/notes.service";
import { noteIdSchema } from "@/validators/notes";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

// Deletes another account's note. The Origin check in withApiSession still
// applies, so a permitted role cannot be used from a cross-site request.
export function DELETE(request: Request, context: Context) {
  return withApiPermission(request, { notes: ["delete-any"] }, async () => {
    const id = noteIdSchema.parse((await context.params).id);
    if (!(await deleteAnyNote(id)))
      throw new ApiError(404, "NOT_FOUND", "Note not found.");
    return new Response(null, { status: 204 });
  });
}
