import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import MuxPlayer from "@mux/mux-player-react";
import {
  BookOpen,
  Clock,
  Info,
  PlayCircle,
  Star,
  User
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CourseLandingPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      sections (
        *,
        lessons (*)
      )
    `
    )
    .eq("id", params.courseId)
    .single();

  if (error || !course) {
    return redirect("/courses?error=not-found");
  }

  const { data: purchase } = user
    ? await supabase
        .from("user_courses")
        .select("course_id")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .single()
    : { data: null };

  const hasAccess = !!purchase;

  return (
    <div className="container max-w-7xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>

          {/* Trailer del curso */}
          {course.trailer_playback_id && (
            <div className="mt-8 aspect-video rounded-3xl overflow-hidden bg-black">
              <MuxPlayer playbackId={course.trailer_playback_id} />
            </div>
          )}
          <Tabs defaultValue="info" className="w-full mt-5">
            <TabsList className="w-full">
              <TabsTrigger value="info" className="flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Información
              </TabsTrigger>
              <TabsTrigger value="instructor" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Instructor
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Valoraciones
              </TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Sobre el curso</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {course.description ||
                      "No hay descripción para este curso."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="mt-4">
              <Card>
                <CardContent className="p-6 flex gap-4 items-start">
                  <Avatar>
                    <AvatarImage
                      src="https://ui-avatars.com/api/?name=Pilar+Soldado+Rodriguez&background=0D8ABC&color=fff"
                      alt="Pilar Soldado Rodriguez"
                    />
                  </Avatar>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Pilar Soldado Rodriguez
                    </h3>
                    <p className="mb-2 text-muted-foreground">
                      Licenciada en ADE por la Universidad de Navarra.
                      Experiencia de 6 años en empresa privada (investigación y
                      FMCG). Actualmente trabaja en la Agencia Espacial Española
                      tras aprobar oposiciones de Administrativo del Estado (C1,
                      OEP 21/22) y Gestión Civil del Estado (A2, Top 40, OEP
                      20/21/22).
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Valoraciones del curso
                  </h3>
                  {/* Aquí puedes añadir las valoraciones */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Columna lateral */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Acerca de este curso</h3>
            <div className="mt-4 space-y-3">
              <p className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />{" "}
                {course.sections.reduce(
                  (acc: any, s: { lessons: string | any[] }) =>
                    acc + s.lessons.length,
                  0
                )}{" "}
                lecciones
              </p>
              <p className="flex items-center">
                <Clock className="h-5 w-5 mr-2" /> {course.total_hours || "N/A"}{" "}
                horas de vídeo
              </p>
            </div>
            <div className="mt-6">
              {hasAccess ? (
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.id}/learn`}>
                    Continuar estudiando
                  </Link>
                </Button>
              ) : (
                <Button className="w-full" disabled>
                  Adquirir ahora (Próximamente)
                </Button>
              )}
            </div>
            {/* Contenido del curso */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold">Contenido del curso</h2>
              <Accordion type="single" collapsible className="w-full mt-4">
                {course.sections.map((section) => (
                  <AccordionItem
                    value={`section-${section.id}`}
                    key={section.id}
                  >
                    <AccordionTrigger className="text-left gap-4">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pl-4">
                        {section.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="flex items-center text-muted-foreground"
                          >
                            <PlayCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            {lesson.title}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
