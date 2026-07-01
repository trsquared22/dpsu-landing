"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
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

      <motion.nav
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-x-0 top-6 z-[100] mx-auto flex w-fit items-center justify-center gap-6 rounded-full border border-black/10 bg-white/70 px-8 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)] backdrop-blur-md"
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-neutral-600 transition-colors hover:text-black"
          >
            {link.label}
          </a>
        ))}
      </motion.nav>
    </>
  );
}
