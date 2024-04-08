"use client"

import { Button } from "./ui/button";

export default function ButtonCheckout({ priceId }: { priceId: string }) {
    return <Button onClick={async () => {
        const res = await fetch('api/checkout', {
            method: 'POST',
            body: JSON.stringify({ prices: [{ price: priceId, quantity: 1 }] }),
            headers: { 'Content-Type': 'application/json' }
        })

        const { url } = await res.json()
        window.location.href = url
        console.log(url)

    }} className="w-full">Comprar ya</Button>
}