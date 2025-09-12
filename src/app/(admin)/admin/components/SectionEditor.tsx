"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { type Lesson, type Section } from "@/lib/types";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import MuxUploader from "@mux/mux-uploader-react";
import { Loader2, PlusCircle, UploadCloud, Video } from "lucide-react";
import { useState, useTransition } from "react";
import { createLesson } from "../actions";

type SectionWithLessons = Section & { lessons: Lesson[] };

export default function SectionEditor({
  initialSection,
}: {
  initialSection: SectionWithLessons;
}) {
  const [section, setSection] = useState<SectionWithLessons>(initialSection);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [, startTransition] = useTransition();

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

  // Selecciona la primera lección por defecto si existe
  useState(() => {
    if (initialSection.lessons && initialSection.lessons.length > 0) {
      setSelectedLesson(initialSection.lessons[0]);
    }
  });

  return (
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
              <ul className="space-y-2 mb-4">
                {(section.lessons || []).map((lesson) => (
                  <li
                    key={lesson.id}
                    className={cn(
                      "flex justify-between items-center p-2 hover:bg-muted rounded-lg cursor-pointer",
                      selectedLesson?.id === lesson.id && "bg-muted"
                    )}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setUploadUrl(""); // Resetea la URL de subida al cambiar de lección
                    }}
                  >
                    <span className="flex-1 mr-2 truncate">{lesson.title}</span>
                    {lesson.mux_playback_id && (
                      <Video className="h-4 w-4 text-green-500" />
                    )}
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
                  disabled={pendingAction === `create-lesson`}
                >
                  {pendingAction === `create-lesson` ? (
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
            <CardHeader>
              <CardTitle>
                {selectedLesson
                  ? `Vídeo: ${selectedLesson.title}`
                  : "Selecciona una lección"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedLesson ? (
                <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                  <p className="text-muted-foreground">
                    Selecciona una lección para ver su vídeo.
                  </p>
                </div>
              ) : selectedLesson.mux_playback_id ? (
                <div>
                  <MuxPlayer playbackId={selectedLesson.mux_playback_id} />
                  {/* Aquí puedes añadir un botón para eliminar el vídeo */}
                </div>
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
  );
}
