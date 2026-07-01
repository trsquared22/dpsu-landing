export interface MembershipFormData {
  gender: "woman" | "man" | "";
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
  ministry: string;
  placeOfWork: string;
  accountingOfficer: string;
  deductionStartMonth: string;
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
  ministry: "",
  placeOfWork: "",
  accountingOfficer: "",
  deductionStartMonth: "",
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
  "ministry",
  "placeOfWork",
  "deductionStartMonth",
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
  if (!data.agreeDeduction) {
    return "You must agree to the salary deduction authorization terms.";
  }
  return null;
}

export function fullName(data: MembershipFormData): string {
  return [data.firstName, data.middleName, data.lastName].filter(Boolean).join(" ");
}
