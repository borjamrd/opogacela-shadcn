"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Course, Lesson } from "@/lib/types";

export async function createCourse(
  formData: FormData
): Promise<{ data?: Course; error?: string }> {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) {
    return { error: "El título es obligatorio." };
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({ title, description })
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    return { error: "No se pudo crear el curso." };
  }

  revalidatePath("/admin");
  return { data };
}

export async function createLesson(
  formData: FormData
): Promise<{ data?: Lesson; error?: string }> {
  const supabase = await createClient();
  const title = formData.get("title") as string;
  const courseId = formData.get("courseId") as string;

  if (!title || !courseId) {
    return { error: "Faltan datos para crear la lección." };
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({ title, course_id: parseInt(courseId) })
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson:", error);
    return { error: "No se pudo crear la lección." };
  }

  revalidatePath("/admin");
  return { data };
}
