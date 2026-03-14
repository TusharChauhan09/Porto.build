export function GradientBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#c8a2c8] blur-[120px] opacity-70 mix-blend-multiply" />
      <div className="absolute top-[-5%] right-[-15%] w-[65%] h-[65%] rounded-full bg-[#e8a87c] blur-[130px] opacity-80 mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[10%] w-[55%] h-[55%] rounded-full bg-[#7ba882] blur-[110px] opacity-60 mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#d4a574] blur-[140px] opacity-75 mix-blend-multiply" />
    </div>
  );
}
