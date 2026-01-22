import * as React from "react";

interface ShippingDetailsProps {
  name?: string;
  email?: string;
  address:
    | {
        city?: string;
        country?: string;
        line1?: string;
        line2?: string;
        postal_code?: string;
        state?: string;
      }
    | any;
}

export const ShippingDetails: React.FC<Readonly<ShippingDetailsProps>> = ({
  name,
  email,
  address,
}) => (
  <div className="w-full h-96 flex flex-col gap-2">
    <h1>¡Gracias por realizar tu compra, {name}!</h1>

    <p className="mb-3">
      Según la información que nos has proporcionado durante la compra, te
      enviaremos los apuntes a esta dirección:
    </p>
    <ul>
      <li>Dirección (línea 1): {address?.line1}</li>
      <li>Dirección (línea 2): {address?.line2}</li>
      <li>Código Postal: {address?.postal_code}</li>
      <li>Ciudad: {address?.city}</li>
    </ul>

    <p className="">
      El pedido tarda en llegar entre 4 y 5 días. Puedes contactar conmigo por{" "}
      <a
        href={`https://wa.me/658785288?text=Tengo%20dudas%20sobre%20los%20apuntes`}
      >
        {" "}
        Whatsapp{" "}
      </a>{" "}
      en caso de cualquier duda.
    </p>
  </div>
);
