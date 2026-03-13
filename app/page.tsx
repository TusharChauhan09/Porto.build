import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-zinc-100">PortfolioForge</h1>
        <p className="max-w-md text-zinc-400">
          Generate and deploy your personal portfolio website with a live cloud editor.
        </p>
        <Link
          href="/editor"
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Open Editor
        </Link>
      </div>
    </div>
  );
}
