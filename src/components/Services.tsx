"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import notes from "../../public/svg/notes.svg";
import learning from "../../public/svg/learning.svg";
import law from "../../public/svg/law.svg";
import Image from "next/image";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { FaTelegramPlane } from "react-icons/fa";
import Link from "next/link";

interface ServiceProps {
  title: string;
  description?: string;
  icon: JSX.Element;
  list?: string[];
  image: any;
  button?: JSX.Element;
}

const serviceList: ServiceProps[] = [
  {
    title: "Esquemas",
    icon: <ChartIcon />,
    list: [
      "Gestión A2: todos los bloques",
      "Administrativo (C1): Todos los bloques salvo Bloque II e Informática",
    ],
    image: notes,
  },

  {
    title: "Bot de Telegram",
    description:
      "Evita acceder continuamente al INAP para revisar las actualizaciones. Nuestro bot lo hace por ti y te informa de cualquier cambio que se produzca. ",
    icon: <WalletIcon />,
    image: law,
    button: (
      <Link
        href={"https://t.me/gacenews"}
        target="_blank"
        className={buttonVariants({ variant: "default" }) + " mt-4"}
      >
        <FaTelegramPlane className="h-4 w-4 mr-2" />
        Accede a nuestro canal
      </Link>
    ),
  },
];

export const Services = () => {
  const [selected, setSelected] = useState<ServiceProps>(serviceList[0]);

  return (
    <section className="py-24 sm:py-32">
      <div className="container grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-8">
            ¿Qué puedes{" "}
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              conseguir aquí?
            </span>
          </h2>

          <div className="flex flex-col gap-8">
            {serviceList.map((item: ServiceProps) => (
              <Card onClick={() => setSelected(item)} key={item.title}>
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="text-md mt-2">
                      {item.description}
                    </CardDescription>
                    {item.list && (
                      <ul className="list-disc list-inside">
                        {item.list.map((i) => (
                          <li key={i}>{i}</li>
                        ))}
                      </ul>
                    )}
                    {item.button && item.button}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <Image
          src={selected.image}
          className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
          alt="About services"
        />
      </div>
    </section>
  );
};
