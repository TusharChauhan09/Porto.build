import Link from "next/link";
import { GradientBackground } from "@/components/auth/GradientBackground";
import { getServerSession } from "@/lib/auth-session";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fdfbf9] selection:bg-zinc-200">
      <GradientBackground />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="font-serif text-5xl sm:text-7xl text-zinc-900 tracking-tight leading-tight">
          Porto<span className="italic">.build</span>
        </h1>

        <p className="text-lg text-zinc-500 mt-4 max-w-md font-sans">
          Build your portfolio in minutes.
        </p>

        <Link
          href={session ? "/arena" : "/auth/signin"}
          className="mt-10 inline-flex items-center justify-center bg-zinc-900 text-white px-8 py-4 rounded-full text-base font-medium hover:bg-zinc-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
        >
          {session ? "Go to Arena" : "Get Started"}
        </Link>
      </div>
    </main>
  );
}
