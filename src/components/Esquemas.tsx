import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stripe } from "stripe";
import { Aviso } from "./Aviso";
import { EsquemaContainer } from "./EsquemaContainer";

interface PriceWithMetadata extends Omit<Stripe.Price, "metadata"> {
  metadata: {
    type: string;
    order: number;
    pages?: string;
  };
}

async function loadPrices() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const prices = await stripe.prices.list({
    expand: ["data.product"],
    active: true,
    limit: 50,
  });

  const allPrices = prices.data.map((price) => ({
    ...price,
    metadata: {
      ...price.metadata,
      order: price.metadata?.order ? parseInt(price.metadata.order) : 0,
      type: price.metadata?.type || "",
      pages: price.metadata?.pages,
    },
  })) as PriceWithMetadata[];

  const gacePrices = allPrices.filter(
    (price) => price.metadata?.type === "gace"
  );
  const adminPrices = allPrices.filter(
    (price) => price.metadata?.type === "admin"
  );
  const lawPrices = allPrices.filter((price) => price.metadata?.type === "law");

  gacePrices.sort((a, b) => a.metadata.order - b.metadata.order);
  adminPrices.sort((a, b) => a.metadata.order - b.metadata.order);

  return { gacePrices, adminPrices, lawPrices };
}

export const Esquemas = async () => {
  const { gacePrices, adminPrices, lawPrices } = await loadPrices();

  return (
    <div>
      <section id="esquemas" className="container py-24 sm:py-32">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Todos tus
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            {" "}
            esquemas{" "}
          </span>
          en un solo lugar
        </h2>
        <h3 className="text-xl text-center text-muted-foreground py-4">
          Puedes escoger uno o varios bloques, recuerda que la compra se
          realizará en otra pestaña del navegador.
          <br />
          Recuerda que los esquemas{" "}
          <strong>se envían impresos (no en formato PDF) </strong>.
        </h3>
        <Aviso />
        <Tabs defaultValue="gace">
          <TabsList className="mx-auto grid max-w-4xl lg:grid-cols-3 grid-cols-1 lg:h-auto h-36 mb-6">
            <TabsTrigger value="gace">Gestión del Estado - A2</TabsTrigger>
            <TabsTrigger value="admin">
              Administrativo del Estado - C1
            </TabsTrigger>
            <TabsTrigger value="laws">Leyes individuales</TabsTrigger>
          </TabsList>
          {[
            { value: "gace", prices: gacePrices },
            { value: "admin", prices: adminPrices },
            { value: "laws", prices: lawPrices },
          ].map(({ value, prices }) => (
            <TabsContent key={value} value={value}>
              <div className="grid lg:grid-cols-2 gap-8">
                {prices.map((pricing: any) => (
                  <EsquemaContainer key={pricing.id} pricing={pricing} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};
