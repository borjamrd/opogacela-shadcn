import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { createCourse } from './actions';
import { PlusCircle } from 'lucide-react';

export default async function AdminCoursesListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: courses } = await supabase.from('courses').select('*').order('created_at', { ascending: false });

  return (
    <main className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Cursos</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCourse} className="flex items-center gap-4">
            <Input name="title" placeholder="Título del nuevo curso" required className="flex-grow" />
            <Input name="description" placeholder="Descripción breve" />
            <Button type="submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear Curso
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Cursos Existentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(courses || []).map(course => (
            <Link href={`/admin/${course.id}`} key={course.id}>
              <Card className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
