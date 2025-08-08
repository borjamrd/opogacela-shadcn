"use client";

import { useState, useRef, useTransition } from "react";
import { type Course, type Lesson } from "@/lib/types";
import { createCourse, createLesson } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Video, UploadCloud } from "lucide-react";

type CourseWithLessons = Course & {
  lessons: Lesson[];
};

export default function AdminDashboard({
  initialCourses,
}: {
  initialCourses: CourseWithLessons[];
}) {
  const [courses, setCourses] = useState<CourseWithLessons[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithLessons | null>(null);
  const [lessonToManage, setLessonToManage] = useState<Lesson | null>(null);

  const [uploadUrl, setUploadUrl] = useState("");
  const [isPreparingUpload, setIsPreparingUpload] = useState(false);

  const [isCoursePending, startCourseTransition] = useTransition();
  const [isLessonPending, startLessonTransition] = useTransition();

  const courseFormRef = useRef<HTMLFormElement>(null);
  const lessonFormRef = useRef<HTMLFormElement>(null);

  const handleSelectCourse = (course: CourseWithLessons) => {
    setSelectedCourse(course);
    setLessonToManage(null);
    setUploadUrl("");
  };

  const handleCreateCourse = (formData: FormData) => {
    startCourseTransition(async () => {
      const { data, error } = await createCourse(formData);
      if (data) {
        setCourses((prev) => [{ ...data, lessons: [] }, ...prev]);
        courseFormRef.current?.reset();
      } else if (error) {
        alert(error);
      }
    });
  };

  const handleCreateLesson = (formData: FormData) => {
    startLessonTransition(async () => {
      const { data: newLesson, error } = await createLesson(formData);
      if (newLesson && selectedCourse) {
        const updatedCourses = courses.map((c) =>
          c.id === selectedCourse.id
            ? { ...c, lessons: [...c.lessons, newLesson] }
            : c
        );
        setCourses(updatedCourses);
        setSelectedCourse((prev) =>
          prev ? updatedCourses.find((c) => c.id === prev.id) || null : null
        );
        lessonFormRef.current?.reset();
        // Ya no preparamos la subida automáticamente
      } else if (error) {
        alert(error);
      }
    });
  };

  const prepareUpload = async (lesson: Lesson) => {
    // Si ya estamos gestionando esta lección, la cerramos (toggle)
    if (lessonToManage?.id === lesson.id) {
      setLessonToManage(null);
      return;
    }

    setLessonToManage(lesson);
    if (lesson.mux_playback_id) {
      setUploadUrl(""); // Si ya hay video, solo mostramos el player
      return;
    }
    setIsPreparingUpload(true);
    try {
      const response = await fetch("api/create-mux-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const data = await response.json();
      setUploadUrl(data.uploadUrl);
    } catch (error) {
      alert("Error al preparar la subida del vídeo.");
    } finally {
      setIsPreparingUpload(false);
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
            action={handleCreateCourse}
            className="space-y-2 mb-6"
          >
            <Input name="title" placeholder="Título del nuevo curso" required />
            <Input name="description" placeholder="Descripción del curso" />
            <Button type="submit" disabled={isCoursePending}>
              {isCoursePending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
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
          <Card>
            <CardHeader>
              <CardTitle>Lecciones de: {selectedCourse.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                ref={lessonFormRef}
                action={handleCreateLesson}
                className="space-y-2 mb-6"
              >
                <Input
                  name="title"
                  placeholder="Título de la nueva lección"
                  required
                />
                <input
                  type="hidden"
                  name="courseId"
                  value={selectedCourse.id}
                />
                <Button type="submit" disabled={isLessonPending}>
                  {isLessonPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Añadir Lección
                </Button>
              </form>
              <ul className="space-y-4">
                {selectedCourse.lessons.map((lesson) => (
                  <li key={lesson.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lesson.title}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => prepareUpload(lesson)}
                      >
                        {lesson.mux_playback_id ? (
                          <Video className="mr-2 h-4 w-4" />
                        ) : (
                          <UploadCloud className="mr-2 h-4 w-4" />
                        )}
                        {lesson.mux_playback_id ? "Ver Vídeo" : "Subir Vídeo"}
                      </Button>
                    </div>
                    {lessonToManage?.id === lesson.id && (
                      <div className="mt-4 pt-4 border-t">
                        {isPreparingUpload ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          <>
                            {lesson.mux_playback_id ? (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Previsualización
                                </h4>
                                <MuxPlayer
                                  playbackId={lesson.mux_playback_id}
                                />
                              </div>
                            ) : (
                              uploadUrl && (
                                <MuxUploader
                                  endpoint={uploadUrl}
                                  onSuccess={() => {
                                    alert(
                                      "¡Vídeo subido! Mux lo está procesando. Refresca la página en unos momentos para ver la previsualización."
                                    );
                                    setLessonToManage(null);
                                  }}
                                />
                              )
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
