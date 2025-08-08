// /app/(admin)/admin/components/CourseManager.tsx (Versión Final)
"use client";

import { useState, useEffect } from "react";
import MuxUploader from "@mux/mux-uploader-react";
import { createClient } from "@/lib/supabase/client";

type Course = { id: number; title: string };
type Lesson = { id: number; title: string; course_id: number };

export default function CourseManager() {

  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [loading, setLoading] = useState(true);

  // Estados para el uploader
  const [uploadUrl, setUploadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [targetLesson, setTargetLesson] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const { data } = await supabase.from("courses").select("id, title");
      if (data) setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course);
    const { data } = await supabase
      .from("lessons")
      .select("id, title, course_id")
      .eq("course_id", course.id);
    if (data) setLessons(data);
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !selectedCourse) return;
    const { data } = await supabase
      .from("lessons")
      .insert({ title: newLessonTitle, course_id: selectedCourse.id })
      .select()
      .single();
    if (data) {
      setLessons([...lessons, data]);
      setNewLessonTitle("");
    }
  };

  // Función para preparar la subida del vídeo
  const prepareUpload = async (lessonId: number) => {
    setTargetLesson(lessonId); // Marcamos para qué lección es la subida
    try {
      const response = await fetch("/api/create-mux-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId }),
      });

      if (!response.ok) {
        throw new Error("Failed to get upload URL");
      }

      const data = await response.json();
      setUploadUrl(data.uploadUrl);
    } catch (error) {
      console.error(error);
      alert("Error al preparar la subida del vídeo.");
    }
  };

  return (
    <div>
      <h2>Gestión de Cursos y Lecciones</h2>
      {/* ... (código para listar y crear cursos) ... */}

      {selectedCourse && (
        <div>
          <h3>Lecciones de: {selectedCourse.title}</h3>
          <ul>
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                {lesson.title}
                {/* Mostramos el uploader solo para la lección seleccionada */}
                {targetLesson === lesson.id && uploadUrl ? (
                  <MuxUploader
                    endpoint={uploadUrl}
                    onUploadStart={() => setIsUploading(true)}
                    onSuccess={() => {
                      setIsUploading(false);
                      setUploadUrl("");
                      setTargetLesson(null);
                      alert("¡Vídeo subido! Mux lo está procesando.");
                    }}
                  />
                ) : (
                  <button
                    onClick={() => prepareUpload(lesson.id)}
                    disabled={isUploading}
                  >
                    Subir Vídeo
                  </button>
                )}
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddLesson}>
            <input
              type="text"
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
            />
            <button type="submit">Añadir Lección</button>
          </form>
        </div>
      )}
    </div>
  );
}
