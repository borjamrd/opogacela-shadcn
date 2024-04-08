"use client"

import { useOpogaceStore } from "@/lib/store";
import { Button } from "./ui/button";
import Stripe from "stripe";
import { useEffect, useState } from "react";

export default function AddToCart({ price }: { price: Stripe.Price }) {

    const { addPrices, prices, removePrices } = useOpogaceStore()
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, [prices]);

    if (loading) {
        return <Button disabled variant={'secondary'}>
            Cargando...
        </Button>;
    }

    if (loading) {
        return <div>Loading...</div>; // Muestra un estado de carga mientras se carga prices
    }

    const isProductInCart = prices.some((cartPrice) => cartPrice.id === price.id);

    const handleClick = () => {
        if (isProductInCart) {
            removePrices(price.id);
        } else {
            addPrices(price);
        }
    };

    return (
        <Button variant={isProductInCart ? 'secondary' : 'outline'} onClick={handleClick}>
            {isProductInCart ? 'Quitar del carrito' : 'Añadir al carrito'}
        </Button>
    );


}