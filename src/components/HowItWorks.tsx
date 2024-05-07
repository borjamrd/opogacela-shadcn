import InfoCarousel from "./InfoCarousel";



export const HowItWorks = () => {
  return (
    <section
      id="howitworks"
      className="container"
    >
      <h2 className="text-3xl md:text-4xl font-bold ">
        Características de los{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          esquemas{" "}
        </span>

      </h2>
      <p className="md:w-3/4 mt-4 mb-8 text-xl text-muted-foreground">
        Los esquemas de Opogacela son una ayuda al estudio del temario de la oposición. Es decir, NO sustituyen las leyes ni los manuales de estudio, ya que por sí solos no explican el temario.
      </p>
      <InfoCarousel />

    </section>
  );
};