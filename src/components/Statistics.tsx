"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const Statistics = () => {
  interface statsProps {
    quantity: string;
    description: string;
  }

  const ref = useRef(null);
  const inView = useInView(ref, {
    amount: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const stats: statsProps[] = [
    {
      quantity: "Administrativo del Estado (C1)",
      description: "Aprobado OEP 21/22",
    },
    {
      quantity: "Gestión Civil del Estado (A2)",
      description: "Aprobado (Top 40) OEP 20/21/22 ",
    },
    {
      quantity: "Cuerpo Superior de Administradores (A1)",
      description: "En curso",
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      id="statistics"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stats.map((stat: statsProps, i: number) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="space-y-2 text-center"
          >
            <h2 className="text-2xl sm:text-2xl font-bold ">{stat.quantity}</h2>
            <p className="text-xl text-muted-foreground">{stat.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
