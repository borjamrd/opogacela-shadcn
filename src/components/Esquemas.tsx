
import { Stripe } from 'stripe';
import AddToCart from './AddToCart';
import ButtonCheckout from './ButtonCheckout';
import TypeBadge from './TypeBadge';

async function loadPrices() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const prices = await stripe.prices.list({
        expand: ["data.product"],
        active: true,

    })

    const gacePrices = prices.data.filter((price: any) => price.product?.metadata?.type == 'gace')
    gacePrices.sort((a: any, b: any) => a.product.metadata?.order - b.product.metadata.order)

    const adminPrices = prices.data.filter((price: any) => price.product?.metadata?.type == 'admin')
    adminPrices.sort((a: any, b: any) => a.product.metadata?.order - b.product.metadata.order)
    return { gacePrices, adminPrices }
}

export const Esquemas = async () => {
    const { gacePrices, adminPrices } = await loadPrices()
    return (
        <div>
            <section
                id="esquemas"
                className="container py-24 sm:py-32"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                    Apuntes y esquemas
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                        {" "}
                        GACE{" "}
                    </span>

                </h2>
                <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                    reiciendis.
                </h3>
                <div className="flex gap-8 flex-col">
                    {gacePrices.map((pricing: any) =>

                        <div key={pricing.id} className='flex relative flex-col lg:gap-1  gap-8 lg:flex-row p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                            <TypeBadge pricing={pricing} />
                            <div className='mt-10 lg:w-3/4'>
                                <h3 className='lg:text-2xl text-lg font-semibold leading-none tracking-tight'> {pricing.nickname}</h3>

                                <span className="lg:text-3xl text-base font-bold">{pricing.unit_amount && pricing.unit_amount / 100} €</span>
                            </div>
                            <div className='lg:w-1/4 flex gap-2'>
                                <AddToCart price={pricing} />
                                <ButtonCheckout priceId={pricing.id} />
                            </div>
                        </div>

                    )}
                </div>
            </section>
            <section
                id="esquemas"
                className="container py-24 sm:py-32"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                    Esquemas
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                        {" "}
                        administrativo{" "}
                    </span>

                </h2>
                <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                    reiciendis.
                </h3>
                <div className="flex gap-8 flex-col">
                    {adminPrices.map((pricing: any) =>

                        <div key={pricing.id} className='flex relative flex-col lg:gap-1  gap-8 lg:flex-row p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                            <TypeBadge pricing={pricing} />  <div className='mt-10 lg:w-3/4'>
                                <h3 className='lg:text-2xl text-lg font-semibold leading-none tracking-tight'> {pricing.nickname}</h3>

                                <span className="lg:text-3xl text-base font-bold">{pricing.unit_amount && pricing.unit_amount / 100} €</span>
                            </div>
                            <div className='lg:w-1/4 flex gap-2'>
                                <AddToCart price={pricing} />
                                <ButtonCheckout priceId={pricing.id} />
                            </div>
                        </div>

                    )}
                </div>
            </section>
        </div>

    );
};