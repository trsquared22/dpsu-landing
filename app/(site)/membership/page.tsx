import MembershipForm from "@/components/MembershipForm";
import { getEstablishments } from "@/sanity/lib/queries";

export default async function MembershipPage() {
  const establishments = await getEstablishments();
  return <MembershipForm establishments={establishments} />;
}
