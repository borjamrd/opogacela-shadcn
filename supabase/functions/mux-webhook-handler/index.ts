// @ts-nocheck

import { createClient } from "npm:@supabase/supabase-js@2";
import Mux from "npm:@mux/mux-node@8";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const muxClient = new Mux({
  webhookSecret: Deno.env.get("MUX_WEBHOOK_SECRET"),
});
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const body = await req.text();
  try {
    const event = muxClient.webhooks.unwrap(body, req.headers);

    if (event.type === "video.asset.ready") {
      const { passthrough, playback_ids } = event.data;
      const playbackId = playback_ids?.[0]?.id;

      const [type, id] = passthrough.split(":");

      if (!type || !id || !playbackId) {
        throw new Error("Invalid passthrough data");
      }

      const tableToUpdate = type === "trailer" ? "courses" : "lessons";
      const columnToUpdate =
        type === "trailer" ? "trailer_playback_id" : "mux_playback_id";

      const { error } = await supabaseAdmin
        .from(tableToUpdate)
        .update({ [columnToUpdate]: playbackId })
        .eq("id", parseInt(id, 10));

      if (error) throw error;
    }
    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
