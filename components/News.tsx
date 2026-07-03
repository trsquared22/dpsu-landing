"use client";

import { motion } from "framer-motion";
import InfiniteMovingCards from "./InfiniteMovingCards";

const newsItems = [
  { title: "Union Meeting - July 2026", desc: "Join us for updates on negotiations and upcoming initiatives." },
  { title: "Training Workshop", desc: "Professional development sessions scheduled for August." },
  { title: "Community Outreach", desc: "DPSU launches new programs to support local communities." },
];

export default function News() {
  return (
    <section id="news" className="relative bg-white py-24 text-neutral-900">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center text-4xl font-bold"
        >
          Latest News
        </motion.h2>
      </div>
      <InfiniteMovingCards items={newsItems} speedSeconds={35} />
    </section>
  );
}
