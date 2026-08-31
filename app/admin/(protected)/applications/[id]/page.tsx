import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ApplicationForm, type ApplicationDefaults } from "@/components/admin/ApplicationForm";
import { deleteApplication, updateApplication } from "@/app/admin/actions";
import { getEstablishments } from "@/sanity/lib/queries";

export default async function EditApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [app, establishments] = await Promise.all([
    prisma.membershipApplication.findUnique({ where: { id } }),
    getEstablishments(),
  ]);

  if (!app) {
    notFound();
  }

  const defaults: ApplicationDefaults = {
    gender: app.gender ?? "",
    firstName: app.firstName,
    middleName: app.middleName ?? "",
    lastName: app.lastName,
    addressLine1: app.addressLine1,
    addressLine2: app.addressLine2 ?? "",
    addressLine3: app.addressLine3 ?? "",
    phoneHome: app.phoneHome ?? "",
    phoneWork: app.phoneWork ?? "",
    phoneCell: app.phoneCell,
    dateOfBirth: app.dateOfBirth,
    email: app.email,
    occupation: app.occupation,
    membershipSignature: app.membershipSignature,
    paymentMethod: app.paymentMethod,
    establishment: app.establishment ?? "",
    ministryDepartment: app.ministryDepartment ?? "",
    placeOfWork: app.placeOfWork ?? "",
    accountingOfficer: app.accountingOfficer ?? "",
    deductionStartMonth: app.deductionStartMonth ?? "",
    firstPaymentDate: app.firstPaymentDate ?? "",
    witnessName: app.witnessName ?? "",
    agreeTerms: app.agreeTerms,
    agreeDeduction: app.agreeDeduction,
    status: app.status,
  };

  const boundUpdate = updateApplication.bind(null, app.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">
          Edit Application &mdash; {app.firstName} {app.lastName}
        </h1>
        <form
          action={async () => {
            "use server";
            await deleteApplication(app.id);
          }}
        >
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Delete
          </button>
        </form>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        {app.membershipSignature.startsWith("data:image") && (
          <div className="mb-6">
            <p className="mb-1.5 text-xs font-medium text-neutral-600">Signature (drawn)</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URL, next/image doesn't support these */}
            <img
              src={app.membershipSignature}
              alt="Applicant signature"
              className="h-24 rounded-lg border border-black/10 bg-white p-2"
            />
          </div>
        )}
        <ApplicationForm
          defaults={defaults}
          establishments={establishments}
          action={boundUpdate}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
