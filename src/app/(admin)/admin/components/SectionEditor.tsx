"use client";

import { useState, useTransition } from "react";
import { type Lesson, type Section } from "@/lib/types";
import { createLesson } from "../actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuxUploader from "@mux/mux-uploader-react";
import MuxPlayer from "@mux/mux-player-react";
import { Loader2, Video, UploadCloud } from "lucide-react";

type SectionWithLessons = Section & { lessons: Lesson[] };

export default function SectionEditor({
  initialSection,
}: {
  initialSection: SectionWithLessons;
}) {
  const [section, setSection] = useState<SectionWithLessons>(initialSection);
  const [uploadTarget, setUploadTarget] = useState<number | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAction = (action: () => Promise<any>, actionId: string) => {
    setPendingAction(actionId);
    startTransition(async () => {
      await action();
      setPendingAction(null);
    });
  };

  const handleCreateLesson = (formData: FormData) => {
    handleAction(async () => {
      formData.append("sectionId", section.id.toString());
      const { data } = await createLesson(formData);
      if (data) {
        const updatedSection = {
          ...section,
          lessons: [...(section.lessons || []), data],
        };
        setSection(updatedSection);
      }
    }, `create-lesson-${section.id}`);
  };

  const prepareUpload = async (lessonId: number) => {
    if (uploadTarget === lessonId) {
      setUploadTarget(null);
      return;
    }
    setUploadTarget(lessonId);
    setPendingAction(`prepare-lesson-${lessonId}`);
    try {
      const response = await fetch("/api/create-mux-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: { id: lessonId, type: "lesson" } }),
      });
      if (!response.ok) throw new Error("Failed to get upload URL");
      const data = await response.json();
      setUploadUrl(data.uploadUrl);
    } catch (error) {
      alert("Error al preparar la subida.");
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{section.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Lecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(section.lessons || []).map((lesson) => (
              <li
                key={lesson.id}
                className="flex justify-between items-center p-2 hover:bg-muted rounded-lg"
              >
                <span className="flex-1 mr-2">{lesson.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => prepareUpload(lesson.id)}
                  disabled={!!pendingAction}
                >
                  {pendingAction === `prepare-lesson-${lesson.id}` ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : lesson.mux_playback_id ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <UploadCloud className="h-4 w-4" />
                  )}
                </Button>
              </li>
            ))}
          </ul>
          {uploadTarget && (
            <div className="mt-4 pt-4 border-t">
              {uploadUrl ? (
                <MuxUploader
                  endpoint={uploadUrl}
                  onSuccess={() => {
                    alert(
                      "Vídeo subido. La página se recargará para ver los cambios."
                    );
                    window.location.reload();
                  }}
                />
              ) : (
                <MuxPlayer
                  playbackId={
                    section.lessons.find((l) => l.id === uploadTarget)
                      ?.mux_playback_id || ""
                  }
                />
              )}
            </div>
          )}
          <form
            action={(formData) => handleCreateLesson(formData)}
            className="mt-3 pt-3 border-t flex"
          >
            <Input
              name="title"
              placeholder="Título de la nueva lección"
              required
              className="text-sm"
            />
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="ml-2"
              disabled={pendingAction === `create-lesson-${section.id}`}
            >
              {pendingAction === `create-lesson-${section.id}` ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}