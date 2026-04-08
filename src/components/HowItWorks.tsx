'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import checkout from '../../public/svg/checkout.svg';
import messages from '../../public/svg/messages.svg';
import collaboration from '../../public/svg/collaboration.svg';
import { ShineBorder } from './ui/shine-border';

const SHINE_COLORS = ['hsl(359, 60%, 75%)', 'hsl(359, 60%, 55%)', 'hsl(359, 80%, 85%)'];

export const HowItWorks = () => {
    return (
        <section id="howitworks" className="container py-24 sm:py-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">
                Características de los{' '}
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    esquemas
                </span>
            </h2>

            <div className="flex flex-col gap-4">
                {/* Card superior — wrapper externo: ShineBorder fuera del overflow-hidden */}
                <div className="group relative rounded-2xl">
                    <ShineBorder
                        shineColor={SHINE_COLORS}
                        duration={10}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                    <div className="grid lg:grid-cols-2 rounded-2xl border bg-card">
                        {/* Texto */}
                        <div className="flex flex-col justify-center p-8 lg:p-12">
                            <p className="text-sm font-medium text-primary mb-3">
                                Saca el máximo partido
                            </p>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Cómo aprovechar los esquemas
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Los esquemas de Opogacela son una ayuda al estudio del temario de la
                                oposición. No sustituyen las leyes ni los manuales de estudio, pero
                                agilizan enormemente la comprensión y el repaso de los bloques
                                temáticos.
                            </p>
                        </div>

                        {/* Imagen animada — overflow-hidden solo en esta sección */}
                        <div className="relative h-[320px] overflow-hidden rounded-r-2xl">
                            <div className="absolute inset-0 z-10 bg-gradient-to-r from-card from-2% via-transparent via-10% to-card to-98% pointer-events-none" />
                            <div className="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-card to-transparent pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                            <motion.div
                                initial={{ y: 0 }}
                                animate={{ y: '-50%' }}
                                transition={{
                                    duration: 20,
                                    repeat: Infinity,
                                    ease: 'linear',
                                    repeatType: 'loop',
                                }}
                                className="w-full rotate-[10deg] scale-125"
                            >
                                <div className="flex flex-col gap-0">
                                    <Image
                                        src="/schema-sample_v1.png"
                                        width={600}
                                        height={800}
                                        alt="Muestra de esquemas"
                                        className="w-full rotate-[15deg] h-auto object-cover opacity-80"
                                    />
                                    <Image
                                        src="/schema-sample_v1.png"
                                        width={600}
                                        height={800}
                                        alt="Muestra de esquemas"
                                        className="w-full rotate-[15deg] h-auto object-cover opacity-80"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Tres cards inferiores */}
                <div className="grid lg:grid-cols-3 gap-4">
                    <div className="group relative rounded-2xl">
                        <ShineBorder
                            shineColor={SHINE_COLORS}
                            duration={10}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                        <div className="rounded-2xl border bg-card p-8 flex flex-col gap-4">
                            <Image
                                src={checkout}
                                alt="En qué ayudan"
                                className="w-20 h-20 object-contain"
                            />
                            <h3 className="text-xl font-bold">¿En qué me pueden ayudar?</h3>
                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                                <li>
                                    Condensan la información centrándose en lo más importante (y
                                    preguntable).
                                </li>
                                <li>
                                    Interrelacionan conceptos, permitiendo un aprendizaje holístico.
                                </li>
                                <li>Reorganizan la información para facilitar la memorización.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative rounded-2xl">
                        <ShineBorder
                            shineColor={SHINE_COLORS}
                            duration={10}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                        <div className="rounded-2xl border bg-card p-8 flex flex-col gap-4">
                            <Image
                                src={messages}
                                alt="Características del contenido"
                                className="w-20 h-20 object-contain"
                            />
                            <h3 className="text-xl font-bold">Características del contenido</h3>
                            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2">
                                <li>
                                    Marco jurídico completo, señalando en todo momento la fuente de
                                    información.
                                </li>
                                <li>
                                    Respeto de la literalidad de la normativa lo máximo posible.
                                </li>
                                <li>Organizado en cuadros sinópticos.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="group relative rounded-2xl">
                        <ShineBorder
                            shineColor={SHINE_COLORS}
                            duration={10}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                        <div className="rounded-2xl border bg-card p-8 flex flex-col gap-4">
                            <Image
                                src={collaboration}
                                alt="Formato"
                                className="w-20 h-20 object-contain"
                            />
                            <h3 className="text-xl font-bold">Formato</h3>
                            <p className="text-sm text-muted-foreground">
                                Impresos a doble cara, a color y encuadernados, letra Calibri tamaño
                                7. Pack completo o bloques individuales. No se altera el formato ni
                                se venden temas sueltos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
