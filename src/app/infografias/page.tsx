import InfografiasContent from "@/components/InfografiasContent";

export default function Infografias() {
  return (
    <div className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Infografías
      </h2>
      {/* <h3 className="text-xl text-center text-muted-foreground py-4">
        Infografías de los temas más importantes de la oposición.
      </h3> */}
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-6">
        Estamos trabajando para ofrecerte una colección de infografías que
        resuman los temas más relevantes de la oposición. Estas infografías te
        ayudarán a comprender mejor los conceptos clave y a prepararte de manera
        más efectiva. ¡Pronto estarán disponibles!
      </p>

      <InfografiasContent />
    </div>
  );
}
