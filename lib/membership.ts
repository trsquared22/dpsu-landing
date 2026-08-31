export interface MembershipFormData {
  gender: "female" | "male" | "";
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
  paymentMethod: "salary_deduction" | "over_the_counter" | "";
  establishment: string;
  ministryDepartment: string;
  placeOfWork: string;
  accountingOfficer: string;
  deductionStartMonth: string;
  firstPaymentDate: string;
  witnessName: string;
  agreeTerms: boolean;
  agreeDeduction: boolean;
}

export const emptyMembershipForm: MembershipFormData = {
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
};

const requiredStringFields: (keyof MembershipFormData)[] = [
  "firstName",
  "lastName",
  "addressLine1",
  "phoneCell",
  "dateOfBirth",
  "email",
  "occupation",
  "membershipSignature",
];

export function validateMembershipForm(data: MembershipFormData): string | null {
  for (const field of requiredStringFields) {
    const value = data[field];
    if (typeof value !== "string" || !value.trim()) {
      return `Missing required field: ${field}`;
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    return "Please provide a valid email address.";
  }
  if (!data.agreeTerms) {
    return "You must agree to the membership rules and regulations.";
  }
  if (data.paymentMethod !== "salary_deduction" && data.paymentMethod !== "over_the_counter") {
    return "Please select a subscription payment method.";
  }
  if (data.paymentMethod === "salary_deduction") {
    if (!data.establishment.trim()) return "Missing required field: establishment";
    // Only "Government Establishments" currently has a ministry/department follow-up
    // list in Studio - other establishments with subOptions rely on the form's
    // required <select> to enforce this client-side.
    if (data.establishment === "Government Establishments" && !data.ministryDepartment.trim()) {
      return "Missing required field: ministryDepartment";
    }
    if (!data.placeOfWork.trim()) return "Missing required field: placeOfWork";
    if (!data.deductionStartMonth.trim()) return "Missing required field: deductionStartMonth";
    if (!data.agreeDeduction) {
      return "You must agree to the salary deduction authorization terms.";
    }
  } else {
    if (!data.firstPaymentDate.trim()) return "Missing required field: firstPaymentDate";
  }
  return null;
}

export function fullName(data: MembershipFormData): string {
  return [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
}
