import * as React from 'react';
import Stripe from 'stripe';

interface ShippingAdminDetailsProps {
    name?: string;
    email?: string;
    phone?: string | null | undefined;
    items?: Stripe.LineItem[] | undefined;
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

export const ShippingAdminDetails: React.FC<Readonly<ShippingAdminDetailsProps>> = ({
    name,
    email,
    address,
    phone,
    items,
}) => (
    <div className="w-full h-96 flex flex-col gap-2">
        <h1>
            Nueva compra por{' '}
            {((items ?? []).reduce((sum, it) => sum + (it.amount_total ?? 0), 0) / 100).toFixed(2)}{' '}
            € a nombre de: {name}!
        </h1>

        <p className="mb-3">
            {`Prepara ${!items?.length ? 'el pedido ' : 'los pedidos '}para la siguiente dirección:`}
        </p>
        <p>Correo electrónico: {email}</p>
        <p>Teléfono: {phone}</p>
        <ul>
            <li>Dirección (línea 1): {address?.line1}</li>
            <li>Dirección (línea 2): {address?.line2}</li>
            <li>Código Postal: {address?.postal_code}</li>
            <li>Ciudad: {address?.city}</li>
        </ul>
        <div className="p-3 flex flex-col">
            <h4>{!!items?.length ? 'Producto' : 'productos'}</h4>
            <div>
                {items?.map((item, index) => (
                    <ul key={index}>
                        <li>Descripción: {item.description}</li>
                        <li>Cantidad: {item.quantity}</li>
                        <li>Precio: {(item.amount_total ?? 0) / 100} €</li>
                    </ul>
                ))}
            </div>
        </div>
    </div>
);
