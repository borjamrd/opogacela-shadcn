import AddToCart from "./AddToCart";
import ButtonCheckout from "./ButtonCheckout";
import { SchemeDescription } from "./SchemeDescription";
import TypeBadge from "./TypeBadge";

export const EsquemaContainer = ({ pricing }: { pricing: any }) => {
  return (
    <div className="flex relative flex-col lg:gap-1 gap-8 p-3 lg:p-5 rounded-lg border bg-card text-card-foreground shadow-sm">
      <TypeBadge type={pricing?.metadata?.type} />
      <div>
        <h3 className="lg:text-2xl text-lg font-semibold leading-none tracking-tight w-4/5">
          {" "}
          {pricing.nickname}
        </h3>
        <span className="lg:text-3xl text-xl font-bold">
          {pricing.unit_amount && pricing.unit_amount / 100} €
        </span>
      </div>

      <SchemeDescription
        description={pricing?.product!.description!}
        features={pricing?.product.features}
      />
      <div className="flex gap-2 justify-end">
        <AddToCart price={pricing} />
        <ButtonCheckout priceId={pricing.id} />
      </div>
    </div>
  );
};
