"use client"

import { ShoppingCart } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button, buttonVariants } from "./ui/button"
import { useOpogaceStore } from "@/lib/store"
import { Badge } from "./ui/badge"
import AddToCart from "./AddToCart"
import TypeBadge from "./TypeBadge"

export default function Cart() {

    const { prices } = useOpogaceStore()

    const checkout = async () => {

        let pricesToSend: {
            price: string;
            quantity: number;
        }[] = []

        prices.map((price) => pricesToSend.push({
            price: price.id,
            quantity: 1,
        }))
        const res = await fetch('api/checkout', {
            method: 'POST',
            body: JSON.stringify({ prices: pricesToSend }),
            headers: { 'Content-Type': 'application/json' }
        })

        const { url } = await res.json()
        window.location.href = url
    }

    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className={`border relative ${buttonVariants({ variant: "secondary" })}`} >
                {prices.length > 0 && <Badge className="absolute -top-2 -right-2 z-10 ">{prices.length}</Badge>}
                <span className="lg:hidden mr-2">Carrito de compra</span>
                <ShoppingCart className="w-5 h-5" />
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-5xl">
            <AlertDialogHeader>
                <AlertDialogTitle>Finaliza tu compra</AlertDialogTitle>

                {!prices.length && <div className="flex h-20 w-full"><p className="m-auto">No tienes items en el carrito</p></div>}
                <div className="flex flex-col text-start gap-2 max-h-[50vh] overflow-auto">
                    {prices.map((pricing: any) =>

                        <div key={pricing.id} className='flex relative flex-col lg:flex-row lg:gap-2 gap-8 p-3 rounded-lg border bg-card text-card-foreground shadow-sm'>
                            <TypeBadge type={pricing.product?.metadata?.type} />
                            <div className='lg:w-3/4 mt-10 flex flex-col'>
                                <span className='lg:text-2xl text-lg font-semibold leading-none tracking-tight'> {pricing.nickname}</span>
                                <span className="lg:text-3xl text-base font-bold">{pricing.unit_amount && pricing.unit_amount / 100} €</span>
                            </div>
                            <div className='lg:w-1/4 flex items-end justify-end'>
                                <AddToCart price={pricing} />
                            </div>
                        </div>

                    )}
                </div>

            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                {prices.length > 0 && <AlertDialogAction onClick={checkout}>Continuar (no pagarás aún)</AlertDialogAction>}

            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>

}