import { AppSidebar } from "@/components/app-sidebar";
import { getServerSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden antialiased">
      <AppSidebar />
      <main className="flex-1 h-full overflow-auto">{children}</main>
    </div>
  );
}
