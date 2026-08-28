"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, X } from "lucide-react";

const DEFAULT_VISIBLE_COUNT = 2;

interface Steward {
  name: string;
  phone?: string;
  email?: string;
  department?: string;
}

interface ShopStewardEntry {
  entity: string;
  stewards: Steward[];
  subOptions?: string[];
}

function visibleStewards(entry: ShopStewardEntry, selectedDept: string) {
  const hasDepartments = Boolean(entry.subOptions && entry.subOptions.length > 0);

  if (!hasDepartments) {
    return { list: entry.stewards, moreCount: 0, filtered: false };
  }

  if (selectedDept) {
    return {
      list: entry.stewards.filter((s) => s.department === selectedDept),
      moreCount: 0,
      filtered: true,
    };
  }

  return {
    list: entry.stewards.slice(0, DEFAULT_VISIBLE_COUNT),
    moreCount: Math.max(0, entry.stewards.length - DEFAULT_VISIBLE_COUNT),
    filtered: false,
  };
}

export default function ShopStewards({ stewards }: { stewards: ShopStewardEntry[] }) {
  const [active, setActive] = useState<{ entity: string; steward: Steward } | null>(null);
  const [selectedDept, setSelectedDept] = useState<Record<string, string>>({});

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
          Your DPSU shop stewards across government establishments and Other Organizations. Click a name for
          contact info.
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
              {stewards.map((entry, i) => {
                const selected = selectedDept[entry.entity] ?? "";
                const { list, moreCount, filtered } = visibleStewards(entry, selected);

                return (
                  <motion.tr
                    key={entry.entity}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 * i }}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-6 py-4 text-white/90">
                      <div>{entry.entity}</div>
                      {entry.subOptions && entry.subOptions.length > 0 && (
                        <select
                          value={selected}
                          onChange={(e) =>
                            setSelectedDept((prev) => ({ ...prev, [entry.entity]: e.target.value }))
                          }
                          aria-label={`Filter shop stewards for ${entry.entity} by ministry / department`}
                          className="mt-2 w-full max-w-56 rounded-md border border-white/15 bg-white/10 px-2 py-1 text-xs text-white/80 focus:border-gold focus:outline-none"
                        >
                          <option value="" className="text-neutral-900">
                            All ministries / departments
                          </option>
                          {entry.subOptions.map((option) => (
                            <option key={option} value={option} className="text-neutral-900">
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {list.length === 0 ? (
                        <span className="text-white/40">
                          {filtered ? "No steward assigned yet." : "—"}
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-x-1 gap-y-1">
                          {list.map((steward, j) => (
                            <span key={steward.name}>
                              <button
                                type="button"
                                onClick={() => setActive({ entity: entry.entity, steward })}
                                className="text-gold underline decoration-gold/40 underline-offset-2 transition hover:text-gold/80"
                              >
                                {steward.name}
                              </button>
                              {j < list.length - 1 && <span className="text-white/40">, </span>}
                            </span>
                          ))}
                        </div>
                      )}
                      {moreCount > 0 && (
                        <p className="mt-1 text-xs text-white/40">
                          +{moreCount} more &mdash; select a ministry / department above
                        </p>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl border border-black/10 bg-white p-6 text-neutral-900 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-full p-1 text-neutral-400 transition-colors hover:bg-black/5 hover:text-neutral-600"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
                {active.entity}
              </p>
              <h3 className="mb-4 text-lg font-semibold">{active.steward.name}</h3>
              <div className="space-y-2 text-sm">
                {active.steward.phone ? (
                  <a
                    href={`tel:${active.steward.phone}`}
                    className="flex items-center gap-2 text-neutral-700 transition hover:text-forest"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-forest" />
                    {active.steward.phone}
                  </a>
                ) : null}
                {active.steward.email ? (
                  <a
                    href={`mailto:${active.steward.email}`}
                    className="flex items-center gap-2 text-neutral-700 transition hover:text-forest"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-forest" />
                    {active.steward.email}
                  </a>
                ) : null}
                {!active.steward.phone && !active.steward.email && (
                  <p className="text-neutral-500">Contact info coming soon.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
