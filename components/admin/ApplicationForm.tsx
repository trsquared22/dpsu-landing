"use client";

import { useActionState, useState } from "react";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1 block text-xs font-medium text-neutral-600";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export interface EstablishmentOption {
  entity: string;
  subOptions?: string[];
}

export interface ApplicationDefaults {
  gender: string;
  firstName: string;
  middleName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phoneHome: string;
  phoneWork: string;
  phoneCell: string;
  dateOfBirth: string;
  email: string;
  occupation: string;
  membershipSignature: string;
  paymentMethod: string;
  establishment: string;
  ministryDepartment: string;
  placeOfWork: string;
  accountingOfficer: string;
  deductionStartMonth: string;
  firstPaymentDate: string;
  witnessName: string;
  agreeTerms: boolean;
  agreeDeduction: boolean;
  status: string;
}

export const emptyApplicationDefaults: ApplicationDefaults = {
  gender: "",
  firstName: "",
  middleName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  phoneHome: "",
  phoneWork: "",
  phoneCell: "",
  dateOfBirth: "",
  email: "",
  occupation: "",
  membershipSignature: "",
  paymentMethod: "",
  establishment: "",
  ministryDepartment: "",
  placeOfWork: "",
  accountingOfficer: "",
  deductionStartMonth: "",
  firstPaymentDate: "",
  witnessName: "",
  agreeTerms: false,
  agreeDeduction: false,
  status: "pending",
};

export function ApplicationForm({
  defaults,
  establishments,
  action,
  submitLabel,
}: {
  defaults: ApplicationDefaults;
  establishments: EstablishmentOption[];
  action: (prevState: string | null, formData: FormData) => Promise<string | null>;
  submitLabel: string;
}) {
  const [message, formAction, isPending] = useActionState(action, null);
  const [establishment, setEstablishment] = useState(defaults.establishment);

  const selected = establishments.find((e) => e.entity === establishment);
  const subOptions = selected?.subOptions ?? [];
  // False both when the selected establishment genuinely has no ministries
  // list, and when the saved establishment no longer matches anything in
  // Sanity (selected is undefined) - either way, fall back to free text
  // below rather than risk silently discarding the saved value.
  const canPickMinistry = subOptions.length > 0;

  return (
    <form action={formAction} className="space-y-6">
      <Field label="Status">
        <select className={inputClass + " max-w-xs"} name="status" defaultValue={defaults.status}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <p className="mt-1 text-xs text-neutral-500">
          Switching to Active sends the applicant a confirmation email automatically.
        </p>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Gender">
          <select className={inputClass} name="gender" defaultValue={defaults.gender}>
            <option value="">—</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </Field>
        <Field label="First name">
          <input className={inputClass} name="firstName" defaultValue={defaults.firstName} required />
        </Field>
        <Field label="Middle name">
          <input className={inputClass} name="middleName" defaultValue={defaults.middleName} />
        </Field>
        <Field label="Last name">
          <input className={inputClass} name="lastName" defaultValue={defaults.lastName} required />
        </Field>
        <Field label="Date of birth">
          <input
            type="date"
            className={inputClass}
            name="dateOfBirth"
            defaultValue={defaults.dateOfBirth}
          />
        </Field>
        <Field label="Occupation">
          <input className={inputClass} name="occupation" defaultValue={defaults.occupation} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Address line 1">
          <input className={inputClass} name="addressLine1" defaultValue={defaults.addressLine1} />
        </Field>
        <Field label="Address line 2">
          <input className={inputClass} name="addressLine2" defaultValue={defaults.addressLine2} />
        </Field>
        <Field label="Address line 3">
          <input className={inputClass} name="addressLine3" defaultValue={defaults.addressLine3} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Phone (home)">
          <input className={inputClass} name="phoneHome" defaultValue={defaults.phoneHome} />
        </Field>
        <Field label="Phone (work)">
          <input className={inputClass} name="phoneWork" defaultValue={defaults.phoneWork} />
        </Field>
        <Field label="Phone (cell)">
          <input className={inputClass} name="phoneCell" defaultValue={defaults.phoneCell} />
        </Field>
      </div>

      <Field label="Email">
        <input type="email" className={inputClass} name="email" defaultValue={defaults.email} required />
      </Field>

      <Field label="Signature (typed name or leave a note)">
        <input
          className={inputClass}
          name="membershipSignature"
          defaultValue={defaults.membershipSignature}
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Payment method">
          <select className={inputClass} name="paymentMethod" defaultValue={defaults.paymentMethod}>
            <option value="">—</option>
            <option value="salary_deduction">Salary deduction</option>
            <option value="over_the_counter">Over the counter</option>
          </select>
        </Field>
        <Field label="Establishment">
          <select
            className={inputClass}
            name="establishment"
            value={establishment}
            onChange={(e) => setEstablishment(e.target.value)}
          >
            <option value="">—</option>
            {/* Keep a saved value selectable even if it's no longer in the
                Sanity-managed list (renamed/removed establishment). */}
            {establishment && !establishments.some((opt) => opt.entity === establishment) && (
              <option value={establishment}>{establishment} (not in current list)</option>
            )}
            {establishments.map((opt) => (
              <option key={opt.entity} value={opt.entity}>
                {opt.entity}
              </option>
            ))}
          </select>
        </Field>
        {canPickMinistry ? (
          <Field label="Ministry / department">
            <select
              key={establishment}
              className={inputClass}
              name="ministryDepartment"
              defaultValue={defaults.ministryDepartment}
            >
              <option value="">—</option>
              {subOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="Ministry / department">
            <input className={inputClass} name="ministryDepartment" defaultValue={defaults.ministryDepartment} />
            <p className="mt-1 text-xs text-neutral-500">
              {establishment
                ? "This establishment has no ministries/departments list in Studio."
                : "Select an establishment with a ministries/departments list to pick from one."}
            </p>
          </Field>
        )}
        <Field label="Place of work">
          <input className={inputClass} name="placeOfWork" defaultValue={defaults.placeOfWork} />
        </Field>
        <Field label="Accounting officer">
          <input
            className={inputClass}
            name="accountingOfficer"
            defaultValue={defaults.accountingOfficer}
          />
        </Field>
        <Field label="Deduction start month">
          <input
            type="month"
            className={inputClass}
            name="deductionStartMonth"
            defaultValue={defaults.deductionStartMonth}
          />
        </Field>
        <Field label="First payment date">
          <input
            type="date"
            className={inputClass}
            name="firstPaymentDate"
            defaultValue={defaults.firstPaymentDate}
          />
        </Field>
        <Field label="Witness name">
          <input className={inputClass} name="witnessName" defaultValue={defaults.witnessName} />
        </Field>
      </div>

      <div className="flex gap-6 text-sm text-neutral-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="agreeTerms" defaultChecked={defaults.agreeTerms} />
          Agreed to terms
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="agreeDeduction" defaultChecked={defaults.agreeDeduction} />
          Agreed to deduction
        </label>
      </div>

      {message && <p className="text-sm text-neutral-600">{message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-forest px-6 py-2.5 text-white transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
