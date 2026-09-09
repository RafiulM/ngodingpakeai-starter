import { withApiPermission } from "@/lib/api";
import { listAnyNotes } from "@/services/notes.service";
import { listNotesSchema } from "@/validators/notes";

export const runtime = "nodejs";

// Every account's notes. withApiPermission answers 401 without a session and
// 403 without the notes:read-any permission, before the service runs.
export function GET(request: Request) {
  return withApiPermission(request, { notes: ["read-any"] }, async () => {
    const query = listNotesSchema.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    return Response.json(await listAnyNotes(query));
  });
}
