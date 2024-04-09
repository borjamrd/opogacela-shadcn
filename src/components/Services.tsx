"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MagnifierIcon, WalletIcon, ChartIcon } from "./Icons";
import notes from "../../public/svg/notes.svg";
import learning from "../../public/svg/learning.svg";
import law from "../../public/svg/law.svg";
import Image from "next/image";
import { useState } from "react";

interface ServiceProps {
    title: string;
    description: string;
    icon: JSX.Element;
    image: any;
}

const serviceList: ServiceProps[] = [
    {
        title: "Apuntes y esquemas",
        description:
            "Tanto para A2 como para Administrativo, están divididos por bloques y resumidos con lo esencial para poder memorizar más rápido.",
        icon: <ChartIcon />,
        image: notes,
    },
    {
        title: "Clases particulares",
        description:
            "Trucos de conciliación, técnicas de estudios, métodos de memorización... Actualmente he ayudado a varios opositores a organizarse mejor.",
        icon: <MagnifierIcon />,
        image: learning,
    },
    {
        title: "Leyes individuales",
        description:
            "Soluciones específicas para problemas concretos. ¿Se te atasca una ley? Seguramente la tenga explicada.",
        icon: <WalletIcon />,
        image: law,
    },
];

export const Services = () => {

    const [selected, setSelected] = useState<ServiceProps>(serviceList[0])

    return (
        <section className="py-24 sm:py-32">
            <div className="container grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold">
                        ¿Qué puedes{" "}
                        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                            conseguir aquí?
                        </span>

                    </h2>

                    <p className="text-muted-foreground text-xl mt-4 mb-8 ">
                        Te puedo ayudar con esto y mucho más, y si tienes alguna duda siempre puedes contactar conmigo.
                    </p>

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