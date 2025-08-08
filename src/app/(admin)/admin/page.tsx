import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "./components/AdminDashboard";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Obtenemos los cursos y sus lecciones anidadas desde el servidor
  const { data: courses, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      lessons (*)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses and lessons", error);
    return <p>Error al cargar los datos.</p>;
  }

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <AdminDashboard initialCourses={courses || []} />
    </main>
  );
}
