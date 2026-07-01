"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-white py-32 text-neutral-900">
      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-grid-pattern" />

      {/* Spotlight glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[45rem] w-[70rem] -translate-x-1/2 rounded-full bg-blue-400/40 blur-[120px]"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center md:text-left"
        >
          <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-tight md:mx-0 md:text-6xl">
            Investing in Ourselves, Organizing for Workers&rsquo; Rights and Benefits
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600 md:mx-0 md:text-xl">
            Serving and protecting public servants with integrity, unity, and vision.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition hover:bg-blue-700"
            >
              Get Involved
            </motion.a>
            <motion.a
              href="#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg border border-black/10 bg-black/5 px-6 py-3 text-neutral-900 backdrop-blur-md transition hover:bg-black/10"
            >
              Our Services
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-blue-400/25 blur-2xl" />
          <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <Image
              src="/images/PSU_LOGO_TEMP.PNG"
              alt="DPSU Logo"
              fill
              sizes="(min-width: 768px) 24rem, 90vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16 text-white">
              <p className="text-lg font-semibold">DOMINICA PUBLIC SERVICE UNION </p>
              <p className="text-sm text-neutral-300">EST.1961</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
