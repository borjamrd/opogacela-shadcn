// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import Mux from "npm:@mux/mux-node";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

Deno.serve(async (req) => {
  const signature = req.headers.get("Mux-Signature")!;
  const body = await req.text();

  try {
    Mux.webhooks.verifySignature(body, signature, Deno.env.get("MUX_WEBHOOK_SECRET")!);
    
    const { type, data } = JSON.parse(body);

    if (type === "video.asset.ready") {
      const lessonId = data.passthrough;
      const playbackId = data.playback_ids?.[0]?.id;

      if (!lessonId || !playbackId) {
        throw new Error("Missing lessonId or playbackId in webhook payload");
      }

      const { error } = await supabaseAdmin
        .from("lessons")
        .update({ mux_playback_id: playbackId })
        .eq("id", parseInt(lessonId, 10));
        
      if (error) throw error;
    }

    return new Response("Webhook received successfully.", { status: 200 });
  } catch (error) {
    console.error("Error handling Mux webhook:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});