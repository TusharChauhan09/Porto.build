export function GradientBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Light mode blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#c8a2c8] dark:bg-indigo-600 blur-[120px] opacity-70 dark:opacity-15 mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute top-[-5%] right-[-15%] w-[65%] h-[65%] rounded-full bg-[#e8a87c] dark:bg-violet-600 blur-[130px] opacity-80 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute bottom-[-10%] left-[10%] w-[55%] h-[55%] rounded-full bg-[#7ba882] dark:bg-brand blur-[110px] opacity-60 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#d4a574] dark:bg-purple-700 blur-[140px] opacity-75 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal" />
    </div>
  );
}
