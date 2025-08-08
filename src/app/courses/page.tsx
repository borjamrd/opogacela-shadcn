import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { type Course } from "@/lib/types";
import Link from "next/link";

// Componente para mostrar los cursos del usuario logueado
function UserCourses({ courses }: { courses: (Course | null)[] }) {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Mis Cursos</h1>
      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(
            (course) =>
              course && (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button asChild>
                      <Link href={`/courses/${course.id}`}>
                        Empezar a estudiar
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
          )}
        </div>
      ) : (
        <div>
          <p>Aún no has comprado ningún curso.</p>
          <Button asChild className="mt-4">
            <Link href="/#esquemas">Ver esquemas disponibles</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar los cursos a usuarios no logueados
function PublicCourses({ courses }: { courses: Course[] }) {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Cursos Disponibles</h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Accede a nuestros cursos en vídeo para potenciar tu preparación.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/login">Iniciar sesión para comprar</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Página principal que decide qué componente renderizar
export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Si el usuario está logueado, obtenemos sus cursos
    const { data, error } = await supabase
      .from("user_courses")
      .select("courses(*)")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user courses:", error);
      return <p>Error al cargar tus cursos.</p>;
    }

    const purchasedCourses = data.map((item: any) => item.courses);
    return <UserCourses courses={purchasedCourses} />;
  } else {
    // Si no está logueado, obtenemos todos los cursos para mostrarlos
    const { data: allCourses, error } = await supabase
      .from("courses")
      .select("*");

    if (error) {
      console.error("Error fetching all courses:", error);
      return <p>Error al cargar los cursos disponibles.</p>;
    }

    return <PublicCourses courses={allCourses} />;
  }
}
