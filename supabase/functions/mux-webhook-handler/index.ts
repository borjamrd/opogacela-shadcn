// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import Mux from "npm:@mux/mux-node@8";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mux = new Mux({
  webhookSecret: Deno.env.get("MUX_WEBHOOK_SECRET"),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const body = await req.text();

  try {
    const event = mux.webhooks.unwrap(body, req.headers);

    if (event.type === "video.asset.ready") {
      const { passthrough: lessonId, playback_ids } = event.data;
      const playbackId = playback_ids?.[0]?.id;

      if (!lessonId || !playbackId) {
        console.error(
          "Missing lessonId or playbackId in webhook payload:",
          event.data
        );
        throw new Error("Missing lessonId or playbackId");
      }


      const { error } = await supabaseAdmin
        .from("lessons")
        .update({ mux_playback_id: playbackId })
        .eq("id", parseInt(lessonId, 10));

      if (error) {
        console.error("Error updating lesson in Supabase:", error);
        throw error;
      }

    }

    return new Response("Webhook processed successfully", { status: 200 });
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
