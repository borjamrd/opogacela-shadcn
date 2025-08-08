"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Course } from "@/lib/types";
import { CheckCircle, Loader2 } from "lucide-react";
import { simulatePurchase } from "../actions";

interface CoursesClientPageProps {
  courses: Course[];
  purchasedCourseIds: number[];
  isLoggedIn: boolean;
}

export default function CoursesClientPage({
  courses,
  purchasedCourseIds: initialPurchasedIds,
  isLoggedIn,
}: CoursesClientPageProps) {
  const router = useRouter();
  const [purchasedCourseIds, setPurchasedCourseIds] =
    useState(initialPurchasedIds);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();

  const handlePurchaseClick = (course: Course) => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      setSelectedCourse(course);
    }
  };

  const handleConfirmPurchase = () => {
    if (!selectedCourse) return;

    startTransition(async () => {
      const result = await simulatePurchase(selectedCourse.id);
      if (result.success) {
        // Actualizamos el estado local para reflejar la compra al instante
        setPurchasedCourseIds([...purchasedCourseIds, selectedCourse.id]);
        setSelectedCourse(null);
      } else {
        alert(result.error);
        setSelectedCourse(null);
      }
    });
  };

  return (
    <>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Cursos en Vídeo</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Potencia tu preparación con nuestras videolecciones especializadas.
          </p>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const hasAccess = purchasedCourseIds.includes(course.id);

              return (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    {hasAccess && (
                      <Badge variant="secondary" className="w-fit mb-2">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Adquirido
                      </Badge>
                    )}
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription className="flex-grow">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    {hasAccess ? (
                      <Button asChild className="w-full">
                        <Link href={`/courses/${course.id}`}>
                          Empezar a estudiar
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => handlePurchaseClick(course)}
                      >
                        Adquirir Curso
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center">
            <p>Actualmente no hay cursos disponibles. ¡Vuelve pronto!</p>
          </div>
        )}
      </div>

      {/* Diálogo de Simulación de Compra */}
      <AlertDialog
        open={!!selectedCourse}
        onOpenChange={() => setSelectedCourse(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Simulación de Compra</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de adquirir el curso &quot;{selectedCourse?.title}
              &quot;. En un futuro, este proceso te llevaría a la pasarela de
              pago de Stripe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPurchase}
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Compra
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
