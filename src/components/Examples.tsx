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
  file: any,
}

const features: FeatureProps[] = [
  {
    title: "Administrativo AGE TL - Bloque I",
    type: 'admin',
    file: 'admin_bloque_1.pdf'

  },
  {
    title: "Administrativo AGE TL - Bloque III",
    type: 'admin',
    file: 'admin_bloque_3.pdf'
  },
  {
    title: "Administrativo AGE TL - Bloque IV",
    type: 'admin',
    file: 'admin_bloque_4.pdf'
  },
  {
    title: "Administrativo AGE TL - Bloque V",
    type: 'admin',
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque I",
    type: 'gace',
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque II",
    type: 'gace',
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque III",
    type: 'gace',
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque V",
    type: 'gace',
    file: 'admin_bloque_5.pdf'
  },
  {
    title: "GACE TL - Bloque VI",
    type: 'gace',
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
        {features.map(({ title, file, type }: FeatureProps) => (

          <Card className="relative pt-10 group" key={title}>
            <CardHeader >
              <CardTitle>{title}</CardTitle>

            </CardHeader>

            <TypeBadge type={type} />



            <CardFooter >
              <DownloadButton file={file} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};