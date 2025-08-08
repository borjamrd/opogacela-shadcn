import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CourseEditor from '../components/CourseEditor';
import { type Course, type Section, type Lesson } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type SectionWithLessons = Section & { lessons: Lesson[] };
type CourseWithSections = Course & { sections: SectionWithLessons[] };

export default async function EditCoursePage({ params }: { params: { courseId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: course, error } = await supabase
    .from('courses')
    .select('*, sections(*, lessons(*))')
    .eq('id', params.courseId)
    .single();

  if (error || !course) {
    return redirect('/admin?error=not-found');
  }

  return (
    <main className="container py-10">
      <div className="mb-6">
        <Link href="/admin" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Volver a todos los cursos
        </Link>
      </div>
      <CourseEditor initialCourse={course as CourseWithSections} />
    </main>
  );
}
