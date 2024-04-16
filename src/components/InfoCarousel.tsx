"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import checkout from "../../public/svg/checkout.svg";
import collaboration from "../../public/svg/collaboration.svg";
import messages from "../../public/svg/messages.svg";
import studying from "../../public/svg/studying.svg";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function InfoCarousel() {
  interface FeatureProps {
    image: any;
    title: string;
    description?: string;
    list?: string[];
  }

  const features: FeatureProps[] = [
    {
      image: checkout,
      title: "¿En qué me pueden ayudar?",
      list: [
        "Condensan la inforación centrándose en lo más importante (y preguntable).",
        "Interrelacionan conceptos, permitiendo un aprendizaje holístico.",
        "Reorganizan la información para facilizar la memorización.",
      ],
    },
    {
      image: messages,
      title: "Características del contenido",
      list: [
        "Marco jurídico completo, señalando en todo momento la fuente de información. ",
        "Respeto de la literalidad de la normativa lo máximo posible.",
        "Organizado en cuadros sinópticos.",
      ],
    },
    {
      image: studying,
      title: "Cómo aprovecharlos al máximo",
      description:
        "Una vez hayas estudiado un tema, acude a los esquemas y observa qué información es la que se destaca en ellos y cuál es la forma más adecuada para enfocar el estudio. A veces, los epígrafes de un tema no siguen el orden más intuitivo de estudio, algo que los esquemas intentan paliar. Por supuesto, haz tus anotaciones, añade información y realiza todos los cambios que desees para hacer “tuyos” los esquemas. Cada cerebro funciona de una manera, y es imposible que un solo método valga para todo el mundo. Por supuesto, si encuentras una errata o tienes sugerencias de mejora, házmelo saber por email.",
    },
    {
      image: collaboration,
      title: "Formato",
      description:
        "Los esquemas se entregan impresos a doble cara, a color y encuadernados, letra Calibri tamaño 7. Se puede adquirir un pack completo del temario o bloques individuales. También hay esquemas independientes de leyes concretas. No se altera el formato ni se venden temas sueltos. Puedes descargar un ejemplo aquí",
    },
  ];
  return (
    <div className="lg:px-10 px-8">
      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 15000,
          }),
        ]}
        className="lg:max-w-full max-w-full"
      >
        <CarouselContent>
          {features.map(({ image, title, description, list }: FeatureProps) => (
            <CarouselItem key={title} className="lg:basis-1/1">
              {" "}
              <Card key={title} className="bg-muted/50 flex gap-4">
                <div className="flex flex-col gap-2">
                  <CardHeader className="pb-2">
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {description}
                    {list && (
                      <ul className="list-disc list-inside">
                        {list.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
