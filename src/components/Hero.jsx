import { useEffect, useRef } from "react";
import BackgroundScene from "./BackgroundScene";

export default function Hero({ onJoin, count }) {
  const countRef = useRef(null);

  useEffect(() => {
    if (count === null || !countRef.current) return;
    const el = countRef.current;
    el.classList.remove("count-animate");
    void el.offsetWidth;
    el.classList.add("count-animate");
  }, [count]);

  return (
    <section
      className="relative min-h-[calc(100vh-80px)] flex flex-col items-center
                 justify-start text-center overflow-hidden
                 px-5 pt-16 pb-48 sm:pt-24 sm:pb-56 md:pt-36 md:pb-64"
      style={{
        background:
          "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(26,80,214,0.05) 0%, transparent 70%), #fff",
      }}
    >
      {/* Background scene — hidden on small mobile, shown md+ */}
      <div className="hidden md:block">
        <BackgroundScene />
      </div>

      {/* Gradient fade */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 40%, transparent 100%)",
        }}
      />

      {/* Hero content */}
      <div className="relative z-20 w-full max-w-3xl flex flex-col items-center gap-5 sm:gap-6">
        {/* Counter pill */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-gray-200
                        rounded-full px-4 py-2 sm:px-5 sm:py-2.5 shadow-sm
                        text-xs sm:text-sm text-gray-500 max-w-full"
        >
          <span
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400 shrink-0 counter-dot"
            style={{ boxShadow: "0 0 0 3px rgba(34,197,94,.22)" }}
          />
          <strong ref={countRef} className="text-brand-blue font-extrabold">
            {count !== null ? count.toLocaleString() : "—"}
          </strong>
          <span className="truncate">
            Spots Are Filling Fast — Secure Yours Now.
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[clamp(34px,6vw,76px)] font-black leading-[1.1]
                       tracking-tight text-gray-900 w-full"
        >
          Trash Problems?
          <br />
          <span className="text-brand-blue">TrashGo</span> Has the Solution..
        </h1>

        {/* Subtext */}
        <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-md leading-relaxed">
          TrashGo makes waste pickup simple, reliable, and accessible in Sierra
          Leone. Join our early access waitlist — be first when we launch in
          your area.
        </p>

        {/* CTA */}
        <button
          onClick={onJoin}
          className="group inline-flex items-center gap-2 bg-brand-orange text-white
                     font-bold text-sm sm:text-base
                     px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl w-full sm:w-auto justify-center
                     shadow-[0_4px_24px_rgba(247,140,30,0.4)]
                     hover:bg-[#e07a10] hover:shadow-[0_8px_32px_rgba(247,140,30,0.5)]
                     transition-all duration-200 active:scale-[.97]"
        >
          Early Access
          <span className="group-hover:translate-x-1 transition-transform duration-200">
            →
          </span>
        </button>

        {/* Trust line */}
        <p className="text-xs text-brand-blue">
          Free to join · No payment required · Early access
        </p>
      </div>
    </section>
  );
}
