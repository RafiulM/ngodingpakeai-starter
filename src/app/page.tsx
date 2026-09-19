import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";

// The root has no page of its own: the app starts at the signed-in screen.
// Add a public landing page here only when your product needs one.
export default async function Home() {
  redirect((await getSession()) ? siteConfig.homePath : "/sign-in");
}
