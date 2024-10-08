'use client'
import { supabase } from '../../lib/supabase';
import { Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster"
import { useSearchParams } from "next/navigation";


export default function Page() {
    let params = new URLSearchParams(document.location.search);
    let id = params.get("id"); // is the string "Jonathan"

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
            <div className="flex flex-col gap-2 w-full">
                <h1 className="text-2xl font-bold mb-4">Validación testimonial</h1>
                {confirming ?
                    <div>Validando...</div> :
                    <div>
                        {confirmed ?
                            <div>Se ha validado correctamente el testimonial</div> :
                            <div>No se ha validado</div>}
                    </div>}
            </div>
        </section>
        <Toaster />

    </div>


}