'use client';

import { useOpogaceStore } from '@/lib/store';
import { Stripe } from 'stripe';
import { Button } from './ui/button';

export default function ButtonCheckout({
    priceId,
    price,
}: {
    priceId?: string;
    price?: Stripe.Price;
}) {
    const { addPrices, setCartOpen } = useOpogaceStore();

    return (
        <Button
            onClick={async () => {
                if (price) {
                    addPrices(price);
                    setCartOpen(true);
                } else if (priceId) {
                    const res = await fetch('api/checkout', {
                        method: 'POST',
                        body: JSON.stringify({ prices: [{ price: priceId, quantity: 1 }] }),
                        headers: { 'Content-Type': 'application/json' },
                    });

                    const { url } = await res.json();
                    window.location.href = url;
                }
            }}
            className="w-fit"
        >
            Comprar ya
        </Button>
    );
}
