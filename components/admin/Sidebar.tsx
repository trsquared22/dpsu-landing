"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserCog, Users } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/applications", label: "Applications", icon: Users, exact: false },
  { href: "/admin/team", label: "Team", icon: UserCog, exact: false },
];

export function Sidebar({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-black/10 bg-forest text-white">
      <div className="px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/60">DPSU</p>
        <p className="text-lg font-semibold">Admin</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      {adminEmail && (
        <div className="border-t border-white/10 px-5 py-4 text-xs text-white/60">
          Signed in as
          <div className="truncate text-sm text-white/90">{adminEmail}</div>
        </div>
      )}
    </aside>
  );
}
