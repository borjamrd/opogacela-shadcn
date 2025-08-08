"use client";

import { useState, useRef, useTransition } from "react";
import { type Course, type Lesson, type Section } from "@/lib/types";
import { createSection, createLesson } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Video, UploadCloud } from "lucide-react";

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
      const response = await fetch('/api/create-mux-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p className="text-lg text-muted-foreground">{course.description}</p>

      <Card>
        <CardHeader>
          <CardTitle>Tráiler del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          {course.trailer_playback_id ? (
            <MuxPlayer className="h-48 w-auto" playbackId={course.trailer_playback_id} />
          ) : (
            <Button
              variant="outline"
              onClick={() => prepareUpload({ id: course.id, type: "trailer" })}
              disabled={!!pendingAction}
            >
              {pendingAction === `prepare-trailer-${course.id}` ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="mr-2 h-4 w-4" />
              )}
              Subir Tráiler
            </Button>
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

      <Card>
        <CardHeader>
          <CardTitle>Contenido del Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={sectionFormRef}
            action={(formData) => handleCreateSection(formData)}
            className="space-y-2 mb-6 p-4 border rounded-lg"
          >
            <h3 className="font-semibold">Añadir Nueva Sección</h3>
            <Input name="title" placeholder="Título de la sección" required />
            <Button type="submit" disabled={pendingAction === "create-section"}>
              {pendingAction === "create-section" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Añadir Sección
            </Button>
          </form>
          <div className="space-y-4 mt-6">
            {(course.sections || []).map((section) => (
              <div key={section.id} className="p-4 border rounded-lg space-y-3">
                <h4 className="font-bold text-lg">{section.title}</h4>
                <ul className="space-y-2 pl-4">
                  {(section.lessons || []).map((lesson) => (
                    <li
                      key={lesson.id}
                      className="flex justify-between items-center"
                    >
                      <span>{lesson.title}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          prepareUpload({ id: lesson.id, type: "lesson" })
                        }
                        disabled={!!pendingAction}
                      >
                        {pendingAction === `prepare-lesson-${lesson.id}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : lesson.mux_playback_id ? (
                          <Video className="mr-2 h-4 w-4" />
                        ) : (
                          <UploadCloud className="mr-2 h-4 w-4" />
                        )}
                        {lesson.mux_playback_id ? "Ver Vídeo" : "Subir Vídeo"}
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
                  className="mt-3 pt-3 border-t"
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
                    className="mt-2"
                    disabled={pendingAction === `create-lesson-${section.id}`}
                  >
                    {pendingAction === `create-lesson-${section.id}` ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Añadir Lección
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
