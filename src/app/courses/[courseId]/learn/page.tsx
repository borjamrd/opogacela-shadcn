import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoursePlayer from '../../components/CoursePlayer';
import { type Course, type Lesson } from '@/lib/types';

type CourseWithLessons = Course & {
  lessons: Lesson[];
};

export default async function CourseLearnPage({ params }: { params: { courseId: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: courseAccess } = await supabase
    .from('user_courses')
    .select('course_id')
    .eq('user_id', user.id)
    .eq('course_id', params.courseId)
    .single();

  if (!courseAccess) {
    return redirect(`/courses/${params.courseId}?error=access-denied`);
  }

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      sections (
        *,
        lessons (*)
      )
    `)
    .eq('id', params.courseId)
    .single();

  if (error || !course) {
    return redirect('/courses?error=not-found');
  }

  // @ts-ignore
  const allLessons = course.sections.flatMap(section => section.lessons);
  const courseDataForPlayer = { ...course, lessons: allLessons };

  return (
    <div>
      <CoursePlayer course={courseDataForPlayer as CourseWithLessons} />
    </div>
  );
}
