"use client";

import { motion } from "framer-motion";

// TODO: replace these placeholder figures with DPSU's real, current membership numbers before launch.
const memberships = [
  { name: "Government Establishments", members: 3200 },
  { name: "Public Works Corporation", members: 480 },
  { name: "Dominica Air & Sea Ports Authority", members: 410 },
  { name: "Dominica Water and Sewerage Company", members: 260 },
  { name: "Flow Dominica", members: 190 },
  { name: "Solid Waste", members: 140 },
];

export default function Stats() {
  const total = memberships.reduce((sum, entry) => sum + entry.members, 0);

  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="relative mx-auto max-w-3xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-2 text-center text-4xl font-bold"
        >
          Who We Represent
        </motion.h2>
        <p className="mb-10 text-center text-white/70">
          Active DPSU membership across government establishments and partner organizations.
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
                <th className="px-6 py-4 font-medium">Company / Entity</th>
                <th className="px-6 py-4 text-right font-medium">Active Members</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((entry, i) => (
                <motion.tr
                  key={entry.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 * i }}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="px-6 py-4 text-white/90">{entry.name}</td>
                  <td className="px-6 py-4 text-right text-lg font-semibold text-gold">
                    {entry.members.toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 bg-white/5">
                <td className="px-6 py-4 font-semibold text-white">Total</td>
                <td className="px-6 py-4 text-right text-lg font-bold text-gold">
                  {total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
