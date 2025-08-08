// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import Mux from "npm:@mux/mux-node";
const mux = new Mux({
  tokenId: Deno.env.get("MUX_TOKEN_ID"),
  tokenSecret: Deno.env.get("MUX_TOKEN_SECRET"),
});

Deno.serve(async (req) => {
  // First, handle CORS preflight requests.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { lessonId } = await req.json();
    if (!lessonId) {
      return new Response(JSON.stringify({ error: "Lesson ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const upload = await mux.video.uploads.create({
      cors_origin: "*", // Adjust to your specific domain in production for better security
      new_asset_settings: {
        playback_policy: ["public"],
        passthrough: lessonId.toString(),
      },
    });

    const { error: updateError } = await supabaseClient
      .from("lessons")
      .update({ mux_asset_id: upload.asset_id })
      .eq("id", lessonId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ uploadUrl: upload.url }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error creating Mux upload:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
