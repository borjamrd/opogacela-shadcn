'use client';

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import ButtonCheckout from './ButtonCheckout';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';

export default function ViewPdfButton({ file, priceId }: { file: string; priceId: string }) {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pdfUrl = `/ejemplos/${file}`;

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = file;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {isMobile ? (
                <Button className="mt-2" variant="secondary" onClick={handleDownload}>
                    <Eye className="h-4 w-4 mr-2" />
                    Descargar PDF
                </Button>
            ) : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="mt-2" variant="secondary">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
                        <div className="flex-grow relative overflow-hidden">
                            <iframe
                                src={pdfUrl}
                                className="w-full h-full border-none"
                                title="Vista previa del PDF"
                            />
                        </div>

                        {/* Botón de compra flotante */}
                        <div className="absolute bottom-4 right-4">
                            <ButtonCheckout priceId={priceId} />
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
