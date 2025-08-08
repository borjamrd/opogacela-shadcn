"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Course, Lesson, Section } from "@/lib/types";

// --- Course Actions ---
export async function createCourse(
  formData: FormData
): Promise<{ data?: Course; error?: string }> {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  if (!title) return { error: "El título es obligatorio." };

  const { data, error } = await supabase
    .from("courses")
    .insert({ title, description })
    .select()
    .single();
  if (error) return { error: "No se pudo crear el curso." };

  revalidatePath("/admin");
  return { data };
}

export async function updateCourseTrailer(
  courseId: number,
  playbackId: string
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("courses")
    .update({ trailer_playback_id: playbackId })
    .eq("id", courseId);
  if (error) return { error: "No se pudo actualizar el tráiler." };

  revalidatePath("/admin");
  return { success: true };
}

// --- Section Actions ---
export async function createSection(
  formData: FormData
): Promise<{ data?: Section; error?: string }> {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;
  if (!title || !courseId)
    return { error: "Faltan datos para crear la sección." };

  const { data, error } = await supabase
    .from("sections")
    .insert({ title, course_id: parseInt(courseId), order: 1 })
    .select()
    .single();
  if (error) return { error: "No se pudo crear la sección." };

  revalidatePath("/admin");
  return { data };
}

// --- Lesson Actions ---
export async function createLesson(
  formData: FormData
): Promise<{ data?: Lesson; error?: string }> {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const sectionId = formData.get("sectionId") as string;
  if (!title || !sectionId)
    return { error: "Faltan datos para crear la lección." };

  // 1. Obtenemos el course_id de la sección padre
  const { data: sectionData, error: sectionError } = await supabase
    .from("sections")
    .select("course_id")
    .eq("id", parseInt(sectionId))
    .single();

  if (sectionError || !sectionData) {
    return { error: "No se pudo encontrar la sección padre." };
  }

  // 2. Insertamos la nueva lección con ambos IDs
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      title,
      section_id: parseInt(sectionId),
      course_id: sectionData.course_id, // <-- CORRECCIÓN
      order: 1,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson:", error);
    return { error: "No se pudo crear la lección." };
  }

  revalidatePath("/admin");
  return { data };
}
