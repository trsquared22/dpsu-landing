import Hero from "@/components/Hero";
import PhotoCarousel from "@/components/PhotoCarousel";
import About from "@/components/About";
import ShopStewards from "@/components/ShopStewards";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";
import {
  getCarouselSlides,
  getNewsPosts,
  getServices,
  getShopStewards,
  getSiteSettings,
} from "@/sanity/lib/queries";

export default async function Home() {
  const [services, newsPosts, shopStewards, carouselSlides, siteSettings] = await Promise.all([
    getServices(),
    getNewsPosts(),
    getShopStewards(),
    getCarouselSlides(),
    getSiteSettings(),
  ]);

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <PhotoCarousel slides={carouselSlides} />
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
