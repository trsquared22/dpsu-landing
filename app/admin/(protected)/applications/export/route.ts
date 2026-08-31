import ExcelJS from "exceljs";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export async function GET() {
  await verifySession();

  const applications = await prisma.membershipApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Membership Applications");

  sheet.columns = [
    { header: "Status", key: "status", width: 12 },
    { header: "First Name", key: "firstName", width: 16 },
    { header: "Middle Name", key: "middleName", width: 16 },
    { header: "Last Name", key: "lastName", width: 16 },
    { header: "Gender", key: "gender", width: 10 },
    { header: "Date of Birth", key: "dateOfBirth", width: 14 },
    { header: "Occupation", key: "occupation", width: 20 },
    { header: "Email", key: "email", width: 28 },
    { header: "Phone (Home)", key: "phoneHome", width: 16 },
    { header: "Phone (Work)", key: "phoneWork", width: 16 },
    { header: "Phone (Cell)", key: "phoneCell", width: 16 },
    { header: "Address Line 1", key: "addressLine1", width: 24 },
    { header: "Address Line 2", key: "addressLine2", width: 20 },
    { header: "Address Line 3", key: "addressLine3", width: 20 },
    { header: "Payment Method", key: "paymentMethod", width: 18 },
    { header: "Establishment", key: "establishment", width: 30 },
    { header: "Ministry / Department", key: "ministryDepartment", width: 24 },
    { header: "Place of Work", key: "placeOfWork", width: 20 },
    { header: "Accounting Officer", key: "accountingOfficer", width: 20 },
    { header: "Deduction Start Month", key: "deductionStartMonth", width: 18 },
    { header: "First Payment Date", key: "firstPaymentDate", width: 16 },
    { header: "Witness Name", key: "witnessName", width: 20 },
    { header: "Signature", key: "membershipSignature", width: 24 },
    { header: "Agreed to Terms", key: "agreeTerms", width: 14 },
    { header: "Agreed to Deduction", key: "agreeDeduction", width: 16 },
    { header: "Submitted", key: "createdAt", width: 18 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const app of applications) {
    sheet.addRow({
      ...app,
      paymentMethod: app.paymentMethod === "salary_deduction" ? "Salary deduction" : "Over the counter",
      gender: app.gender === "female" ? "Female" : app.gender === "male" ? "Male" : app.gender,
      membershipSignature: app.membershipSignature.startsWith("data:image")
        ? "Drawn signature (see admin site)"
        : app.membershipSignature,
      agreeTerms: app.agreeTerms ? "Yes" : "No",
      agreeDeduction: app.agreeDeduction ? "Yes" : "No",
      createdAt: app.createdAt.toLocaleString("en-US", { timeZone: "America/Dominica" }),
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `dpsu-membership-applications-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
