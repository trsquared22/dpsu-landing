"use client";

import { motion } from "framer-motion";

interface ShopStewardEntry {
  entity: string;
  stewardNames: string;
}

export default function ShopStewards({ stewards }: { stewards: ShopStewardEntry[] }) {
  return (
    <section className="relative overflow-hidden bg-forest py-20 text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="relative mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-2 text-center text-4xl font-bold"
        >
          Our Shop Stewards
        </motion.h2>
        <p className="mb-10 text-center text-white/70">
          Your DPSU shop stewards across government establishments and Other Organizations.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-sm uppercase tracking-wide text-white/60">
                <th className="px-6 py-4 font-medium">Company / Establishment</th>
                <th className="px-6 py-4 font-medium">Shop Steward(s)</th>
              </tr>
            </thead>
            <tbody>
              {stewards.map((entry, i) => (
                <motion.tr
                  key={entry.entity}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-4 text-white/90">{entry.entity}</td>
                  <td className="px-6 py-4 text-gold">
                    {entry.stewardNames.split(/\r?\n|,/).map((name) => name.trim()).filter(Boolean).join(", ")}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
