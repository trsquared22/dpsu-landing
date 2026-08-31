import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { deleteAdmin } from "@/app/admin/actions";
import { CreateAdminForm } from "@/components/admin/CreateAdminForm";

export default async function TeamPage() {
  const [session, admins] = await Promise.all([
    verifySession(),
    prisma.adminUser.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, email: true, createdAt: true } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Team</h1>

      <div className="mb-8 overflow-hidden rounded-2xl border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Added</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => {
              const isSelf = admin.id === session.adminId;
              const isLastAdmin = admins.length <= 1;
              return (
                <tr key={admin.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 text-neutral-800">
                    {admin.email}
                    {isSelf && <span className="ml-2 text-xs text-neutral-400">(you)</span>}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {admin.createdAt.toLocaleDateString("en-US", { timeZone: "America/Dominica" })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isSelf && !isLastAdmin && (
                      <form
                        action={async () => {
                          "use server";
                          await deleteAdmin(admin.id);
                        }}
                      >
                        <button type="submit" className="text-xs text-red-600 hover:underline">
                          Remove
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-1 text-sm font-medium text-neutral-700">Add an admin</h2>
        <p className="mb-4 text-xs text-neutral-500">
          They&apos;ll be able to sign in at /admin/login with this email and password right away.
        </p>
        <CreateAdminForm />
      </div>
    </div>
  );
}
