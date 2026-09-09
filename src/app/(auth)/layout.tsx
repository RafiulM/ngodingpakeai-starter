import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { getSession } from "@/lib/session";
import { siteConfig } from "@/config/site";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await getSession()) redirect(siteConfig.homePath);
  return (
    <div className="min-h-svh">
      <header className="mx-auto max-w-6xl px-6 py-6 sm:px-10">
        <Brand />
      </header>
      <main
        id="main-content"
        className="mx-auto flex min-h-[75svh] max-w-6xl items-center justify-center px-6 py-12"
      >
        {children}
      </main>
    </div>
  );
}
