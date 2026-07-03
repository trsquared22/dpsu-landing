"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    title: "Investing in Ourselves",
    desc: "Building the skills, knowledge, and confidence public servants need to grow in their careers and their union.",
  },
  {
    title: "Organizing for Workers' Rights",
    desc: "Standing together at the bargaining table so every member's voice carries real weight.",
  },
];

const values = ["Integrity", "Unity", "Fairness"];

export default function About() {
  return (
    <section id="about" className="relative bg-white py-24 text-neutral-900">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center text-4xl font-bold"
        >
          About Us
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-black/10 bg-neutral-50 p-8 shadow-sm md:col-span-2 md:row-span-2"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-navy">
              2026 &ndash; 2028 Theme
            </p>
            <p className="text-lg leading-relaxed text-neutral-600">
              The Dominica Public Service Union (DPSU) 2026-2028 under the theme
              &ldquo;Investing in Ourselves, Organizing for Workers Rights and
              Benefits&rdquo; is dedicated to protecting the rights of public
              servants, promoting fairness, and fostering unity. We stand as a
              voice for workers, ensuring their welfare and professional
              development.
            </p>
          </motion.div>

          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 * (i + 1) }}
              className="rounded-3xl border border-black/10 bg-neutral-50 p-6 shadow-sm transition hover:border-gold/50"
            >
              <h3 className="mb-2 text-xl font-semibold">{pillar.title}</h3>
              <p className="text-sm text-neutral-500">{pillar.desc}</p>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col items-start justify-center gap-3 rounded-3xl border border-black/10 bg-neutral-50 p-6 shadow-sm md:col-span-1"
          >
            <h3 className="text-xl font-semibold">Our Commitment</h3>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => (
                <span
                  key={value}
                  className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-sm text-navy"
                >
                  {value}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
