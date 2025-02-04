"use client";

import { Eye, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import ButtonCheckout from "./ButtonCheckout";

export default function ViewPdfButton({
  file,
  priceId,
}: {
  file: string;
  priceId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/ejemplos/${file}`;

  // Detectar si es móvil al cargar el componente
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Cambia a true si el ancho de pantalla es menor a 768px (típico breakpoint móvil)
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Descargar el PDF en móviles
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Si es móvil, se descarga el PDF. Si es escritorio, abre el modal */}
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

          {/* Contenido del modal */}
          <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
            {/* Contenedor del PDF */}
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
