"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.a
        href="#"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed left-6 top-5 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-md"
      >
        <Image
          src="/images/logo.png"
          alt="DPSU logo"
          width={48}
          height={48}
          className="h-full w-full rounded-full object-contain p-1"
          priority
        />
      </motion.a>

      {/* Desktop nav pill */}
      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-x-0 top-6 z-[100] mx-auto hidden w-fit items-center justify-center gap-6 rounded-full border border-black/10 bg-white/70 px-8 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-md md:flex"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-neutral-600 transition-colors hover:text-navy"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>

      {/* Mobile menu toggle */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed right-6 top-5 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/70 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5 text-navy">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          )}
        </svg>
      </motion.button>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed right-6 top-20 z-[100] flex w-48 flex-col gap-1 rounded-2xl border border-black/10 bg-white/95 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-md md:hidden"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-navy/5 hover:text-navy"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
