import { About } from "@/components/About";
import Cart from "@/components/Cart";
import { Cta } from "@/components/Cta";
import { Delivery } from "@/components/Delivery";
import { Esquemas } from "@/components/Esquemas";
import { Examples } from "@/components/Examples";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";

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
