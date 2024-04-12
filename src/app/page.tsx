import { Navbar } from "@/components/Navbar";
import { About } from "@/components/About";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Examples } from "@/components/Examples";
import { Services } from "@/components/Services";
import { Cta } from "@/components/Cta";
import { Testimonials } from "@/components/Testimonials";
import { Team } from "@/components/Team";
import { Esquemas } from "@/components/Esquemas";
import { Newsletter } from "@/components/Newsletter";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import Cart from "@/components/Cart";
import { Delivery } from "@/components/Delivery";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <Delivery />
      <Examples />
      <Cta />
      <Testimonials />
      {/* <Team /> */}
      <Esquemas />
      <FAQ />
      <Footer />

      <div className="lg:hidden fixed bottom-4 right-4" >
        <Cart />
      </div>

      <ScrollToTop />

    </div>
  )
}
