"use client";

import { useState, useRef, useTransition } from "react";
import { type Course, type Lesson, type Section } from "@/lib/types";
import {
  createSection,
  deleteSection,
  updateCourseDescription,
} from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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
import {
  Loader2,
  UploadCloud,
  User,
  Star,
  Info,
  Edit,
  Trash2,
  VideoIcon,
  Save, // Importar icono
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import MuxPlayer from "@mux/mux-player-react";
import MuxUploader from "@mux/mux-uploader-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type SectionWithLessons = Section & { lessons: Lesson[] };
type CourseWithSections = Course & { sections: SectionWithLessons[] };

export default function CourseEditor({
  initialCourse,
}: {
  initialCourse: CourseWithSections;
}) {
  const [course, setCourse] = useState<CourseWithSections>(initialCourse);
  const [uploadTarget, setUploadTarget] = useState<{
    type: "trailer";
    id: number;
  } | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [dialog, setDialog] = useState<{
    open: boolean;
    targetId: number | null;
  }>({
    open: false,
    targetId: null,
  });

  const [description, setDescription] = useState(course.description || "");

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

  const handleDescriptionSave = () => {
    handleAction(async () => {
      const result = await updateCourseDescription(course.id, description);
      if (result.success) {
        setCourse((prev) => ({ ...prev, description }));
        setIsEditingDescription(false);
      } else {
        // Aquí podrías mostrar una notificación de error
        alert(result.error);
      }
    }, "update-description");
  };

  const prepareUpload = async (target: { id: number; type: "trailer" }) => {
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

  const openDeleteDialog = (sectionId: number) => {
    setDialog({ open: true, targetId: sectionId });
  };

  const handleConfirmDelete = () => {
    if (!dialog.targetId) return;

    handleAction(async () => {
      await deleteSection(dialog.targetId!, course.id);
      // Optimistic UI update
      setCourse((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== dialog.targetId),
      }));
    }, `delete-section-${dialog.targetId}`);
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Sobre el curso</CardTitle>
                  {!isEditingDescription && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingDescription(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {isEditingDescription ? (
                    <div className="space-y-4">
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={8}
                        placeholder="Añade una descripción detallada del curso..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditingDescription(false);
                            setDescription(course.description || ""); // Resetea los cambios
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleDescriptionSave}
                          disabled={isPending}
                        >
                          {pendingAction === "update-description" ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Guardar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {course.description ||
                        "No hay descripción para este curso."}
                    </p>
                  )}
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
            <CardContent className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <div className="flex items-center my-4">
                <form
                  ref={sectionFormRef}
                  action={(formData) => handleCreateSection(formData)}
                  className="flex-1 flex items-center gap-2"
                >
                  <Input
                    name="title"
                    placeholder="Nueva sección"
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
              <div className="space-y-4">
                <Accordion type="multiple" className="w-full">
                  {(course.sections || []).map((section) => (
                    <AccordionItem
                      key={section.id}
                      value={section.id.toString()}
                    >
                      <div className="flex items-center w-full justify-between">
                        <AccordionTrigger className="text-left flex gap-3">
                          {section.title}
                        </AccordionTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ms-4"
                          onClick={() => openDeleteDialog(section.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {section.lessons.length === 0 && (
                            <li className="text-sm text-muted-foreground">
                              No hay lecciones en esta sección.
                            </li>
                          )}
                          {(section.lessons || []).map((lesson) => (
                            <li
                              key={lesson.id}
                              className="flex justify-between items-center p-2 hover:bg-muted rounded-lg"
                            >
                              <span className="flex-1 mr-2 flex items-center gap-2">
                                {/* Video icon */}
                                <VideoIcon className="w-4 h-4 text-muted-foreground" />
                                {lesson.title}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/admin/${course.id}/${section.id}`}
                          passHref
                        >
                          <Button variant="outline" size="sm" className="mt-4">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar sección
                          </Button>
                        </Link>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog({ ...dialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la sección y
              <strong> todas sus lecciones y vídeos</strong> de forma
              permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Sí, eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
