"use client";

import { useState, useRef, useTransition } from "react";
import { type Course, type Lesson, type Section } from "@/lib/types";
import { createCourse, createSection, createLesson } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Video, UploadCloud } from "lucide-react";

type SectionWithLessons = Section & { lessons: Lesson[] };
type CourseWithSections = Course & { sections: SectionWithLessons[] };

export default function AdminDashboard({
  initialCourses,
}: {
  initialCourses: CourseWithSections[];
}) {
  const [courses, setCourses] = useState<CourseWithSections[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithSections | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{
    type: "lesson" | "trailer";
    id: number;
  } | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const courseFormRef = useRef<HTMLFormElement>(null);
  const sectionFormRef = useRef<HTMLFormElement>(null);

  const handleSelectCourse = (course: CourseWithSections) => {
    setSelectedCourse(course);
    setUploadTarget(null);
    setUploadUrl("");
  };

  const handleCreateCourse = (formData: FormData) => {
    handleAction(async () => {
      const { data } = await createCourse(formData);
      if (data) {
        setCourses((prev) => [{ ...data, sections: [] }, ...prev]);
        courseFormRef.current?.reset();
      }
    }, `create-course`);
  };

  const handleCreateSection = (formData: FormData) => {
    handleAction(async () => {
      if (!selectedCourse) return;
      formData.append("courseId", selectedCourse.id.toString());
      const { data } = await createSection(formData);
      if (data) {
        const updatedCourse = {
          ...selectedCourse,
          sections: [
            ...(selectedCourse.sections || []),
            { ...data, lessons: [] },
          ],
        };
        const updatedCourses = courses.map((c) =>
          c.id === selectedCourse.id ? updatedCourse : c
        );
        setCourses(updatedCourses);
        setSelectedCourse(updatedCourse);
        sectionFormRef.current?.reset();
      }
    }, `create-section`);
  };

  const handleCreateLesson = (formData: FormData, sectionId: number) => {
    handleAction(async () => {
      if (!selectedCourse) return;
      formData.append("sectionId", sectionId.toString());
      const { data } = await createLesson(formData);
      if (data) {
        const updatedSections = selectedCourse.sections.map((s) =>
          s.id === sectionId
            ? { ...s, lessons: [...(s.lessons || []), data] }
            : s
        );
        const updatedCourse = { ...selectedCourse, sections: updatedSections };
        const updatedCourses = courses.map((c) =>
          c.id === selectedCourse.id ? updatedCourse : c
        );
        setCourses(updatedCourses);
        setSelectedCourse(updatedCourse);
      }
    }, `create-lesson-${sectionId}`);
  };

  const handleAction = (action: () => Promise<any>, actionId: string) => {
    setPendingAction(actionId);
    startTransition(async () => {
      await action();
      setPendingAction(null);
    });
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={courseFormRef}
            action={(formData) => handleCreateCourse(formData)}
            className="space-y-2 mb-6"
          >
            <Input name="title" placeholder="Título del nuevo curso" required />
            <Input name="description" placeholder="Descripción del curso" />
            <Button type="submit" disabled={pendingAction === "create-course"}>
              {pendingAction === "create-course" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Crear Curso
            </Button>
          </form>
          <ul className="space-y-2">
            {courses.map((course) => (
              <li key={course.id}>
                <Button
                  variant={
                    selectedCourse?.id === course.id ? "secondary" : "ghost"
                  }
                  onClick={() => handleSelectCourse(course)}
                >
                  {course.title}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="md:col-span-2 space-y-8">
        {selectedCourse && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Tráiler del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCourse.trailer_playback_id ? (
                  <MuxPlayer playbackId={selectedCourse.trailer_playback_id} />
                ) : (
                  <Button
                    variant="outline"
                    onClick={() =>
                      prepareUpload({ id: selectedCourse.id, type: "trailer" })
                    }
                    disabled={!!pendingAction}
                  >
                    {pendingAction ===
                    `prepare-trailer-${selectedCourse.id}` ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UploadCloud className="mr-2 h-4 w-4" />
                    )}
                    Subir Tráiler
                  </Button>
                )}
                {uploadTarget?.type === "trailer" && uploadUrl && (
                  <div className="mt-4">
                    <MuxUploader endpoint={uploadUrl} />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Contenido: {selectedCourse.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  ref={sectionFormRef}
                  action={(formData) => handleCreateSection(formData)}
                  className="space-y-2 mb-6"
                >
                  <Input
                    name="title"
                    placeholder="Título de la nueva sección"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={pendingAction === "create-section"}
                  >
                    {pendingAction === "create-section" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Añadir Sección
                  </Button>
                </form>
                <div className="space-y-4">
                  {(selectedCourse.sections || []).map((section) => (
                    <div
                      key={section.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <h4 className="font-bold">{section.title}</h4>
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
                              {pendingAction ===
                              `prepare-lesson-${lesson.id}` ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : lesson.mux_playback_id ? (
                                <Video className="mr-2 h-4 w-4" />
                              ) : (
                                <UploadCloud className="mr-2 h-4 w-4" />
                              )}
                              {lesson.mux_playback_id
                                ? "Ver Vídeo"
                                : "Subir Vídeo"}
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
                              <MuxUploader endpoint={uploadUrl} />
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
                          placeholder="Nueva lección en esta sección"
                          required
                          className="text-sm"
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="mt-2"
                          disabled={
                            pendingAction === `create-lesson-${section.id}`
                          }
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
          </>
        )}
      </div>
    </div>
  );
}
