
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
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
    const adminPrices = prices.data.filter((price: any) => price.product?.metadata?.type == 'admin')
    const lawPrices = prices.data.filter((price: any) => price.product?.metadata?.type == 'law')

    gacePrices.sort((a: any, b: any) => a.product.metadata?.order - b.product.metadata.order)
    adminPrices.sort((a: any, b: any) => a.product.metadata?.order - b.product.metadata.order)


    return { gacePrices, adminPrices, lawPrices }
}

export const Esquemas = async () => {
    const { gacePrices, adminPrices, lawPrices } = await loadPrices()
    return (
        <div>

            <section
                id="esquemas"
                className="container py-24 sm:py-32"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-center">
                    Todos tus
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                        {" "}
                        esquemas{" "}
                    </span>
                    en un sólo lugar

                </h2>
                <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                    Puedes escoger uno o varios bloques, recuerda que la compra se realizará en otra pestaña del navegador.
                </h3>
                <Tabs defaultValue="gace" >
                    <TabsList className="grid w-full lg:grid-cols-3 grid-cols-1 lg:h-auto h-36">
                        <TabsTrigger value="gace">Gestión del Estado - A2</TabsTrigger>
                        <TabsTrigger value="admin">Administrativo del Estado - C1</TabsTrigger>
                        <TabsTrigger value="laws">Leyes individuales</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gace">
                        <div className="flex gap-8 flex-col">
                            {gacePrices.map((pricing: any) =>

                                <div key={pricing.id} className='flex relative flex-col lg:gap-1  gap-8 lg:flex-row p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                                    <TypeBadge type={pricing.product?.metadata?.type} />
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
                    </TabsContent>
                    <TabsContent value="admin">
                        <div className="flex gap-8 flex-col">
                            {adminPrices.map((pricing: any) =>

                                <div key={pricing.id} className='flex relative flex-col lg:gap-1  gap-8 lg:flex-row p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                                    <TypeBadge type={pricing.product?.metadata?.type} />  <div className='mt-10 lg:w-3/4'>
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
                    </TabsContent>
                    <TabsContent value="laws">
                        <div className="flex gap-8 flex-col">
                            {lawPrices.map((pricing: any) =>

                                <div key={pricing.id} className='flex relative flex-col lg:gap-1  gap-8 lg:flex-row p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                                    <TypeBadge type={pricing.product?.metadata?.type} />
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
                    </TabsContent>
                </Tabs>

            </section>

        </div>

    );
};