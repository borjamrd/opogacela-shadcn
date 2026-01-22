import { About } from '@/components/About';
import Cart from '@/components/Cart';
import { Cta } from '@/components/Cta';
import { Delivery } from '@/components/Delivery';
import { Esquemas } from '@/components/Esquemas';
import { Examples } from '@/components/Examples';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Payments } from '@/components/Payments';
import { Services } from '@/components/Services';
import { Testimonials } from '@/components/Testimonials';

export default function Home() {
    return (
        <div>
            <Hero />
            <About />
            <Services />
            <HowItWorks />
            <Delivery />
            <Examples />
            <Esquemas />
            <Testimonials />
            <Payments />
            <Cta />
            <FAQ />
            <Footer />

            <div className="lg:hidden fixed bottom-4 right-10">
                <Cart />
            </div>
        </div>
    );
}
