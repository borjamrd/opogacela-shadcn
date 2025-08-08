"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  const { error } = await supabase
    .from("courses")
    .insert({ title, description });

  if (error) {
    console.error("Error creating course:", error);
    return { error: "No se pudo crear el curso." };
  }

  revalidatePath("/admin"); // Actualiza la UI para mostrar el nuevo curso
  return { success: true };
}

export async function createLesson(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;

  if (!title || !courseId) {
    return { error: "Faltan datos para crear la lección." };
  }

  const { error } = await supabase
    .from("lessons")
    .insert({ title, course_id: parseInt(courseId) });

  if (error) {
    console.error("Error creating lesson:", error);
    return { error: "No se pudo crear la lección." };
  }

  revalidatePath("/admin"); // Actualiza la UI para mostrar la nueva lección
  return { success: true };
}
