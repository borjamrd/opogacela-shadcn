'use client'
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmTestimonial() {


    const searchParams = useSearchParams()

    const id = searchParams.get('id')

    const [confirming, setConfirming] = useState<boolean>(true)
    const [confirmed, setConfirmed] = useState<boolean>(false)


    useEffect(() => {
        validate()
    }, [id])

    const validate = async () => {
        setConfirming(true)
        const { data, error } = await supabase.from('testimonials').update({ 'reviewed': true }).eq('id', id).select();
        if (data) {
            setConfirmed(data[0].reviewed)
        }
        if (error) {
            setConfirmed(false)
        }
        setConfirming(false)
    }

    return <div>
        <section className="flex max-w-3xl justify-center items-center m-auto p-5">
            <div className="flex flex-col gap-2 w-full items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Validación testimonial</h1>
                {confirming ?
                    <div>Validando...</div> :
                    <div>
                        {confirmed ?
                            <div>Se ha validado correctamente el testimonial. Puedes cerrar esta página.</div> :
                            <div>No se ha validado</div>}
                    </div>}
            </div>
        </section>
        <Toaster />

    </div>
}