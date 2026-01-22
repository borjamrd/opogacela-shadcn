'use client';

import { Statistics } from './Statistics';
import pilot from '../../public/svg/study.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const About = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            id="sobremi"
            className="container py-24 sm:py-32"
        >
            <div className="bg-muted/50 border rounded-lg py-12">
                <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
                    <Image src={pilot} alt="" className="w-[300px] object-contain rounded-lg" />
                    <div className="bg-green-0 flex flex-col justify-between">
                        <div className="pb-6">
                            <h2 className="text-3xl md:text-4xl font-bold">
                                Sobre{' '}
                                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                                    Opogacela
                                </span>
                            </h2>
                            <p className="text-xl text-muted-foreground mt-4">
                                Estudié Administración y Dirección de Empresas en la Universidad de
                                Navarra (UNAV) y al terminar estuve trabajando en empresa privada
                                durante 6 años, tanto en investigación como en FMCG. Decidí dar el
                                salto a la función pública para contribuir a la{' '}
                                <strong>mejora de los servicios públicos de nuestro país.</strong>{' '}
                                Tras año y medio de estudio, estos son los datos:
                            </p>
                        </div>

                        <Statistics />
                    </div>
                </div>
            </div>
        </motion.section>
    );
};
