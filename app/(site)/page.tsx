import Hero from "@/components/Hero";
import PhotoCarousel from "@/components/PhotoCarousel";
import About from "@/components/About";
import ShopStewards from "@/components/ShopStewards";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";
import { getNewsPosts, getServices, getShopStewards, getSiteSettings } from "@/sanity/lib/queries";

export default async function Home() {
  const [services, newsPosts, shopStewards, siteSettings] = await Promise.all([
    getServices(),
    getNewsPosts(),
    getShopStewards(),
    getSiteSettings(),
  ]);

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <PhotoCarousel />
      <About
        themeLabel={siteSettings.aboutThemeLabel}
        themeText={siteSettings.aboutThemeText}
        pillars={siteSettings.aboutPillars}
        values={siteSettings.aboutValues}
      />
      <ShopStewards stewards={shopStewards} />
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
