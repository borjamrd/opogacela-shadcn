import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "CB",
    userName: "@john_Doe",
    comment:
      "Los apuntes son muy completos y ajustados a contenido del examen. Están muy bien interrelacionados de tal forma que permiten una buena comprensión de la normativa que a veces se encuentra dispersa; además de presentar una estética muy visual; algo que siempre ameniza mucho el estudio. ¡Totalmente actualizados! 100% los recomiendo",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "PG",
    userName: "@john_Doe1",
    comment: `Gracias a los esquemas, he conseguido afianzar mis conocimientos teóricos, y por fin entender conceptos que se me "atragantaban". Son unos esquemas muy didácticos, y muy bien elaborados. Interpretan muy bien la teoría y gracias a sus maravillosas mnemotécnicas me han hecho mas llevadero el estudio, y se me han quedado bien grabadas!! Gracias por este maravilloso trabajo!!`,
  },

  {
    image: "https://github.com/shadcn.png",
    name: "Blanca Espejo",
    userName: "@john_Doe2",
    comment:
      "Adquirí los esquemas de Opogacela y desde entonces se han convertido en un material imprescindible para completar mi método de estudio, ideales para hacer repasos más rápido y avanzar en el estudio. Además incluyen mnemotecnias, ejemplos, etc. Son súper completos, actualizados y hechos con mucha dedicación. Encantada con mis esquemas y con el trato recibido por Opogacela. Recomiendo 100%",
  },
//   {
//     image: "https://github.com/shadcn.png",
//     name: "John Doe React",
//     userName: "@john_Doe3",
//     comment:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
//   },
//   {
//     image: "https://github.com/shadcn.png",
//     name: "John Doe React",
//     userName: "@john_Doe4",
//     comment:
//       "Lorem ipsum dolor sit amet, tempor incididunt  aliqua. Ut enim ad minim veniam, quis nostrud.",
//   },
//   {
//     image: "https://github.com/shadcn.png",
//     name: "John Doe React",
//     userName: "@john_Doe5",
//     comment:
//       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
//   },
];

export const Testimonials = () => {
  return (
    <section id="opiniones" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        Descubre por qué
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          la gente{" "}
        </span>
        me recomienda
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        No te lo digo yo, te lo dicen ell@s. Tras muchas horas de estudio he
        podido sintetizar la información más importante de la oposición.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2  lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  {/* <CardDescription>{userName}</CardDescription> */}
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
