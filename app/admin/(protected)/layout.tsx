import { getCurrentAdmin } from "@/lib/dal";
import { logout } from "@/app/admin/actions";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar adminEmail={admin?.email} />
      <div className="flex-1">
        <header className="flex justify-end border-b border-black/10 bg-white px-6 py-3">
          <form action={logout}>
            <button type="submit" className="text-sm text-neutral-500 hover:text-forest hover:underline">
              Sign out
            </button>
          </form>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
