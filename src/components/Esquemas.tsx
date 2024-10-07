
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Stripe } from 'stripe';
import AddToCart from './AddToCart';
import ButtonCheckout from './ButtonCheckout';
import { SchemeDescription } from "./SchemeDescription";
import TypeBadge from './TypeBadge';



async function loadPrices() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const prices = await stripe.prices.list({
        expand: ["data.product"],
        active: true,
        limit: 50,
    })
    const gacePrices = prices.data.filter((price: any) => price.metadata?.type === 'gace')
    const adminPrices = prices.data.filter((price: any) => price.metadata?.type === 'admin')
    const lawPrices = prices.data.filter((price: any) => price.metadata?.type === 'law')

    gacePrices.sort((a: any, b: any) => a.metadata?.order - b.metadata.order)
    adminPrices.sort((a: any, b: any) => a.metadata?.order - b.metadata.order)

    return { gacePrices, adminPrices, lawPrices }
}


export const EsquemaContainer = ({ pricing }: { pricing: any }) => (
    <div className='flex relative flex-col lg:gap-1 gap-8 p-3 lg:p-5 rounded-lg border bg-card text-card-foreground shadow-sm'>
        <TypeBadge type={pricing?.metadata?.type} />
        <div>
            <h3 className='lg:text-2xl text-lg font-semibold leading-none tracking-tight w-4/5'> {pricing.nickname}</h3>
            <span className="lg:text-3xl text-xl font-bold">{pricing.unit_amount && pricing.unit_amount / 100} €</span>
        </div>

        <SchemeDescription description={pricing?.product.description} features={pricing?.product.features} />
        <div className='flex gap-2 justify-end'>
            <AddToCart price={pricing} />
            {/* <ButtonCheckout priceId={pricing.id} /> */}
        </div>
    </div>
)

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
                    en un solo lugar

                </h2>
                <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
                    Puedes escoger uno o varios bloques, recuerda que la compra se realizará en otra pestaña del navegador.<br />
                    Recuerda que los esquemas <strong>se envían impresos (no en formato PDF) </strong>. Más información sobre el formato <a className="underline" href="#faq">aquí</a>.
                </h3>
                <Tabs defaultValue="gace" >
                    <TabsList className="grid w-full lg:grid-cols-3 grid-cols-1 lg:h-auto h-36">
                        <TabsTrigger value="gace">Gestión del Estado - A2</TabsTrigger>
                        <TabsTrigger value="admin">Administrativo del Estado - C1</TabsTrigger>
                        <TabsTrigger value="laws">Leyes individuales</TabsTrigger>
                    </TabsList>
                    <TabsContent value="gace">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {gacePrices.map((pricing: any) =>
                                <EsquemaContainer key={pricing.id} pricing={pricing} />
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="admin">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {adminPrices.map((pricing: any) =>
                                <EsquemaContainer key={pricing.id} pricing={pricing} />

                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="laws">
                        <div className="grid lg:grid-cols-2 gap-8">
                            {lawPrices.map((pricing: any) =>
                                <EsquemaContainer key={pricing.id} pricing={pricing} />
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

            </section>

        </div>

    );
};