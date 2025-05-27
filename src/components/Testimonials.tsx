'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdContactPage } from "react-icons/md";
export interface Testimonial {
  id: number;
  name: string;
  surname: string;
  position: string;
  description: string;
  linkedin: string;
  instagram: string;
  website: string;
}


export const Testimonials = () => {

  useEffect(() => {
    getData();
  }, [])


  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const getData = async () => {
    const { data: testimonials, error } = await supabase.from('testimonials').select('*').eq('reviewed', true);
    if (error) console.error('Error fetching data:', error);
    else setTestimonials(testimonials)
  };

  return (
    <section id="opiniones" className="container py-24 sm:py-32 lg:px-10">
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

      <div className="sm:block lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        <Carousel
          opts={{
            align: "start",

          }}
          plugins={[
            Autoplay({
              delay: 30000,
            }),
          ]}
          className="lg:max-w-full max-w-full"
        >
          <CarouselContent>

            {testimonials.map(
              ({ id, name, surname, position, description, website, linkedin, instagram }: Testimonial) => (
                <CarouselItem key={id} className="lg:basis-1/4">
                  <Card
                    key={name}
                    className="max-w-md md:break-inside-avoid overflow-hidden"
                  >
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="flex flex-col">
                        <CardTitle className="text-lg">{name} {surname}</CardTitle>
                        <CardDescription>{position}</CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-2">{description}
                      {(website || linkedin || instagram) && <div className="flex border-t border-t-slate-200 pt-2">
                        {linkedin && <a title="Enlace a Linkedin" target="_blank" href={linkedin}><FaLinkedin className="h-6 w-6" /></a>}
                        {instagram && <a title="Enlace a Instagram" target="_blank" href={instagram}><FaInstagram className="h-6 w-6" /></a>}
                        {website && <a title="Enlace a web personal" target="_blank" href={website}><MdContactPage className="h-6 w-6" /></a>}
                      </div>}
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
