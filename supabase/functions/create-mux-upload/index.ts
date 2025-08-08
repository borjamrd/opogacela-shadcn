// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";
import Mux from "npm:@mux/mux-node@8";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mux = new Mux();

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    }
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { target } = await req.json(); // { type: 'trailer' | 'lesson', id: number }

  try {
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
        // Pasamos el tipo y el ID para que el webhook sepa qué actualizar
        passthrough: `${target.type}:${target.id}`,
      },
    });

    // Actualizamos la tabla correcta con el asset_id
    const tableToUpdate = target.type === "trailer" ? "courses" : "lessons";
    const { error: updateError } = await supabaseClient
      .from(tableToUpdate)
      .update({ mux_asset_id: upload.asset_id })
      .eq("id", target.id);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ uploadUrl: upload.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
});
