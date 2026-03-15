import { AppSidebar } from "@/components/app-sidebar";

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden antialiased">
      <AppSidebar />
      <main className="flex-1 h-full overflow-auto">{children}</main>
    </div>
  );
}
