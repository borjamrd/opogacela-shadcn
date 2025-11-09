"use client";

import { useState, useTransition } from "react";
import { type Lesson, type Section } from "@/lib/types";
import { createLesson, deleteLesson, deleteLessonVideo } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
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
import { Loader2, Video, UploadCloud, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

type SectionWithLessons = Section & { lessons: Lesson[] };

export default function SectionEditor({
  initialSection,
}: {
  initialSection: SectionWithLessons;
}) {
  const params = useParams();
  const courseId = Number(params.courseId);

  const [section, setSection] = useState<SectionWithLessons>(initialSection);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    initialSection.lessons?.[0] || null
  );
  const [uploadUrl, setUploadUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: "lesson" | "video";
    targetId: number | null;
  }>({ open: false, type: "lesson", targetId: null });

  const handleAction = (action: () => Promise<any>, actionId: string) => {
    setPendingAction(actionId);
    startTransition(async () => {
      await action();
      setPendingAction(null);
    });
  };

  const handleCreateLesson = (formData: FormData) => {
    const newLessonForm = document.getElementById(
      "new-lesson-form"
    ) as HTMLFormElement;
    handleAction(async () => {
      formData.append("sectionId", section.id.toString());
      const { data } = await createLesson(formData);
      if (data) {
        const updatedSection = {
          ...section,
          lessons: [...(section.lessons || []), data],
        };
        setSection(updatedSection);
        newLessonForm?.reset();
      }
    }, `create-lesson`);
  };
  const prepareUpload = async () => {
    if (!selectedLesson) return;
    setPendingAction(`prepare-upload-${selectedLesson.id}`);
    try {
      const response = await fetch("/api/create-mux-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target: { id: selectedLesson.id, type: "lesson" },
        }),
      });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const data = await response.json();
      setUploadUrl(data.uploadUrl);
    } catch (error) {
      alert("Error al preparar la subida.");
      setUploadUrl("");
    } finally {
      setPendingAction(null);
    }
  };

  const openDialog = (type: "lesson" | "video", targetId: number) => {
    setDialog({ open: true, type, targetId });
  };

  const handleConfirmDelete = () => {
    if (!dialog.targetId) return;

    if (dialog.type === "lesson") {
      handleAction(async () => {
        await deleteLesson(dialog.targetId!, section.id, courseId);
        const newLessons = section.lessons.filter(
          (l) => l.id !== dialog.targetId
        );
        setSection({ ...section, lessons: newLessons });
        if (selectedLesson?.id === dialog.targetId) {
          setSelectedLesson(newLessons[0] || null);
        }
      }, `delete-lesson-${dialog.targetId}`);
    } else {
      handleAction(async () => {
        await deleteLessonVideo(dialog.targetId!, section.id, courseId);
        // Lógica de actualización de UI
        const newLessons = section.lessons.map((l) =>
          l.id === dialog.targetId
            ? { ...l, mux_playback_id: null, mux_asset_id: null }
            : l
        );
        setSection({ ...section, lessons: newLessons });
        setSelectedLesson((prev) =>
          prev?.id === dialog.targetId
            ? { ...prev, mux_playback_id: null, mux_asset_id: null }
            : prev
        );
      }, `delete-video-${dialog.targetId}`);
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Editando: {section.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna de Lecciones (1/3) */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Lecciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 mb-4">
                  {(section.lessons || []).map((lesson) => (
                    <li
                      key={lesson.id}
                      className={cn(
                        "flex justify-between items-center p-2 pr-1 group hover:bg-muted rounded-lg cursor-pointer",
                        selectedLesson?.id === lesson.id && "bg-muted"
                      )}
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setUploadUrl("");
                      }}
                    >
                      <span className="flex items-center gap-2 flex-1 mr-2 truncate">
                        {lesson.mux_playback_id && (
                          <Video className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                        {lesson.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog("lesson", lesson.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <form
                  id="new-lesson-form"
                  action={handleCreateLesson}
                  className="mt-3 pt-3 border-t flex gap-2"
                >
                  <Input
                    name="title"
                    placeholder="Nueva lección"
                    required
                    className="text-sm"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    disabled={pendingAction === "create-lesson"}
                  >
                    {pendingAction === "create-lesson" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlusCircle className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Columna de Edición/Visualización (2/3) */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {selectedLesson
                    ? `Vídeo: ${selectedLesson.title}`
                    : "Selecciona una lección"}
                </CardTitle>
                {selectedLesson?.mux_playback_id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDialog("video", selectedLesson.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar vídeo
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {!selectedLesson ? (
                  <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                    <p className="text-muted-foreground">
                      Selecciona una lección para ver su vídeo.
                    </p>
                  </div>
                ) : selectedLesson.mux_playback_id ? (
                  <MuxPlayer playbackId={selectedLesson.mux_playback_id} />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full aspect-video bg-muted rounded-lg">
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
                      <Button
                        variant="outline"
                        onClick={prepareUpload}
                        disabled={!!pendingAction}
                      >
                        {pendingAction ===
                        `prepare-upload-${selectedLesson.id}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <UploadCloud className="mr-2 h-4 w-4" />
                        )}
                        Subir Vídeo
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <AlertDialog
        open={dialog.open}
        onOpenChange={(open) => setDialog({ ...dialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              {dialog.type === "lesson"
                ? "Esta acción no se puede deshacer. Se eliminará la lección permanentemente, incluyendo su vídeo si lo tuviera."
                : "Esta acción no se puede deshacer. Se eliminará el vídeo de esta lección de forma permanente."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirmar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
