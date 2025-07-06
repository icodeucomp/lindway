import { Footer, EverySnap } from "@/components/ui";
import { AboutUs, Hero, ContactUs, Initiative, SizeGuide, Characteristics } from "@/components/ui/home";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutUs />
      {/* <MyLindway />
      <LindwaySimply />
      <LindwayLure /> */}
      <ContactUs />
      <Initiative />
      <SizeGuide />
      <Characteristics />
      <EverySnap />
      <Footer />
    </main>
  );
}
