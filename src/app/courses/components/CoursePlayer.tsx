// src/app/courses/components/CoursePlayer.tsx

"use client";

import { useMemo, useState, useTransition } from "react";
import { type Course, type Lesson, type Section } from "@/lib/types";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Lock, PlayCircle } from "lucide-react";
import { markLessonAsComplete } from "../actions";

// Tipos actualizados para recibir el progreso y la info del instructor
type Instructor = {
  name?: string | null;
  title?: string | null;
  avatar?: string | null;
} | null;
type LessonWithCompletion = Lesson & { completed: boolean };
type SectionWithLessons = Section & { lessons: LessonWithCompletion[] };
type CourseWithSections = Course & {
  sections: SectionWithLessons[];
  instructor?: Instructor;
};

export default function CoursePlayer({ course }: { course: CourseWithSections }) {
  const allLessons = useMemo(
    () => course.sections.flatMap((section) => section.lessons),
    [course.sections]
  );

  const [selectedLesson, setSelectedLesson] = useState<LessonWithCompletion>(
    allLessons[0]
  );
  const [isPending, startTransition] = useTransition();

  const completedLessonsCount = useMemo(
    () => allLessons.filter((lesson) => lesson.completed).length,
    [allLessons]
  );

  const progressPercentage =
    allLessons.length > 0
      ? Math.round((completedLessonsCount / allLessons.length) * 100)
      : 0;

  const handleMarkAsComplete = () => {
    startTransition(async () => {
      await markLessonAsComplete(selectedLesson.id, course.id);
    });
  };

  return (
    <div className="grid md:grid-cols-[350px_1fr] min-h-screen">
      {/* --- Sidebar de Navegación --- */}
      <aside className="h-screen sticky top-0 border-r bg-muted/20 hidden md:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-lg truncate">{course.title}</h2>
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">
                {progressPercentage}% completado
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {course.sections.map((section) => (
              <Accordion
                key={section.id}
                type="single"
                collapsible
                defaultValue={
                  section.lessons.some((l) => l.id === selectedLesson?.id)
                    ? `section-${section.id}`
                    : undefined
                }
              >
                <AccordionItem value={`section-${section.id}`} className="border-b-0 mb-2">
                  <AccordionTrigger className="hover:no-underline font-medium px-2 py-3 rounded-md hover:bg-muted">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pl-4 mt-1">
                    <ul className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <button
                            onClick={() => setSelectedLesson(lesson)}
                            className={cn(
                              "w-full text-left p-3 rounded-md transition-colors flex items-center text-sm gap-3",
                              selectedLesson?.id === lesson.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted text-muted-foreground"
                            )}
                          >
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            ) : (
                              <PlayCircle className="h-5 w-5 flex-shrink-0" />
                            )}
                            <span className="flex-1">{lesson.title}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </aside>

      {/* --- Contenido Principal (Vídeo y Detalles) --- */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-8 lg:p-12">
          {selectedLesson ? (
            <>
              <div className="w-full aspect-video mb-4 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {selectedLesson.mux_playback_id ? (
                  <MuxPlayer
                    playbackId={selectedLesson.mux_playback_id}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center text-muted-foreground">
                    <div>
                      <Lock className="mx-auto h-12 w-12" />
                      <p className="mt-2">Vídeo no disponible.</p>
                    </div>
                  </div>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                {selectedLesson.title}
              </h1>
              {!selectedLesson.completed && (
                <Button onClick={handleMarkAsComplete} disabled={isPending} size="lg">
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="mr-2 h-4 w-4" />
                  )}
                  Marcar como completada
                </Button>
              )}

              {/* Información Adicional del Curso */}
              <div className="mt-12 border-t pt-8">
                <h2 className="text-xl font-semibold mb-6">Sobre este curso</h2>

                {course.instructor && (
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg mb-6">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={course.instructor.avatar || ""} />
                      <AvatarFallback>
                        {course.instructor.name?.[0] || "I"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{course.instructor.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor.title}
                      </p>
                    </div>
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                  <p>{course.description}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">
                Selecciona una lección para comenzar.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}