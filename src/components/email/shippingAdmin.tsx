import * as React from 'react';

interface ShippingAdminDetailsProps {
    name?: string;
    email?: string;
    address: {
        city?: string;
        country?: string,
        line1?: string,
        line2?: string,
        postal_code?: string,
        state?: string
    } | any;
}

export const ShippingAdminDetails: React.FC<Readonly<ShippingAdminDetailsProps>> = ({
    name, email, address
}) => (
    <div className='w-full h-96 flex flex-col gap-2'>
        <h1>Nueva compra a nombre de: {name}!</h1>

        <p className='mb-3'>Prepara el pedido para enviar a la siguiente dirección: </p>
        <p>Correo eletrónico de contacto: {email}</p>
        <ul>
            <li>Dirección (línea 1): {address?.line1}</li>
            <li>Dirección (línea 2): {address?.line2}</li>
            <li>Código Postal: {address?.postal_code}</li>
            <li>Ciudad: {address?.city}</li>

        </ul>




    </div>
);
