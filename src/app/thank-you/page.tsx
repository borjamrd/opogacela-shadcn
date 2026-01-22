'use client';
import { Button } from '@/components/ui/button';
import { useOpogaceStore } from '@/lib/store';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ThankYou() {
    const { removeAllPrices } = useOpogaceStore();
    useEffect(() => {
        removeAllPrices();
    }, []);
    return (
        <div>
            <section className="w-full h-[80vh] flex  items-center justify-center">
                <div className="max-w-5xl p-10 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-5 text-foreground">
                        ¡Gracias por tu compra! 🎊
                    </h2>
                    <p>
                        Te llegará un correo con la información de tu compra, revisa SPAM por si
                        acaso 😄
                    </p>
                    <Button variant={'link'} className="mt-10" asChild>
                        <Link href="/">Volver al inicio</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
