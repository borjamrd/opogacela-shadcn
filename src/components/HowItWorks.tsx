import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import checkout from '../../public/svg/checkout.svg'
import messages from '../../public/svg/messages.svg'
import studying from '../../public/svg/studying.svg'
import collaboration from '../../public/svg/collaboration.svg'
import law from "../../public/svg/law.svg";
interface FeatureProps {
  image: any;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    image: checkout,
    title: "¿En qué me pueden ayudar?",
    description:
      "1.Condensan la inforación centrándose en lo más importante (y preguntable). 2. Interrelacionan conceptos, permitiendo un aprendizaje holístico. Reorganizan la información para facilizar la memorización",
  },
  {
    image: messages,
    title: "Características del contenido",
    description:
      "1. Marco jurídico completo, señalando en todo momento la fuente de información. 2. Respeto de la literalidad de la normativa lo máximo posible. 3. Organizado en cuadros sinópticos.",
  },
  {
    image: studying,
    title: "Cómo aprovecharlos al máximo",
    description:
      "Una vez hayas estudiado un tema, acude a los esquemas y observa qué información es la que se destaca en ellos y cuál es la forma más adecuada para enfocar el estudio. A veces, los epígrafes de un tema no siguen el orden más intuitivo de estudio, algo que los esquemas intentan paliar. Por supuesto, haz tus anotaciones, añade información y realiza todos los cambios que desees para hacer “tuyos” los esquemas. Cada cerebro funciona de una manera, y es imposible que un solo método valga para todo el mundo. Por supuesto, si encuentras una errata o tienes sugerencias de mejora, házmelo saber por email.",
  },
  {
    image: collaboration,
    title: "Formato",
    description:
      "Los esquemas se entregan impresos a doble cara, a color y encuadernados, letra Calibri tamaño 7. Se puede adquierir un pack completo del temario o bloques individuales. También hay esquemas independientes de leyes concretas. No se altera el formato ni se venden temas sueltos. Puedes descargar un ejemplo aquí",
  },

];

export const HowItWorks = () => {
  return (
    <section
      id="howitworks"
      className="container grid lg:grid-cols-[1fr,1fr] gap-8 place-items-center"
    >
      <Image
        src={law}
        className="w-[300px] md:w-[500px] lg:w-[600px] object-contain"
        alt="About services"
      />
      <div>
        <h2 className="text-3xl md:text-4xl font-bold ">
          Características de los{" "}
          <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
            esquemas{" "}
          </span>

        </h2>
        <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
          Los esquemas de Opogacela son una ayuda al estudio del temario de la oposición. Es decir, NO sustituyen las leyes ni los manuales de estudio, ya que por si solos no explican el temario.
        </p>


        <div className="flex flex-col gap-8">
          {features.map(({ image, title, description }: FeatureProps) => (
            <Card
              key={title}
              className="bg-muted/50 flex gap-4"
            >
              {/* <Image
                src={image}
                alt=""
                className="w-[100px] object-contain rounded-lg ms-3"
              /> */}
              <div className="w-4/5 flex flex-col gap-2">
                <CardHeader className="pb-2">
                  <CardTitle>
                    {title}

                  </CardTitle>
                </CardHeader>

                <CardContent>{description}</CardContent>
              </div>

            </Card>
          ))}
        </div>
      </div>

    </section>
  );
};