"use client";

import { useState } from "react";
import { type Course, type Lesson } from "@/lib/types";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import { Lock, PlayCircle } from "lucide-react";

type CourseWithLessons = Course & {
  lessons: Lesson[];
};

export default function CoursePlayer({
  course,
}: {
  course: CourseWithLessons;
}) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    course.lessons[0] || null
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="w-full md:w-80 border-r p-6 bg-muted/40">
        <h2 className="text-xl font-bold mb-4">{course.title}</h2>
        <ul className="space-y-2">
          {course.lessons.map((lesson) => (
            <li key={lesson.id}>
              <button
                onClick={() => setSelectedLesson(lesson)}
                className={cn(
                  "w-full text-left p-3 rounded-md transition-colors flex items-center",
                  selectedLesson?.id === lesson.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <PlayCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                {lesson.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 p-6">
      
        {selectedLesson ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">{selectedLesson.title}</h1>
            {selectedLesson.mux_playback_id ? (
              <div className="aspect-video">
                <MuxPlayer playbackId={selectedLesson.mux_playback_id} />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Lock className="mx-auto h-12 w-12" />
                  <p className="mt-2">
                    El vídeo para esta lección aún no está disponible.
                  </p>
                </div>
              </div>
            )}
            <p className="mt-4 text-muted-foreground">
              {selectedLesson.description}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">
              Selecciona una lección para comenzar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
