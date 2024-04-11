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
  type: 'gace' | 'admin'
  description: string;
  file: any,
}

const features: FeatureProps[] = [
  {
    title: "Administrativo AGE TL - Bloque I",
    type: 'admin',
    description:
      "Contiene los 11 temas del bloque de Organización del Estado y la Administración Pública",
    file: 'admin_bloque_1.pdf'

  },
  {
    title: "Administrativo AGE TL - Bloque III",
    type: 'admin',
    description:
      "Contiene los 7 temas del bloque de Derecho Administrativo General",
    file: 'admin_bloque_3.pdf'
  },
  {
    title: "Administrativo AGE TL - Bloque IV",
    type: 'admin',
    description:
      "Contiene los 9 temas del bloque de Gestión del Personal",
    file: 'admin_bloque_4.pdf'
  },
  {
    title: "Administrativo AGE TL - Bloque V",
    type: 'admin',
    description:
      "Contiene los 6 temas del bloque de Gestión Financiera",
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque I",
    type: 'gace',
    description:
      "Contiene los 11 temas de Organización del Estado y de la Administración Pública",
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque II",
    type: 'gace',
    description:
      "Contiene los 6 temas de la Unión Europea",
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque III",
    type: 'gace',
    description:
      "Contiene los 10 temas de políticas públicas",
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque V",
    type: 'gace',
    description:
      "Contiene los 9 temas de Administración de Recursos Humanos",
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque VI",
    type: 'gace',
    description:
      "Contiene los 8 temas del bloque de Gestión Financiera y Seguridad Social",
    file: 'admin_bloque_5.pdf'
  },
];


export const Examples = () => {



  return (
    <section
      id="examples"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Aqui tienes {" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          ejemplos {" "}
        </span> de cada bloque
      </h2>


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, file, type }: FeatureProps) => (

          <Card className="relative pt-10 group" key={title}>
            <CardHeader >
              <CardTitle>{title}</CardTitle>

            </CardHeader>

            <TypeBadge type={type} />


            <CardContent >{description}
            </CardContent>
            <CardFooter >
              <DownloadButton file={file} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};