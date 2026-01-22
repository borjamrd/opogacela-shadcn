import * as React from 'react';

interface KlarnaReminderEmailProps {
    name?: string;
    checkoutUrl?: string;
}

export const KlarnaReminderEmail: React.FC<Readonly<KlarnaReminderEmailProps>> = ({
    name,
    checkoutUrl,
}) => (
    <div className="w-full h-96 flex flex-col gap-2">
        <h1>¡Hola, {name}!</h1>

        <p className="mb-3">
            Hemos notado que ha habido un problema con el pago de tu pedido en Opogacela. No te
            preocupes, a veces ocurre.
        </p>

        <p className="mb-3">
            Queríamos recordarte que disponemos de <strong>Klarna</strong> como método de pago, lo
            que te permite financiar tu compra <strong>sin ningún tipo de interés</strong>.
        </p>

        <p className="mb-3">
            Puedes intentar realizar el pago nuevamente o finalizar tu compra a través del siguiente
            enlace:
        </p>

        {checkoutUrl && (
            <div className="my-4">
                <a
                    href={checkoutUrl}
                    className="bg-black text-white px-4 py-2 rounded no-underline"
                    style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        textDecoration: 'none',
                    }}
                >
                    Retomar mi compra
                </a>
            </div>
        )}

        <p className="mt-4">
            Si tienes alguna duda o necesitas ayuda, puedes responder a este correo o contactarnos
            por WhatsApp.
        </p>
    </div>
);
