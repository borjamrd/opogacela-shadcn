import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DownloadButton from "./DownloadButton";
import TypeBadge from "./TypeBadge";

interface FeatureProps {
  title: string;
  type: "gace" | "admin";
  file: any;
}

const features: FeatureProps[] = [
  {
    title: "Bloque I: Organización del Estado y la Administración Pública",
    type: "admin",
    file: "admin_bloque_1.pdf",
  },
  {
    title: "Bloque III: Derecho Administrativo General",
    type: "admin",
    file: "admin_bloque_3.pdf",
  },
  {
    title: "Bloque IV: Gestión del Personal",
    type: "admin",
    file: "admin_bloque_4.pdf",
  },
  {
    title: "Bloque V: Gestión Financiera",
    type: "admin",
    file: "admin_bloque_5.pdf",
  },
  {
    title: "Bloque I: Organización del Estado y la Administración Pública",
    type: "gace",
    file: "gace_1.pdf",
  },
  {
    title: "Bloque II: Unión Europea",
    type: "gace",
    file: "gace_2.pdf",
  },
  {
    title: "Bloque III: Políticas Públicas",
    type: "gace",
    file: "gace_3.pdf",
  },
  {
    title: "Bloque IV: Derecho Administrativo",
    type: "gace",
    file: "gace_4.pdf",
  },
  {
    title: "Bloque V: Recursos Humanos",
    type: "gace",
    file: "gace_5.pdf",
  },
  {
    title: "Bloque VI: Gestión Financiera",
    type: "gace",
    file: "gace_6.pdf",
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, file, type }: FeatureProps) => (
          <Card className="relative pt-10 group" key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <TypeBadge type={type} />

            <CardFooter>
              <DownloadButton file={file} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
