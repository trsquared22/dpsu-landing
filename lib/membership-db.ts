import type { MembershipFormData } from "./membership";

function orNull(value: string): string | null {
  return value.trim() ? value.trim() : null;
}

// Maps the public form's MembershipFormData (empty string = "no value") to
// Prisma's MembershipApplication create input (null = "no value").
export function toMembershipApplicationData(data: MembershipFormData) {
  return {
    gender: orNull(data.gender),
    firstName: data.firstName,
    middleName: orNull(data.middleName),
    lastName: data.lastName,
    addressLine1: data.addressLine1,
    addressLine2: orNull(data.addressLine2),
    addressLine3: orNull(data.addressLine3),
    phoneHome: orNull(data.phoneHome),
    phoneWork: orNull(data.phoneWork),
    phoneCell: data.phoneCell,
    dateOfBirth: data.dateOfBirth,
    email: data.email,
    occupation: data.occupation,
    membershipSignature: data.membershipSignature,
    paymentMethod: data.paymentMethod,
    establishment: orNull(data.establishment),
    ministryDepartment: orNull(data.ministryDepartment),
    placeOfWork: orNull(data.placeOfWork),
    accountingOfficer: orNull(data.accountingOfficer),
    deductionStartMonth: orNull(data.deductionStartMonth),
    firstPaymentDate: orNull(data.firstPaymentDate),
    witnessName: orNull(data.witnessName),
    agreeTerms: data.agreeTerms,
    agreeDeduction: data.agreeDeduction,
  };
}
