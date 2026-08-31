"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { emptyMembershipForm, type MembershipFormData } from "@/lib/membership";
import { Toast, type ToastData } from "@/components/Toast";
import { SignatureField } from "@/components/SignatureField";
import type { EstablishmentData } from "@/sanity/lib/queries";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function MembershipForm({ establishments }: { establishments: EstablishmentData[] }) {
  const [formData, setFormData] = useState<MembershipFormData>(emptyMembershipForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [toast, setToast] = useState<ToastData | null>(null);

  const selectedEstablishment = establishments.find((e) => e.entity === formData.establishment);
  const subOptions = selectedEstablishment?.subOptions ?? [];

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "establishment" ? { ministryDepartment: "" } : {}),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!formData.membershipSignature.trim()) {
      setToast({ type: "error", message: "Please sign the application before submitting." });
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (!res.ok || !result.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  if (status === "success") {
    return (
      <main className="relative overflow-hidden bg-neutral-50 py-32 text-center text-neutral-900">
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="relative mx-auto max-w-lg px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">Application received!</h1>
            <p className="mb-8 text-neutral-600">
              Thank you for applying to the Dominica Public Service Union. We&rsquo;ve emailed a confirmation to{" "}
              <span className="font-medium text-neutral-900">{formData.email}</span>, and our team will follow up
              soon.
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-forest px-8 py-3 text-white shadow-[0_0_30px_rgba(27,67,50,0.35)] transition hover:bg-forest-dark"
            >
              Back to home
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden bg-neutral-50 py-32 text-neutral-900">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="relative mx-auto max-w-3xl px-6">
        <Link href="/" className="mb-6 inline-block text-sm text-forest hover:underline">
          &larr; Back to home
        </Link>

        <h1 className="mb-3 text-4xl font-bold md:text-5xl">Application for Membership</h1>
        <p className="mb-12 text-lg text-neutral-600">
          Join the Dominica Public Service Union and set up your monthly subscription payment in one step.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Membership Application */}
          <section className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Membership Application</h2>

            <fieldset className="mb-6 flex gap-6">
              <legend className={labelClass}>Gender</legend>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  required
                />
                Female
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  required
                />
                Male
              </label>
            </fieldset>

            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              <Field label="First name">
                <input
                  className={inputClass}
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                  required
                />
              </Field>
              <Field label="Middle name">
                <input className={inputClass} name="middleName" value={formData.middleName} onChange={handleChange} autoComplete="additional-name" />
              </Field>
              <Field label="Last name">
                <input
                  className={inputClass}
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                  required
                />
              </Field>
            </div>

            <div className="mb-4 space-y-3">
              <Field label="Home/mailing address">
                <input
                  className={inputClass}
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address"
                  autoComplete="address-line1"
                  required
                />
              </Field>
              <input
                className={inputClass}
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Village / town (optional)"
                autoComplete="address-line2"
              />
              <input
                className={inputClass}
                name="addressLine3"
                value={formData.addressLine3}
                onChange={handleChange}
                placeholder="Parish (optional)"
              />
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              <Field label="Telephone (home)">
                <input className={inputClass} name="phoneHome" value={formData.phoneHome} onChange={handleChange} type="tel" autoComplete="tel" />
              </Field>
              <Field label="Telephone (work)">
                <input className={inputClass} name="phoneWork" value={formData.phoneWork} onChange={handleChange} type="tel" autoComplete="tel" />
              </Field>
              <Field label="Telephone (cell)">
                <input
                  className={inputClass}
                  name="phoneCell"
                  value={formData.phoneCell}
                  onChange={handleChange}
                  type="tel"
                  autoComplete="tel"
                  required
                />
              </Field>
            </div>

            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <Field label="Date of birth">
                <input
                  type="date"
                  className={inputClass}
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  autoComplete="bday"
                  required
                />
              </Field>
              <Field label="Occupation">
                <input
                  className={inputClass}
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <Field label="Personal email address" className="mb-6">
              <input
                type="email"
                className={inputClass}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>

            <p className="mb-4 text-sm text-neutral-600">
              I hereby apply for membership in the Dominica Public Service Union (DPSU). I agree to abide by all the
              rules and regulations of the Union and to support the Union to the best of my ability.
            </p>

            <label className="mb-4 flex items-start gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1"
                required
              />
              I agree to the statement above.
            </label>

            <SignatureField
              value={formData.membershipSignature}
              onChange={(value) => setFormData((prev) => ({ ...prev, membershipSignature: value }))}
            />
          </section>

          {/* Subscription Payment Method */}
          <section className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold">Subscription Payment Method</h2>

            <fieldset className="mb-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
              <legend className={labelClass}>How will you pay your subscription?</legend>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="salary_deduction"
                  checked={formData.paymentMethod === "salary_deduction"}
                  onChange={handleChange}
                  required
                />
                Salary deduction
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="over_the_counter"
                  checked={formData.paymentMethod === "over_the_counter"}
                  onChange={handleChange}
                  required
                />
                Over the counter subscription
              </label>
            </fieldset>

            {formData.paymentMethod === "salary_deduction" && (
              <>
                <div className="mb-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Company / Establishment">
                    <select
                      className={inputClass}
                      name="establishment"
                      value={formData.establishment}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select an establishment
                      </option>
                      {establishments.map(({ entity }) => (
                        <option key={entity} value={entity}>
                          {entity}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {subOptions.length > 0 ? (
                    <Field label="Ministry / Department">
                      <select
                        className={inputClass}
                        name="ministryDepartment"
                        value={formData.ministryDepartment}
                        onChange={handleChange}
                        required
                      >
                        <option value="" disabled>
                          Select a ministry / department
                        </option>
                        {subOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </Field>
                  ) : (
                    <Field label="Place of work">
                      <input
                        className={inputClass}
                        name="placeOfWork"
                        value={formData.placeOfWork}
                        onChange={handleChange}
                        required
                      />
                    </Field>
                  )}
                </div>

                {subOptions.length > 0 && (
                  <Field label="Place of work" className="mb-4">
                    <input
                      className={inputClass}
                      name="placeOfWork"
                      value={formData.placeOfWork}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                )}

                <Field label="To: The Votes Clerk / Accounting Officer" className="mb-4">
                  <input
                    className={inputClass}
                    name="accountingOfficer"
                    value={formData.accountingOfficer}
                    onChange={handleChange}
                    placeholder="Department or officer name (optional)"
                  />
                </Field>

                <p className="mb-4 text-sm text-neutral-600">
                  I hereby authorize you to deduct the sum of twenty-five dollars ($25.00) or any amount that may be
                  decided
                  from time to time by the general membership, from my salary beginning the month below and every
                  month thereafter to be paid to the Dominica Public Service Union as subscription fees.
                </p>

                <Field label="Deduction starts (month/year)" className="mb-4">
                  <input
                    type="month"
                    className={inputClass}
                    name="deductionStartMonth"
                    value={formData.deductionStartMonth}
                    onChange={handleChange}
                    required
                  />
                </Field>

                <p className="mb-4 text-sm text-neutral-600">
                  I agree to notify the Executive Committee in writing of my intention to stop deductions.
                </p>

                <label className="mb-6 flex items-start gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    name="agreeDeduction"
                    checked={formData.agreeDeduction}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  I agree to the statement above.
                </label>

                <Field label="Witness full name (optional)">
                  <input
                    className={inputClass}
                    name="witnessName"
                    value={formData.witnessName}
                    onChange={handleChange}
                  />
                </Field>
              </>
            )}

            {formData.paymentMethod === "over_the_counter" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="1st payment date">
                  <input
                    type="date"
                    className={inputClass}
                    name="firstPaymentDate"
                    value={formData.firstPaymentDate}
                    onChange={handleChange}
                    required
                  />
                </Field>
                <Field label="Witness full name (optional)">
                  <input
                    className={inputClass}
                    name="witnessName"
                    value={formData.witnessName}
                    onChange={handleChange}
                  />
                </Field>
              </div>
            )}
          </section>

          <motion.button
            type="submit"
            disabled={status === "submitting"}
            whileHover={{ scale: status === "submitting" ? 1 : 1.05 }}
            whileTap={{ scale: status === "submitting" ? 1 : 0.95 }}
            className="w-full rounded-lg bg-forest px-8 py-3 text-white shadow-[0_0_30px_rgba(27,67,50,0.35)] transition hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </motion.button>
        </form>
      </div>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}
