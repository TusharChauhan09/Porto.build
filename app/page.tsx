import { getServerSession } from "@/lib/auth-session";
import {
  Navbar,
  Hero,
  Footer,
} from "@/components/landing";

export default async function Home() {
  const session = await getServerSession();
  const isLoggedIn = !!session;

  return (
    <div className="bg-[#fdfbf9] dark:bg-black text-foreground min-h-screen scroll-smooth relative">
      {/* Ambient gradient blobs — light mode only */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none dark:hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-[#c8a2c8] blur-[140px] opacity-40 mix-blend-multiply" />
        <div className="absolute top-[5%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#e8a87c] blur-[140px] opacity-30 mix-blend-multiply" />
        <div className="absolute top-[30%] left-[5%] w-[40%] h-[40%] rounded-full bg-[#7ba882] blur-[120px] opacity-25 mix-blend-multiply" />
        <div className="absolute top-[55%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#d4a574] blur-[140px] opacity-30 mix-blend-multiply" />
        <div className="absolute top-[80%] left-[15%] w-[40%] h-[40%] rounded-full bg-[#a8b4e8] blur-[130px] opacity-25 mix-blend-multiply" />
      </div>

      <Navbar isLoggedIn={isLoggedIn} />
      <main className="relative z-10">
        <Hero isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}
