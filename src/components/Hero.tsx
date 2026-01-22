'use client';

import { NotebookPen } from 'lucide-react';
import { HeroCards } from './HeroCards';
import { buttonVariants } from './ui/button';
import { motion } from 'framer-motion';
export const Hero = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10"
        >
            <div className="text-center lg:text-start space-y-6">
                <main className="text-5xl md:text-6xl font-bold">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline"
                    >
                        Hola <span className="wave ">👋</span>{' '}
                        <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
                            opositores
                        </span>{' '}
                        bienvenidos a{' '}
                        <span className="inline bg-gradient-to-r from-[#b985ab]  to-[#ab6498] text-transparent bg-clip-text">
                            Opogacela
                        </span>{' '}
                    </motion.h1>{' '}
                </main>

                <div className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
                    Aquí podréis encontrar varios recursos para la oposición de Gestión Civil del
                    Estado (A2) y Administrativo del Estado (C1).
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4 md:space-y-0 md:space-x-4"
                >
                    <a className={buttonVariants()} href="#esquemas">
                        {' '}
                        <NotebookPen className="h-5 w-5 mr-2" />
                        Consigue tus esquemas
                    </a>
                </motion.div>
            </div>

            {/* Hero cards sections */}
            <div className="z-10">
                <HeroCards />
            </div>

            {/* Shadow effect */}
            <div className="shadow"></div>
        </motion.section>
    );
};
