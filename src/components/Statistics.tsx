export const Statistics = () => {
  interface statsProps {
    quantity: string;
    description: string;
  }

  const stats: statsProps[] = [
    {
      quantity: "Administrativo del Estado (C1)",
      description: "Aprobado OEP 21/22",
    },
    {
      quantity: "Gestión Civil del Estado (A2)",
      description: "Aprobado (Top 40) OEP 20/21/22 ",
    },
    {
      quantity: "Cuerpo Superior de Administradores (A1)",
      description: "En curso",
    },
  ];

  return (
    <section id="statistics">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {stats.map((stat: statsProps, i: number) => (
          <div
            key={i}
            className="space-y-2 text-center"
          >
            <h2 className="text-2xl sm:text-2xl font-bold ">{stat.quantity}</h2>
            <p  className="text-xl text-muted-foreground">{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};