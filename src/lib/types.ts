import { type Database } from "./supabase/database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Course = Tables<"courses"> & {
  instructor?: {
    name: string;
    title?: string;
    avatar?: string;
  };
};
export type Lesson = Tables<"lessons">;
export type Profile = Tables<"profiles">;
export type Section = Tables<"sections">; 

export type UserCourse = {
  courses: Course | null;
};
