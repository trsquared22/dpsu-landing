import { prisma } from "@/lib/db";

const STATUS_ORDER = ["pending", "active", "inactive"] as const;

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  active: "Active",
  inactive: "Inactive",
};

const STATUS_BAR_COLOR: Record<string, string> = {
  pending: "bg-amber-400",
  active: "bg-green-500",
  inactive: "bg-neutral-400",
};

const STAT_CARD_STYLE: Record<string, string> = {
  total: "border-black/10 bg-white",
  pending: "border-amber-200 bg-amber-50",
  active: "border-green-200 bg-green-50",
  inactive: "border-neutral-200 bg-neutral-100",
};

const AGE_BRACKETS: { label: string; min: number; max: number }[] = [
  { label: "Under 25", min: 0, max: 24 },
  { label: "25–34", min: 25, max: 34 },
  { label: "35–44", min: 35, max: 44 },
  { label: "45–54", min: 45, max: 54 },
  { label: "55–64", min: 55, max: 64 },
  { label: "65+", min: 65, max: Infinity },
];

function StatCard({ label, value, style }: { label: string; value: number; style: string }) {
  return (
    <div className={`rounded-2xl border p-5 ${style}`}>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function BreakdownCard({
  title,
  entries,
  barColor = "bg-forest",
  emptyLabel = "No data yet.",
}: {
  title: string;
  entries: { label: string; count: number }[];
  barColor?: string;
  emptyLabel?: string;
}) {
  const maxCount = Math.max(1, ...entries.map((e) => e.count));
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <h2 className="mb-4 text-sm font-medium text-neutral-700">{title}</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-neutral-500">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {entries.map(({ label, count }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-40 shrink-0 truncate text-sm text-neutral-600" title={label}>
                {label}
              </span>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div className={`h-full rounded-full ${barColor}`} style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-medium text-neutral-700">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function calculateAge(dateOfBirth: string): number | null {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export default async function AdminDashboardPage() {
  const [total, statusGrouped, genderGrouped, paymentGrouped, establishmentGrouped, dobRows] = await Promise.all([
    prisma.membershipApplication.count(),
    prisma.membershipApplication.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.membershipApplication.groupBy({ by: ["gender"], _count: { gender: true } }),
    prisma.membershipApplication.groupBy({ by: ["paymentMethod"], _count: { paymentMethod: true } }),
    prisma.membershipApplication.groupBy({
      by: ["establishment"],
      _count: { establishment: true },
      orderBy: { _count: { establishment: "desc" } },
    }),
    prisma.membershipApplication.findMany({ select: { dateOfBirth: true } }),
  ]);

  const statusCounts: Record<string, number> = { pending: 0, active: 0, inactive: 0 };
  for (const g of statusGrouped) statusCounts[g.status] = g._count.status;
  const maxStatusCount = Math.max(1, ...STATUS_ORDER.map((s) => statusCounts[s]));

  const genderLabel: Record<string, string> = { male: "Male", female: "Female" };
  const genderEntries = genderGrouped
    .map((g) => ({ label: genderLabel[g.gender ?? ""] ?? g.gender ?? "Not specified", count: g._count.gender }))
    .sort((a, b) => b.count - a.count);

  const paymentLabel: Record<string, string> = {
    salary_deduction: "Salary deduction",
    over_the_counter: "Over the counter",
  };
  const paymentEntries = paymentGrouped
    .map((g) => ({ label: paymentLabel[g.paymentMethod] ?? g.paymentMethod, count: g._count.paymentMethod }))
    .sort((a, b) => b.count - a.count);

  const establishmentEntries = establishmentGrouped
    .filter((g) => g.establishment)
    .map((g) => ({ label: g.establishment as string, count: g._count.establishment }))
    .slice(0, 8);

  const ageBucketCounts = AGE_BRACKETS.map((bracket) => ({ label: bracket.label, count: 0 }));
  for (const row of dobRows) {
    const age = calculateAge(row.dateOfBirth);
    if (age === null) continue;
    const bracketIndex = AGE_BRACKETS.findIndex((b) => age >= b.min && age <= b.max);
    if (bracketIndex >= 0) ageBucketCounts[bracketIndex].count += 1;
  }
  const ageEntries = ageBucketCounts.filter((b) => b.count > 0);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Applications" value={total} style={STAT_CARD_STYLE.total} />
        <StatCard label="Pending" value={statusCounts.pending} style={STAT_CARD_STYLE.pending} />
        <StatCard label="Active" value={statusCounts.active} style={STAT_CARD_STYLE.active} />
        <StatCard label="Inactive" value={statusCounts.inactive} style={STAT_CARD_STYLE.inactive} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="mb-4 text-sm font-medium text-neutral-700">Applications by status</h2>
          {total === 0 ? (
            <p className="text-sm text-neutral-500">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {STATUS_ORDER.map((status) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-sm text-neutral-600">{STATUS_LABEL[status]}</span>
                  <div className="h-4 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLOR[status]}`}
                      style={{ width: `${(statusCounts[status] / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-medium text-neutral-700">
                    {statusCounts[status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <BreakdownCard title="By payment method" entries={paymentEntries} barColor="bg-blue-500" />
        <BreakdownCard title="By gender" entries={genderEntries} barColor="bg-purple-500" />
        <BreakdownCard title="By age group" entries={ageEntries} barColor="bg-teal-500" />
        <BreakdownCard
          title="Top establishments"
          entries={establishmentEntries}
          barColor="bg-orange-500"
          emptyLabel="No establishment data yet."
        />
      </div>
    </div>
  );
}
