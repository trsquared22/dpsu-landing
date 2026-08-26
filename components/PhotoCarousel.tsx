"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface Slide {
  src: string;
  alt: string;
  caption?: string;
  fit: "cover" | "contain";
}

const AUTOPLAY_MS = 6000;

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function PhotoCarousel({ slides }: { slides: Slide[] }) {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paginate = useCallback(
    (step: number) => {
      setIndex(([prev]) => [(prev + step + slides.length) % slides.length, step]);
    },
    [slides.length]
  );

  useEffect(() => {
    if (isPaused || slides.length < 2) return;
    timeoutRef.current = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, isPaused, paginate, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <section className="relative bg-neutral-50 py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative h-72 overflow-hidden rounded-3xl border border-black/10 bg-neutral-100 shadow-sm sm:h-96 md:h-[28rem]"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 32 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 72rem, 100vw"
                className={slide.fit === "cover" ? "object-cover" : "object-contain"}
                priority={index === 0}
              />
              {slide.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 pb-9 sm:p-6 sm:pb-10">
                  <p className="text-sm font-medium text-white sm:text-base">{slide.caption}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => paginate(-1)}
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => paginate(1)}
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex([i, i > index ? 1 : -1])}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-gold" : "w-1.5 bg-white/60 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
