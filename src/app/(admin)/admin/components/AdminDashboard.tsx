"use client";

import { useState } from "react";
import { type Course, type Lesson } from "@/lib/types";
import { createCourse, createLesson } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";

// Extendemos el tipo para incluir las lecciones anidadas
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
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Estados para el uploader
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectCourse = (course: CourseWithLessons) => {
    setSelectedCourse(course);
    setSelectedLesson(null); // Reseteamos la lección al cambiar de curso
    setUploadUrl("");
  };

  const prepareUpload = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    try {
      const response = await fetch("/api/create-mux-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: lesson.id }),
      });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const data = await response.json();
      setUploadUrl(data.uploadUrl);
    } catch (error) {
      alert("Error al preparar la subida del vídeo.");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Columna de Cursos */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCourse} className="space-y-2 mb-6">
            <Input name="title" placeholder="Título del nuevo curso" required />
            <Input name="description" placeholder="Descripción del curso" />
            <Button type="submit">Crear Curso</Button>
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

      {/* Columna de Lecciones y Detalles */}
      <div className="md:col-span-2 space-y-8">
        {selectedCourse && (
          <Card>
            <CardHeader>
              <CardTitle>Lecciones de: {selectedCourse.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createLesson} className="space-y-2 mb-6">
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
                <Button type="submit">Añadir Lección</Button>
              </form>
              <ul className="space-y-2">
                {selectedCourse.lessons.map((lesson) => (
                  <li key={lesson.id} className="p-2 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span>{lesson.title}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => prepareUpload(lesson)}
                      >
                        Gestionar Vídeo
                      </Button>
                    </div>
                    {/* Uploader y Preview */}
                    {selectedLesson?.id === lesson.id && (
                      <div className="mt-4 space-y-4">
                        {uploadUrl && !lesson.mux_playback_id && (
                          <MuxUploader
                            endpoint={uploadUrl}
                            onUploadStart={() => setIsUploading(true)}
                            onSuccess={() => {
                              setIsUploading(false);
                              setUploadUrl("");
                              alert(
                                "¡Vídeo subido! Mux lo está procesando. Refresca la página en unos momentos para ver la previsualización."
                              );
                            }}
                          />
                        )}
                        {lesson.mux_playback_id && (
                          <div>
                            <h4 className="font-semibold">Previsualización</h4>
                            <MuxPlayer playbackId={lesson.mux_playback_id} />
                          </div>
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
