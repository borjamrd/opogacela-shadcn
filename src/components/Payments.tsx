import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import { BsStripe, BsPaypal } from 'react-icons/bs';
import { FaCcVisa } from 'react-icons/fa';
import { SiKlarna, SiApplepay, SiGooglepay } from 'react-icons/si';

const Icons = {
    klarna: () => <SiKlarna className="w-full h-full text-primary dark:text-white" />,
    visa: () => <FaCcVisa className="w-full h-full text-primary dark:text-white" />,
    paypal: () => <BsPaypal className="w-full h-full text-primary dark:text-white" />,
    applePay: () => <SiApplepay className="w-full h-full text-primary dark:text-white" />,
    googlePay: () => <SiGooglepay className="w-full h-full text-primary dark:text-white" />,
    stripe: () => <BsStripe className="w-full h-full text-primary dark:text-white" />,
};

export function Payments() {
    return (
        <section className="container py-14 sm:py-14">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Left Column: Orbiting Circles */}
                <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
                    <OrbitingCircles path={true} radius={40} iconSize={40}>
                        <Icons.klarna />
                    </OrbitingCircles>
                    <OrbitingCircles path={true} radius={100} reverse iconSize={40}>
                        <Icons.visa />
                    </OrbitingCircles>
                    <OrbitingCircles path={true} radius={120} iconSize={40}>
                        <Icons.paypal />
                    </OrbitingCircles>
                    <OrbitingCircles path={false} radius={120} iconSize={40} speed={2}>
                        <Icons.applePay />
                    </OrbitingCircles>
                    <OrbitingCircles path={true} radius={150} reverse iconSize={40}>
                        <Icons.googlePay />
                    </OrbitingCircles>
                    <OrbitingCircles path={false} radius={180} iconSize={40}>
                        <Icons.stripe />
                    </OrbitingCircles>
                    <OrbitingCircles path={true} radius={180} iconSize={40} reverse speed={1}>
                        <Icons.applePay />
                    </OrbitingCircles>
                </div>

                {/* Right Column: Text Content */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
                        Paga <span className="text-primary">como quieras</span>
                    </h2>
                    <p className="text-xl text-muted-foreground">
                        Te ofrezco varias opciones de pago para hacer el trámite lo más fiable y
                        rápido posible. Recuerda que tienes la opción de pagarlo con 0% de intereses
                        mediante Klarna.
                    </p>
                </div>
            </div>
        </section>
    );
}
