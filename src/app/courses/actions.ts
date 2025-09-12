"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function simulatePurchase(courseId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const { error } = await supabase.from("user_courses").insert({
    course_id: courseId,
    user_id: user.id,
  });

  if (error) {
    console.error("Error simulating purchase:", error);
    return { error: "Could not complete the simulated purchase." };
  }

  revalidatePath("/courses");
  return { success: true };
}

export async function markLessonAsComplete(lessonId: number, courseId: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuario no autenticado." };
  }

  const { error } = await supabase
    .from("user_lesson_progress")
    .insert({ lesson_id: lessonId, user_id: user.id });

  if (error) {
    console.error("Error al marcar la lección como completada:", error);
    // Ignoramos el error si es por clave primaria duplicada (ya está completada)
    if (error.code === "23505") {
      return { success: true };
    }
    return { error: "No se pudo guardar el progreso." };
  }

  // ¡Importante! Revalidamos la ruta para que el Server Component se vuelva a ejecutar
  // y obtenga la lista actualizada de lecciones completadas.
  revalidatePath(`/courses/${courseId}/learn`);
  return { success: true };
}
