"use client";

import { Button } from "./ui/button";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { motion } from "framer-motion";

export const Cta = () => {
  return (
    <section id="cta" className="bg-primary/20 py-16 my-24 sm:my-32">
      <div className="container place-items-center">
        <Card className="bg-white rounded-3xl border-none shadow-2xl overflow-hidden relative">
          <CardContent className="p-0 grid lg:grid-cols-2 gap-8 items-center">
            {/* Image Section with Animation */}
            <div className="relative h-[400px] overflow-hidden group">
              {/* Gradient Mask */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-white from-2% via-transparent via-10%  to-white to-98% pointer-events-none" />

              <motion.div
                initial={{ y: 0 }}
                animate={{ y: "-50%" }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
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
                    alt="Muestra de esquemas duplicate"
                    className="w-full rotate-[15deg] h-auto object-cover opacity-80"
                  />
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="space-y-8 p-8 lg:p-12 text-white">
              <h2 className="text-3xl md:text-6xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  Mejora tu estudio
                </span>
              </h2>
              <p className="text-primary/80 text-xl mt-4 mb-8 lg:mb-0">
                No inventes la rueda de nuevo, aprovecha los recursos que ya
                existen para agilizar tu estudio.
              </p>
              <Button
                asChild
                className="w-full md:w-auto font-bold text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <a href="#esquemas">Comprar esquemas</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
