// /app/courses/[courseId]/[lessonId]/page.tsx
"use client";
import { supabase } from "@/lib/supabase";
import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useState } from "react";

export default function LessonPage({
  params,
}: {
  params: { lessonId: string };
}) {
  const [playbackId, setPlaybackId] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("mux_playback_id")
        .eq("id", params.lessonId)
        .single();

      if (data) {
        setPlaybackId(data.mux_playback_id);
      }
    };

    fetchLesson();
  }, [params.lessonId, supabase]);

  return (
    <div>
      {playbackId ? (
        <MuxPlayer playbackId={playbackId} />
      ) : (
        <p>Cargando vídeo...</p>
      )}
    </div>
  );
}
