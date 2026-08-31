import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { deleteApplication } from "@/app/admin/actions";
import { StatusSelect } from "@/components/admin/StatusSelect";

const SORTABLE_COLUMNS = {
  name: { lastName: "asc" as const },
  email: { email: "asc" as const },
  phone: { phoneCell: "asc" as const },
  establishment: { establishment: "asc" as const },
  payment: { paymentMethod: "asc" as const },
  status: { status: "asc" as const },
  submitted: { createdAt: "asc" as const },
};

type SortColumn = keyof typeof SORTABLE_COLUMNS;

const STATUS_TABS = ["all", "pending", "active", "inactive"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 border-l-4 border-l-amber-400",
  active: "bg-green-50 border-l-4 border-l-green-500",
  inactive: "bg-neutral-100 border-l-4 border-l-neutral-400",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  active: "bg-green-100 text-green-800",
  inactive: "bg-neutral-200 text-neutral-600",
};

function isSortColumn(value: string | undefined): value is SortColumn {
  return Boolean(value && value in SORTABLE_COLUMNS);
}

function isStatusTab(value: string | undefined): value is StatusTab {
  return Boolean(value && (STATUS_TABS as readonly string[]).includes(value));
}

export default async function ApplicationsListPage({
  searchParams,
}: {
  searchParams: Promise<{ sortBy?: string; order?: string; status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const sortBy: SortColumn = isSortColumn(params.sortBy) ? params.sortBy : "submitted";
  const order: "asc" | "desc" = params.order === "asc" ? "asc" : "desc";
  const activeTab: StatusTab = isStatusTab(params.status) ? params.status : "all";
  const query = (params.q ?? "").trim();

  const sortField = Object.keys(SORTABLE_COLUMNS[sortBy])[0];
  const orderBy = { [sortField]: order };

  const where: Prisma.MembershipApplicationWhereInput = {
    ...(activeTab === "all" ? {} : { status: activeTab }),
    ...(query
      ? {
          OR: [
            { firstName: { contains: query, mode: "insensitive" } },
            { lastName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { gender: { contains: query, mode: "insensitive" } },
            { occupation: { contains: query, mode: "insensitive" } },
            { establishment: { contains: query, mode: "insensitive" } },
            { placeOfWork: { contains: query, mode: "insensitive" } },
            { phoneCell: { contains: query, mode: "insensitive" } },
            { phoneHome: { contains: query, mode: "insensitive" } },
            { phoneWork: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [applications, tabCounts] = await Promise.all([
    prisma.membershipApplication.findMany({
      where,
      orderBy,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneCell: true,
        paymentMethod: true,
        establishment: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.membershipApplication.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const totalCount = tabCounts.reduce((sum, g) => sum + g._count.status, 0);
  const countFor = (tab: StatusTab) =>
    tab === "all" ? totalCount : (tabCounts.find((g) => g.status === tab)?._count.status ?? 0);

  function withParams(overrides: Record<string, string | undefined>) {
    const next = new URLSearchParams();
    const merged = { sortBy, order, status: activeTab === "all" ? undefined : activeTab, q: query || undefined, ...overrides };
    for (const [key, value] of Object.entries(merged)) {
      if (value) next.set(key, value);
    }
    const qs = next.toString();
    return `/admin/applications${qs ? `?${qs}` : ""}`;
  }

  function headerLink(column: SortColumn, label: string) {
    const nextOrder = sortBy === column && order === "asc" ? "desc" : "asc";
    const arrow = sortBy === column ? (order === "asc" ? " ▲" : " ▼") : "";
    return (
      <Link href={withParams({ sortBy: column, order: nextOrder })} className="hover:text-neutral-800">
        {label}
        {arrow}
      </Link>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Membership Applications</h1>
        <div className="flex gap-2">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download endpoint, not a page */}
          <a
            href="/admin/applications/export"
            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
          >
            Export to Excel
          </a>
          <Link
            href="/admin/applications/new"
            className="rounded-lg bg-forest px-4 py-2 text-sm text-white transition hover:bg-forest-dark"
          >
            + Add Application
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-lg border border-black/10 bg-white p-1 text-sm">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab}
              href={withParams({ status: tab === "all" ? undefined : tab })}
              className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${
                activeTab === tab ? "bg-forest text-white" : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {tab} ({countFor(tab)})
            </Link>
          ))}
        </div>
        <form method="get" className="flex gap-2">
          {sortBy !== "submitted" && <input type="hidden" name="sortBy" value={sortBy} />}
          {order !== "desc" && <input type="hidden" name="order" value={order} />}
          {activeTab !== "all" && <input type="hidden" name="status" value={activeTab} />}
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search name, email, gender, occupation, phone..."
            className="w-64 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
        </form>
      </div>

      {applications.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {totalCount === 0 ? "No applications yet." : "No applications match this filter."}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{headerLink("name", "Name")}</th>
                <th className="px-4 py-3 font-medium">{headerLink("email", "Email")}</th>
                <th className="px-4 py-3 font-medium">{headerLink("phone", "Phone")}</th>
                <th className="px-4 py-3 font-medium">{headerLink("establishment", "Establishment")}</th>
                <th className="px-4 py-3 font-medium">{headerLink("payment", "Payment")}</th>
                <th className="px-4 py-3 font-medium">{headerLink("status", "Status")}</th>
                <th className="px-4 py-3 font-medium">{headerLink("submitted", "Submitted")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  className={`border-b border-black/5 last:border-0 hover:brightness-95 ${
                    STATUS_STYLES[app.status] ?? ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/applications/${app.id}`} className="text-forest hover:underline">
                      {app.firstName} {app.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{app.email}</td>
                  <td className="px-4 py-3 text-neutral-600">{app.phoneCell}</td>
                  <td className="px-4 py-3 text-neutral-600">{app.establishment ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-600">
                    {app.paymentMethod === "salary_deduction" ? "Salary deduction" : "Over the counter"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      applicationId={app.id}
                      status={app.status}
                      badgeClassName={STATUS_BADGE[app.status] ?? ""}
                    />
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {app.createdAt.toLocaleDateString("en-US", { timeZone: "America/Dominica" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-xs text-neutral-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteApplication(app.id);
                        }}
                      >
                        <button type="submit" className="text-xs text-red-600 hover:underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
