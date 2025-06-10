"use client";

import { useGetInfografias } from "@/hooks/useGetInfografias";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";

export default function InfografiasContent() {
  const { infografias, isLoading, error } = useGetInfografias();
  const router = useRouter();

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleOpen = (id: string) => {
    router.push(`/infografia/${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {infografias.map((infografia) => (
        <Card key={infografia.id}>
          <CardHeader>
            <CardTitle>{infografia.title}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" onClick={() => handleOpen(infografia.id.toString())}>
              Ver Infografía
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
