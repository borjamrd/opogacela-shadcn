// src/app/courses/[courseId]/learn/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CoursePlayer from "../../components/CoursePlayer"; // La ruta puede variar
import { type Course, type Section, type Lesson } from "@/lib/types";

// Tipos anidados para reflejar la estructura de la consulta
type LessonWithCompletion = Lesson & { completed: boolean };
type SectionWithLessons = Section & { lessons: LessonWithCompletion[] };
type CourseWithSections = Course & { sections: SectionWithLessons[] };

export default async function CourseLearnPage({
  params,
}: {
  params: { courseId: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: courseAccess } = await supabase
    .from("user_courses")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("course_id", params.courseId)
    .single();

  if (!courseAccess) {
    return redirect(`/courses/${params.courseId}?error=access-denied`);
  }

  // 1. Obtenemos el curso con sus secciones y lecciones
  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      sections (
        *,
        lessons (*)
      )
    `
    )
    .eq("id", params.courseId)
    .single();

  if (error || !course) {
    return redirect("/courses?error=not-found");
  }

  // 2. Obtenemos los IDs de las lecciones completadas por el usuario para este curso
  const { data: completedLessons } = await supabase
    .from("user_lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .in(
      "lesson_id",
      course.sections.flatMap((s) => s.lessons.map((l) => l.id))
    );

  const completedLessonIds = new Set(
    completedLessons?.map((l) => l.lesson_id) || []
  );

  // 3. Añadimos el estado 'completed' a cada lección
  const courseDataForPlayer = {
    ...course,
    sections: course.sections.map((section) => ({
      ...section,
      lessons: section.lessons.map((lesson) => ({
        ...lesson,
        completed: completedLessonIds.has(lesson.id),
      })),
    })),
  };

  return (
    <div>
      <CoursePlayer course={courseDataForPlayer as CourseWithSections} />
    </div>
  );
}