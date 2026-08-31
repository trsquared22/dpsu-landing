import { ApplicationForm, emptyApplicationDefaults } from "@/components/admin/ApplicationForm";
import { createApplication } from "@/app/admin/actions";
import { getEstablishments } from "@/sanity/lib/queries";

export default async function NewApplicationPage() {
  const establishments = await getEstablishments();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Add Application</h1>
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <ApplicationForm
          defaults={emptyApplicationDefaults}
          establishments={establishments}
          action={createApplication}
          submitLabel="Create Application"
        />
      </div>
    </div>
  );
}
