// /app/api/create-mux-upload/route.ts
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { lessonId } = await request.json();

  // Obtenemos la sesión del usuario para pasar su token de autenticación
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Llamamos a la Edge Function
  const { data, error } = await supabase.functions.invoke("create-mux-upload", {
    body: { lessonId },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
