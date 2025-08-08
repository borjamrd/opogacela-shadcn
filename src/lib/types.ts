import { type Database } from "./supabase/database.types";

// Exportamos los tipos generados para poder usarlos en todo el proyecto
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

// Creamos tipos específicos para nuestros modelos para mayor claridad
export type Course = Tables<"courses">;
export type Lesson = Tables<"lessons">;
export type Profile = Tables<"profiles">;

// Creamos un tipo para la estructura de datos que devuelve la consulta
// en la página "Mis Cursos", que es un curso anidado.
export type UserCourse = {
  courses: Course | null;
};
