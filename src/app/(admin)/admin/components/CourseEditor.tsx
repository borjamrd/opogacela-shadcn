"use client";

import { useState, useRef, useTransition } from "react";
import { type Course, type Lesson, type Section } from "@/lib/types";
import { createSection, createLesson } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Video, UploadCloud, User, Star, Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

type SectionWithLessons = Section & { lessons: Lesson[] };
type CourseWithSections = Course & { sections: SectionWithLessons[] };

export default function CourseEditor({
  initialCourse,
}: {
  initialCourse: CourseWithSections;
}) {
  const [course, setCourse] = useState<CourseWithSections>(initialCourse);
  const [uploadTarget, setUploadTarget] = useState<{
    type: "lesson" | "trailer";
    id: number;
  } | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sectionFormRef = useRef<HTMLFormElement>(null);

  const handleAction = (action: () => Promise<any>, actionId: string) => {
    setPendingAction(actionId);
    startTransition(async () => {
      await action();
      setPendingAction(null);
    });
  };

  const handleCreateSection = (formData: FormData) => {
    handleAction(async () => {
      formData.append("courseId", course.id.toString());
      const { data } = await createSection(formData);
      if (data) {
        const updatedCourse = {
          ...course,
          sections: [...(course.sections || []), { ...data, lessons: [] }],
        };
        setCourse(updatedCourse);
        sectionFormRef.current?.reset();
      }
    }, "create-section");
  };

  const handleCreateLesson = (formData: FormData, sectionId: number) => {
    handleAction(async () => {
      formData.append("sectionId", sectionId.toString());
      const { data } = await createLesson(formData);
      if (data) {
        const updatedSections = course.sections.map((s) =>
          s.id === sectionId
            ? { ...s, lessons: [...(s.lessons || []), data] }
            : s
        );
        const updatedCourse = { ...course, sections: updatedSections };
        setCourse(updatedCourse);
      }
    }, `create-lesson-${sectionId}`);
  };

  const prepareUpload = async (target: {
    id: number;
    type: "lesson" | "trailer";
  }) => {
    if (uploadTarget?.id === target.id && uploadTarget.type === target.type) {
      setUploadTarget(null);
      return;
    }
    setUploadTarget(target);
    setPendingAction(`prepare-${target.type}-${target.id}`);
    try {
      const response = await fetch("/api/create-mux-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const data = await response.json();
      setUploadUrl(data.uploadUrl);
    } catch (error) {
      alert("Error al preparar la subida.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <div className="grid grid-cols-3 gap-6">
        {/* Columna Principal (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Trailer del curso */}
          <Card>
            <CardContent className="p-6">
              {course.trailer_playback_id ? (
                <MuxPlayer
                  className="w-full aspect-video"
                  playbackId={course.trailer_playback_id}
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full aspect-video bg-muted rounded-lg">
                  <Button
                    variant="outline"
                    onClick={() =>
                      prepareUpload({ id: course.id, type: "trailer" })
                    }
                    disabled={!!pendingAction}
                  >
                    {pendingAction === `prepare-trailer-${course.id}` ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    Subir Tráiler
                  </Button>
                </div>
              )}
              {uploadTarget?.type === "trailer" && uploadUrl && (
                <div className="mt-4">
                  <MuxUploader
                    endpoint={uploadUrl}
                    onSuccess={() => {
                      alert(
                        "Tráiler subido. La página se recargará para ver los cambios."
                      );
                      window.location.reload();
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs de información */}
          <Tabs defaultValue="info" className="w-full">
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
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Sobre el curso</h3>
                  <p className="text-muted-foreground">{course.description}</p>
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

        {/* Columna Lateral (1/3) - Contenido del Curso */}
        <div className="col-span-1">
          <Card className="sticky top-4">
            <CardHeader className="border-b mb-4">
              <CardTitle>Contenido del curso</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  {(course.sections || []).map((section) => (
                    <AccordionItem
                      key={section.id}
                      value={section.id.toString()}
                    >
                      <AccordionTrigger>
                        <h4 className="font-bold text-lg">{section.title}</h4>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {(section.lessons || []).map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex justify-between items-center p-2 hover:bg-muted rounded-lg"
                            >
                              <span className="flex-1 mr-2">
                                {lesson.title}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  prepareUpload({
                                    id: lesson.id,
                                    type: "lesson",
                                  })
                                }
                                disabled={!!pendingAction}
                              >
                                {pendingAction ===
                                `prepare-lesson-${lesson.id}` ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : lesson.mux_playback_id ? (
                                  <Video className="h-4 w-4" />
                                ) : (
                                  <UploadCloud className="h-4 w-4" />
                                )}
                              </Button>
                            </li>
                          ))}
                        </ul>
                        {uploadTarget?.type === "lesson" &&
                          (section.lessons || []).some(
                            (l) => l.id === uploadTarget.id
                          ) && (
                            <div className="mt-4 pt-4 border-t">
                              {uploadUrl ? (
                                <MuxUploader
                                  endpoint={uploadUrl}
                                  onSuccess={() => {
                                    alert(
                                      "Vídeo subido. La página se recargará para ver los cambios."
                                    );
                                    window.location.reload();
                                  }}
                                />
                              ) : (
                                <MuxPlayer
                                  playbackId={
                                    section.lessons.find(
                                      (l) => l.id === uploadTarget.id
                                    )?.mux_playback_id || ""
                                  }
                                />
                              )}
                            </div>
                          )}
                        <form
                          action={(formData) =>
                            handleCreateLesson(formData, section.id)
                          }
                          className="mt-3 pt-3 border-t flex"
                        >
                          <Input
                            name="title"
                            placeholder="Título de la nueva lección"
                            required
                            className="text-sm"
                          />
                          <Button
                            type="submit"
                            size="sm"
                            variant="outline"
                            className="ml-2"
                            disabled={
                              pendingAction === `create-lesson-${section.id}`
                            }
                          >
                            {pendingAction === `create-lesson-${section.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UploadCloud className="h-4 w-4" />
                            )}
                          </Button>
                        </form>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader className="border-b">
              <CardTitle>Añadir nueva sección</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center">
                <form
                  ref={sectionFormRef}
                  action={(formData) => handleCreateSection(formData)}
                  className="flex-1 flex items-center gap-2"
                >
                  <Input
                    name="title"
                    placeholder="Título de la sección"
                    required
                    className="text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    disabled={pendingAction === "create-section"}
                  >
                    {pendingAction === "create-section" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
