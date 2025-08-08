import { createClient } from "@/lib/supabase/server";
import CoursesClientPage from "./components/CoursesClientPage";

export default async function CoursesPage() {
  const supabase = await createClient();

  // 1. Obtenemos la sesión del usuario para saber si está logueado.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Obtenemos TODOS los cursos disponibles.
  //    La política RLS que creamos permite la lectura pública de esta tabla.
  const { data: allCourses, error: coursesError } = await supabase
    .from("courses")
    .select("*");

  if (coursesError) {
    console.error("Error fetching courses:", coursesError);
    return <p>Error al cargar los cursos.</p>;
  }

  let purchasedCourseIds: number[] = [];
  if (user) {
    // 3. Si el usuario está logueado, obtenemos los IDs de los cursos que ha comprado.
    const { data: purchased, error: purchasedError } = await supabase
      .from("user_courses")
      .select("course_id")
      .eq("user_id", user.id);

    if (purchased) {
      purchasedCourseIds = purchased.map((item) => item.course_id);
    }
  }

  // 4. Pasamos todos los datos al componente cliente.
  return (
    <CoursesClientPage
      courses={allCourses || []}
      purchasedCourseIds={purchasedCourseIds}
      isLoggedIn={!!user}
    />
  );
}
