import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import checkout from '../../public/svg/checkout.svg'
import messages from '../../public/svg/messages.svg'
import studying from '../../public/svg/studying.svg'
import collaboration from '../../public/svg/collaboration.svg'

interface FeatureProps {
  image: any;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    image: checkout,
    title: "Realiza la compra",
    description:
      "Más abajo tienes todos los apuntes disponbibles, realiza tu compra con calma.",
  },
  {
    image: messages,
    title: "Revisa tu correo",
    description:
      "Una vez finalizada la compra te llegará un correo con los detalles de la transacción.",
  },
  {
    image: studying,
    title: "Espera el pedido",
    description:
      "En 24/48 horas te llegará el pedido, mientras puedes estudiar con nuestro grupo de Telegram",
  },
  {
    image: collaboration,
    title: "Comparte tu opinión",
    description:
      "¿Te gustan los apuntes? Comparte tu opinión para poder ayudar a otra persona",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="howItWorks"
      className="container text-center py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        ¿Cómo funciona la entrega de{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          esquemas y apuntes{" "}
        </span>
        ?
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
        dolor pariatur sit!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ image, title, description }: FeatureProps) => (
          <Card
            key={title}
            className="bg-muted/50"
          >
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                <Image
                  src={image}
                  alt=""
                  className="w-[100px] object-contain rounded-lg"
                />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};