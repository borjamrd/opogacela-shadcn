import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { CalendarCheck } from "lucide-react";
import { buttonVariants } from "./ui/button";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            ¿Atascad@ con el
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              temario?{" "}
            </span>

          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            No te preocupes. Respira, tomate la tila, corre tus 5k o haz tu rato de meditación y contacta conmigo para que te eche una mano. 😄
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
        <a className={buttonVariants()} href="https://cal.com/opogacela" target="_blank"
          > <CalendarCheck className="h-5 w-5 mr-2" />Agenda una reunión GRATIS</a>
          <a
            href="https://github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`${buttonVariants({ variant: "secondary" })}`}
          >


            <DiscordLogoIcon
              className="mr-2 w-5 h-5" />
            Únete a nuestro canal

          </a>


        </div>
      </div>
    </section>
  );
};