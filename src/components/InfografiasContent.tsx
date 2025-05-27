"use client";

import { Infografia, useGetInfografias } from "@/hooks/useGetInfografias";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import HtmlPreview from "./HtmlPreview";

export default function InfografiasContent() {
  const { infografias, isLoading, error } = useGetInfografias();

  const [open, setOpen] = useState(false);
  const [infografia, setInfografia] = useState<null | Infografia>(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleOpen = (infografia: Infografia) => {
    setOpen(true);
    setInfografia(infografia);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {infografias.map((infografia) => (
        <Card key={infografia.id}>
          <CardHeader>
            <CardTitle>{infografia.title}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" onClick={() => handleOpen(infografia)}>
              Ver Infografía
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
          {infografia && (
            <HtmlPreview htmlContent={infografia.contenido_html} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
