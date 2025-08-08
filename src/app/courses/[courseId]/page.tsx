import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, Clock, PlayCircle } from "lucide-react";

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
    <div className="container max-w-5xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold tracking-tight">{course.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {course.description}
          </p>

          {/* Trailer del curso */}
          {course.trailer_playback_id && (
            <div className="mt-8 aspect-video">
              <MuxPlayer playbackId={course.trailer_playback_id} />
            </div>
          )}

          {/* Contenido del curso */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold">Contenido del curso</h2>
            <Accordion type="single" collapsible className="w-full mt-4">
              {course.sections.map((section) => (
                <AccordionItem value={`section-${section.id}`} key={section.id}>
                  <AccordionTrigger className="font-semibold">
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

        {/* Columna lateral */}
        <aside className="md:col-span-1">
          <div className="sticky top-24 p-6 border rounded-lg">
            <h3 className="text-lg font-semibold">Acerca de este curso</h3>
            <div className="mt-4 space-y-3">
              <p className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />{" "}
                {course.sections.reduce((acc: any, s: { lessons: string | any[]; }) => acc + s.lessons.length, 0)}{" "}
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
          </div>
        </aside>
      </div>
    </div>
  );
}
