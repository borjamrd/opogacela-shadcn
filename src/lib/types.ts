import { type Database } from "./supabase/database.types";

// Exportamos los tipos generados para poder usarlos en todo el proyecto
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Course = Tables<"courses">;
export type Lesson = Tables<"lessons">;
export type Profile = Tables<"profiles">;
export type Section = Tables<"sections">; // <- NUEVO TIPO

export type UserCourse = {
  courses: Course | null;
};
