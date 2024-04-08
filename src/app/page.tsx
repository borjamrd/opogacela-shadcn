import { Navbar } from "@/components/Navbar";
import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Services } from "@/components/Services";
import { Cta } from "@/components/Cta";
import { Testimonials } from "@/components/Testimonials";
import { Team } from "@/components/Team";
import { Pricing } from "@/components/Pricing";
import { Newsletter } from "@/components/Newsletter";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Cart from "@/components/Cart";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />

      <div className="lg:hidden fixed bottom-4 right-4" >
        <Cart />
      </div>

      <ScrollToTop />

    </div>
  )
}
