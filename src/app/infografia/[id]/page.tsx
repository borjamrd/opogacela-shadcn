'use client';
import HtmlPreview from '@/components/HtmlPreview';
import { Button } from '@/components/ui/button';
import { useGetInfografiaById } from '@/hooks/useGetInfografiaById';
import { useRouter } from 'next/navigation';

export default function InfografiaPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const router = useRouter();
    const { infografia, isLoading, error } = useGetInfografiaById(id);

    if (isLoading) {
        return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (error) {
        return <div>Error al cargar las infografías</div>;
    }

    if (!infografia) {
        return <div>Infografía no encontrada</div>;
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Button variant={'link'} onClick={() => router.back()}>
                Atrás
            </Button>
            <HtmlPreview htmlContent={infografia.contenido_html} />{' '}
        </div>
    );
}
