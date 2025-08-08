// /app/(admin)/admin/page.tsx
"use client";

import { supabase } from "@/lib/supabase";
import MuxUploader from "@mux/mux-uploader-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [uploadUrl, setUploadUrl] = useState("");
  const [lessonId, setLessonId] = useState<number | null>(null); // Deberás obtenerlo al crear la lección
  const [isUploading, setIsUploading] = useState(false);

  const getUploadUrl = async () => {
    if (!lessonId) {
      alert("Primero necesitas crear una lección en la base de datos.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const response = await fetch("/api/create-mux-upload", {
      // Un Route Handler que llama a tu Edge Function
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ lessonId: lessonId }),
    });

    const { uploadUrl } = await response.json();
    setUploadUrl(uploadUrl);
  };

  // Lógica para crear la lección y obtener `lessonId`...

  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Aquí iría tu UI para crear cursos y lecciones */}

      <button onClick={getUploadUrl} disabled={!lessonId}>
        Preparar Subida de Vídeo
      </button>

      {uploadUrl && (
        <MuxUploader
          endpoint={uploadUrl}
          onUploadStart={() => setIsUploading(true)}
          onSuccess={() => {
            setIsUploading(false);
            setUploadUrl("");
            alert("¡Vídeo subido con éxito! Mux lo está procesando.");
          }}
        />
      )}
    </div>
  );
}
