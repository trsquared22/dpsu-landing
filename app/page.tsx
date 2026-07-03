import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import News from "@/components/News";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <About />
      <Stats />
      <Services />
      <News />
      <Contact />
    </main>
  );
}
