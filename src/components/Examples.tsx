import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from "lucide-react";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import DownloadButton from "./DownloadButton";

interface FeatureProps {
  title: string;
  description: string;
  file: any,
}

const features: FeatureProps[] = [
  {
    title: "Administrativo AGE TL - Bloque I",
    description:
      "Contiene los 11 temas del bloque de Organización del Estado y la Administración Pública",
    file: 'admin_bloque_1.pdf'

  },
  {
    title: "Administrativo AGE TL - Bloque III",
    description:
      "Contiene los 7 temas del bloque de Derecho Administrativo General",
    file: 'admin_bloque_3.pdf'
  },
  {
    title: "Administrativo AGE TL - Bloque IV",
    description:
      "Contiene los 9 temas del bloque de Gestión del Personal",
    file: 'admin_bloque_4.pdf'
  },
  {
    title: "Administrativo AGE TL - Bloque V",
    description:
      "Contiene los 6 temas del bloque de Gestión Financiera",
    file: 'admin_bloque_5.pdf'
  },
];

const featureList: string[] = [
  "Dark/Light theme",
  "Reviews",
  "Features",
  "Pricing",
  "Contact form",
  "Our team",
  "Responsive design",
  "Newsletter",
  "Minimalist",
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
          algunos ejemplos
        </span>
      </h2>

      {/* <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div> */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, file }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}
            </CardContent>
            <CardFooter>
              <DownloadButton file={file} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};