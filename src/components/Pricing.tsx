
import { Stripe } from 'stripe'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ButtonCheckout from './ButtonCheckout';

async function loadPrices() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const prices = await stripe.prices.list({
        expand: ["data.product"]
    })
    return prices.data
}

export const Pricing = async () => {
    const prices = await loadPrices()
    return (
        <section
            id="pricing"
            className="container py-24 sm:py-32"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-center">
                Get
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    {" "}
                    Unlimited{" "}
                </span>
                Access
            </h2>
            <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                reiciendis.
            </h3>
            <div className="flex gap-8 flex-col">
                {prices.map((pricing) =>

                    <div key={pricing.id} className='flex p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                        <div className='w-3/4'>
                            <h3 className='text-2xl font-semibold leading-none tracking-tight'> {pricing.nickname}</h3>
                            <span className="text-3xl font-bold">{pricing.unit_amount && pricing.unit_amount / 100} €</span>
                        </div>
                        <div className='w-1/4 flex gap-2'>
                            <Button variant={'secondary'} className="w-full">Añadir al carrito</Button>
                            <ButtonCheckout priceId={pricing.id} />
                        </div>
                    </div>

                )}
            </div>
        </section>
    );
};