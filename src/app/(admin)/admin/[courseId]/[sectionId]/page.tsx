import { createClient } from "@/lib/supabase/server";
import SectionEditor from "../../components/SectionEditor";
import { type Section, type Lesson } from "@/lib/types";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type SectionWithLessons = Section & { lessons: Lesson[] };

export default async function SectionPage({
  params,
}: {
  params: { sectionId: string };
}) {
  const supabase = await createClient();

  const { data: section } = await supabase
    .from("sections")
    .select("*, lessons(*)")
    .eq("id", params.sectionId)
    .single();

  return (
    <main className="container py-10">
      <div className="mb-6">
        <Link
          href="/admin"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver al curso
        </Link>
      </div>
      <SectionEditor initialSection={section as SectionWithLessons} />;
    </main>
  );
}
