'use client';

import { ChartIcon, MagnifierIcon, WalletIcon } from './Icons';
import notes from '../../public/svg/notes.svg';
import law from '../../public/svg/law.svg';
import exams from '../../public/svg/Exams-bro.svg';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import { FaTelegramPlane } from 'react-icons/fa';
import Link from 'next/link';

interface ServiceProps {
    title: string;
    description?: string;
    icon: JSX.Element;
    list?: string[];
    image: any;
    cta?: JSX.Element;
}

const serviceList: ServiceProps[] = [
    {
        title: 'Esquemas',
        icon: <ChartIcon />,
        list: [
            'Gestión A2: todos los bloques',
            'Administrativo (C1): Todos los bloques salvo Bloque II e Informática',
        ],
        image: notes,
        cta: (
            <Link href="/infografias" className={buttonVariants({ variant: 'default' })}>
                Ver esquemas
            </Link>
        ),
    },
    {
        title: 'Exámenes oficiales',
        description:
            'Visualiza y descarga más de 1500 preguntas de exámenes oficiales en un solo lugar, completamente gratis.',
        icon: <MagnifierIcon />,
        image: exams,
        cta: (
            <Link href="/preguntas" className={buttonVariants({ variant: 'default' })}>
                Ver preguntas
            </Link>
        ),
    },
    {
        title: 'Bot de Telegram',
        description:
            'Evita acceder continuamente al INAP para revisar las actualizaciones. Nuestro bot lo hace por ti y te informa de cualquier cambio.',
        icon: <WalletIcon />,
        image: law,
        cta: (
            <Link
                href="https://t.me/gacenews"
                target="_blank"
                className={buttonVariants({ variant: 'default' })}
            >
                <FaTelegramPlane className="h-4 w-4 mr-2" />
                Accede al canal
            </Link>
        ),
    },
];

function ServiceCard({ service }: { service: ServiceProps }) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow duration-300 hover:shadow-lg pb-20">
            <div className="flex items-center justify-center overflow-hidden px-8 pt-8 h-56">
                <Image
                    src={service.image}
                    alt={service.title}
                    className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col p-6 pt-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="bg-primary/20 p-1 rounded-xl">{service.icon}</div>
                    <h3 className="font-semibold text-base">{service.title}</h3>
                </div>

                {service.description && (
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                )}

                {service.list && (
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-1">
                        {service.list.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                )}
            </div>

            {service.cta && (
                <div className="absolute bottom-6 left-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {service.cta}
                </div>
            )}
        </div>
    );
}

export const Services = () => {
    return (
        <section className="py-24 sm:py-32">
            <div className="container">
                <h2 className="text-3xl md:text-4xl font-bold mb-10">
                    ¿Qué puedes{' '}
                    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                        conseguir aquí?
                    </span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {serviceList.map((s) => (
                        <ServiceCard key={s.title} service={s} />
                    ))}
                </div>
            </div>
        </section>
    );
};
