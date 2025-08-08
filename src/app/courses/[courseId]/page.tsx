import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CoursePlayer from "../components/CoursePlayer";
import { type Course, type Lesson } from "@/lib/types";

// Extendemos el tipo para incluir las lecciones anidadas
type CourseWithLessons = Course & {
  lessons: Lesson[];
};

export default async function CoursePage({
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

  // 1. Verificamos explícitamente si el usuario tiene acceso a este curso
  const { data: courseAccess } = await supabase
    .from("user_courses")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("course_id", params.courseId)
    .single();

  if (!courseAccess) {
    // Si no tiene acceso, lo redirigimos a la página principal de cursos
    return redirect("/courses?error=access-denied");
  }

  // 2. Si tiene acceso, obtenemos los detalles del curso y todas sus lecciones
  const { data: course, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      lessons (*)
    `
    )
    .eq("id", params.courseId)
    .single();

  if (error || !course) {
    console.error("Error fetching course details:", error);
    return <p>No se pudo encontrar el curso.</p>;
  }

  return (
    <div>
      <CoursePlayer course={course as CourseWithLessons} />
    </div>
  );
}
