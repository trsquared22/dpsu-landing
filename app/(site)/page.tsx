import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";
import { getMembershipStats, getNewsPosts, getServices, getSiteSettings } from "@/sanity/lib/queries";

export default async function Home() {
  const [services, newsPosts, membershipStats, siteSettings] = await Promise.all([
    getServices(),
    getNewsPosts(),
    getMembershipStats(),
    getSiteSettings(),
  ]);

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <About
        themeLabel={siteSettings.aboutThemeLabel}
        themeText={siteSettings.aboutThemeText}
        pillars={siteSettings.aboutPillars}
        values={siteSettings.aboutValues}
      />
      <Stats memberships={membershipStats} />
      <Services services={services} />
      <News items={newsPosts} />
      <Contact
        email={siteSettings.contactEmail}
        phone={siteSettings.contactPhone}
        facebookUrl={siteSettings.facebookUrl}
      />
    </main>
  );
}
