"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const socials = [
  {
    label: "Email",
    href: "dominicapsu@gmail.com",
    path: "M2.25 6.75c0-.828.672-1.5 1.5-1.5h16.5c.828 0 1.5.672 1.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V6.75zm1.5 0l8.25 6 8.25-6",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M13.5 21v-7.5h2.5l.5-3h-3V8.25c0-.87.24-1.46 1.49-1.46H16.5V4.14C16.24 4.1 15.36 4 14.33 4c-2.15 0-3.63 1.31-3.63 3.72V10.5H8.2v3h2.5V21h2.8z",
  },
  {
    label: "Phone",
    href: "tel:+17670000000",
    path: "M2.25 3.75c0-.414.336-.75.75-.75h3a.75.75 0 01.729.571l1.05 4.2a.75.75 0 01-.198.727l-1.7 1.7a12.06 12.06 0 005.9 5.9l1.7-1.7a.75.75 0 01.727-.198l4.2 1.05a.75.75 0 01.571.729v3a.75.75 0 01-.75.75h-1.5C9.858 19.5 4.5 14.142 4.5 7.5V6z",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-neutral-50 py-32 text-center text-neutral-900">
      <div className="absolute inset-0 bg-grid-pattern" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute bottom-0 left-1/2 h-[30rem] w-[50rem] -translate-x-1/2 rounded-full bg-blue-400/30 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-4xl font-bold md:text-5xl"
        >
          Ready to make your voice heard?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-10 text-lg text-neutral-600"
        >
          Reach out to DPSU today &mdash; Register to be apart of this movement TODAY!.
        </motion.p>

        <Link href="/membership" className="inline-block">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition hover:bg-blue-700"
          >
            Register Now
          </motion.span>
        </Link>

        <div className="mt-16 flex items-center justify-center gap-6">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-500 shadow-sm transition hover:border-blue-400/50 hover:text-blue-600"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d={social.path} />
              </svg>
            </a>
          ))}
        </div>

        <p className="mt-12 text-sm text-neutral-500">
          &copy; 2026 Dominica Public Service Union. All rights reserved.
        </p>
      </div>
    </section>
  );
}
