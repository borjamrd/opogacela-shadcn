"use client";

import { useOpogaceStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";
import AddToCart from "./AddToCart";
import TypeBadge from "./TypeBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import { useState } from "react";

export default function Cart() {
  const { prices, removeAllPrices } = useOpogaceStore();
  const [accepted, setAccepted] = useState(false);
  const checkout = async () => {
    let pricesToSend: {
      price: string;
      quantity: number;
    }[] = [];

    prices.map((price) =>
      pricesToSend.push({
        price: price.id,
        quantity: 1,
      })
    );
    const res = await fetch("api/checkout", {
      method: "POST",
      body: JSON.stringify({ prices: pricesToSend }),
      headers: { "Content-Type": "application/json" },
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className={`border relative ${buttonVariants({
            variant: "secondary",
          })}`}
        >
          {prices.length > 0 && (
            <Badge className="absolute -top-2 -right-2 z-10 ">
              {prices.length}
            </Badge>
          )}
          <span className="lg:hidden mr-2">Carrito de compra</span>
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-5xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Finaliza tu compra</AlertDialogTitle>

          {!prices.length && (
            <div className="flex h-20 w-full">
              <p className="m-auto">No tienes items en el carrito</p>
            </div>
          )}
          <div className="flex flex-col text-start gap-2 max-h-[50vh] overflow-auto">
            {prices.map((pricing: any) => (
              <div
                key={pricing.id}
                className="flex relative flex-col lg:flex-row lg:gap-2 gap-8 p-3 rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <TypeBadge type={pricing?.metadata?.type} />
                <div className="lg:w-3/4 mt-10 flex flex-col">
                  <span className="lg:text-2xl text-lg font-semibold leading-none tracking-tight">
                    {" "}
                    {pricing.nickname}
                  </span>
                  <span className="lg:text-3xl text-base font-bold">
                    {pricing.unit_amount && pricing.unit_amount / 100} €
                  </span>
                </div>
                <div className="lg:w-1/4 flex items-end justify-end">
                  <AddToCart price={pricing} />
                </div>
              </div>
            ))}
          </div>

        </AlertDialogHeader>
        <div className="rounded bg-red-50 text-red-900 text-xs p-3 flex flex-col gap-2">
          <span>¡Atención! La letra de este material es pequeña: Calibri tamaño 7. Te recomendamos la impresión previa de uno de nuestros ejemplos para comprobar que estás cómodo con su lectura. No se hacen devoluciones de material salvo error en impresión o encuadernación.
          </span>
          <div className="flex gap-2">
            <input id="terms" type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} />
            <label htmlFor="terms">Estoy conforme con el formato del material</label>
          </div>


        </div>
        <AlertDialogFooter>

          {/* <div className="p-2 rounded-sm bg-red-200 text-red-700 font-bold text-balance">
            Provisionalmente la forma de pago será exclusivamente mediante Bizum
            al número 658 78 52 88. Una vez realizado escribeme al mismo número para proceder con el envío.
             En breve reactivaremos de nuevo las demás
            formas de pago con tarjeta.
          </div> */}
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
          {prices.length > 0 && (
            <AlertDialogCancel onClick={() => removeAllPrices()}>
              Vaciar carrito
            </AlertDialogCancel>
          )}
          {prices.length > 0 && <AlertDialogAction disabled={!accepted} onClick={checkout}>Continuar (no pagarás aún)</AlertDialogAction>}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
