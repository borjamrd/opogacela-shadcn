export const Statistics = () => {
    interface statsProps {
      quantity: string;
      description: string;
    }
  
    const stats: statsProps[] = [
      {
        quantity: "1.8K+",
        description: "Comunidad",
      },
      {
        quantity: "C1",
        description: "Aprobado",
      },
      {
        quantity: "GACE",
        description: "Aprobado",
      },
      {
        quantity: "CSACE",
        description: "En curso",
      },
    ];
  
    return (
      <section id="statistics">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat:statsProps, i:number ) => (
            <div
              key={i}
              className="space-y-2 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold ">{stat.quantity}</h2>
              <p className="text-xl text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };