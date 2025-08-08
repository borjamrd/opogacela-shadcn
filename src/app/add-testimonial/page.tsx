'use client'
import { Testimonial } from "@/components/Testimonials";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";



export default function Page() {
    const { toast } = useToast();
    const supabase = createClient();

    const [formData, setFormData] = useState<Partial<Testimonial>>({
        name: '',
        surname: '',
        description: '',
        linkedin: '',
        instagram: '',
        website: '',
        position: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        const { data: testimonials, error } = await supabase.from('testimonials').insert([{
            name: formData.name,
            surname: formData.surname,
            description: formData.description,
            linkedin: formData.linkedin,
            instagram: formData.instagram,
            website: formData.website,
            position: formData.position,
        }]).select()

        if (error) {
            return toast({
                variant: 'destructive',
                description: 'Ha habido un error al guardar la información, inténtalo de nuevo en unos minutos.'
            })
        }

        if (testimonials) {
            const res = await fetch('api/testimonials', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    newTestimonial: testimonials[0],
                }),
            })
            const data = await res.json()
            if (data?.error) {
                return toast({
                    variant: 'destructive',
                    description: 'Ha habido un error, inténtalo de nuevo en unos minutos.'
                })
            }
            setFormData({
                name: '',
                surname: '',
                position: '',
                description: '',
                linkedin: '',
                instagram: '',
                website: ''
            })

            return toast({
                description: '¡Muchas gracias! 🎊 Recuerda que puede tardar unas horas su publicación.'
            })
        }
    }




    return <div>
        <section className="flex max-w-3xl justify-center items-center m-auto p-5">
            <div className="flex flex-col gap-2 w-full">
                <h1 className="text-2xl font-bold mb-4">Agregar testimonial</h1>
                <p className="text-xs ">Las opininones serán previamente revisadas y verificadas por lo que la publicación puede demorarse unas horas</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block mb-1">Nombre *</label>
                        <input type="text" id="name" name="name" required className="w-full px-3 py-2 border rounded-md" onChange={handleChange} value={formData.name} />
                    </div>
                    <div>
                        <label htmlFor="surname" className="block mb-1">Apellidos</label>
                        <input type="text" id="surname" name="surname" className="w-full px-3 py-2 border rounded-md" onChange={handleChange} value={formData.surname} />
                    </div>
                    <div>
                        <label htmlFor="position" className="block">Posición</label>
                        <span className="text-xs">Cuéntanos que estudias o qué has aprobado</span>
                        <input type="text" id="position" name="position" className="w-full px-3 py-2 border rounded-md" onChange={handleChange} value={formData.position} />
                    </div>
                    <div>
                        <label htmlFor="description" className="block mb-1">Descripción * (máximo 390 caracteres)</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                            onChange={handleChange}
                            value={formData.description}
                            maxLength={390}
                        ></textarea>
                        <p className="text-sm text-gray-500 mt-1">
                            {formData.description?.length}/390 caracteres
                        </p>
                    </div>
                    <div>
                        <label htmlFor="linkedin" className="block mb-1">LinkedIn</label>
                        <input type="url" id="linkedin" name="linkedin" className="w-full px-3 py-2 border rounded-md" onChange={handleChange} value={formData.linkedin} />
                    </div>
                    <div>
                        <label htmlFor="instagram" className="block mb-1">Instagram</label>
                        <input type="url" id="instagram" name="instagram" className="w-full px-3 py-2 border rounded-md" onChange={handleChange} value={formData.instagram} />
                    </div>
                    <div>
                        <label htmlFor="website" className="block mb-1">Página Web</label>
                        <input type="url" id="website" name="website" className="w-full px-3 py-2 border rounded-md" onChange={handleChange} value={formData.website} />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Enviar</button>
                </form>
            </div>

        </section>
        <Toaster />

    </div>
}