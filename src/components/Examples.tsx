import BuscadorTemas from "./BuscadorTemas";

export interface FeatureProps {
  id: number;
  title: string;
  type: "gace" | "admin";
  file: any;
  price_id: string;
}

const features: FeatureProps[] = [
  {
    id: 1,
    title: "Bloque I: Organización del Estado y la Administración Pública",
    type: "gace",
    file: "gace_1.pdf",
    price_id: "price_1PDZMdFdo9Q1U43InJgkQ8wE",
  },
  {
    id: 2,
    title: "Bloque II: Unión Europea",
    type: "gace",
    file: "gace_2.pdf",
    price_id: "price_1PDZMkFdo9Q1U43I3IBak8B1",
  },
  {
    id: 3,
    title: "Bloque III: Políticas Públicas",
    type: "gace",
    file: "gace_3.pdf",
    price_id: "price_1PDZMmFdo9Q1U43I2KQ7VXiQ",
  },
  {
    id: 4,
    title: "Bloque IV: Derecho Administrativo",
    type: "gace",
    file: "gace_4.pdf",
    price_id: "price_1PDZMoFdo9Q1U43IAAmpf71c",
  },
  {
    id: 5,
    title: "Bloque V: Recursos Humanos",
    type: "gace",
    file: "gace_5.pdf",
    price_id: "price_1PDZMtFdo9Q1U43Is4JhzxGs",
  },
  {
    id: 6,
    title: "Bloque VI: Gestión Financiera",
    type: "gace",
    file: "gace_6.pdf",
    price_id: "price_1PDZLdFdo9Q1U43IiXhc30kM",
  },
  {
    id: 7,
    title: "Bloque I: Organización del Estado y la Administración Pública",
    type: "admin",
    file: "admin_bloque_1.pdf",
    price_id: "price_1PDZLZFdo9Q1U43IrPh5gzXH",
  },
  {
    id: 8,
    title: "Bloque III: Derecho Administrativo General",
    type: "admin",
    file: "admin_bloque_3.pdf",
    price_id: "price_1PDZLNFdo9Q1U43IejjXcxll",
  },
  {
    id: 9,
    title: "Bloque IV: Gestión del Personal",
    type: "admin",
    file: "admin_bloque_4.pdf",
    price_id: "price_1PDZLSFdo9Q1U43IdCNlax4w",
  },
  {
    id: 10,
    title: "Bloque V: Gestión Financiera",
    type: "admin",
    file: "admin_bloque_5.pdf",
    price_id: "price_1PDZLQFdo9Q1U43IZFvBP38V",
  },
];

export const Examples = () => {
  return (
    <section id="examples" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Aquí tienes{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          ejemplos{" "}
        </span>{" "}
        de cada bloque
      </h2>
      <BuscadorTemas features={features} />
    </section>
  );
};
