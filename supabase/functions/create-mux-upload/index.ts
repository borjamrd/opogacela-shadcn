// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";
import Mux from "npm:@mux/mux-node@8";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORRECCIÓN: Instanciamos el cliente de Mux pasándole las credenciales
// desde las variables de entorno (secretos) de la Edge Function.
const mux = new Mux({
  tokenId: Deno.env.get("MUX_TOKEN_ID"),
  tokenSecret: Deno.env.get("MUX_TOKEN_SECRET"),
});

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

  try {
    const { target } = await req.json(); // { type: 'trailer' | 'lesson', id: number }
    if (!target || !target.type || !target.id) {
      return new Response("Invalid target in request body", { status: 400 });
    }

    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: {
        playback_policy: ["public"],
        passthrough: `${target.type}:${target.id}`,
      },
    });

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
    console.error("Error in create-mux-upload:", error.message);
    return new Response(error.message, { status: 500 });
  }
});
