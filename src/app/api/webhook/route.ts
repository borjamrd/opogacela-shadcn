import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { StripeService } from "@/services/stripe.service";
import { handleCheckoutSessionCompleted } from "@/app/api/webhook/handlers/checkout-completed";

export async function POST(request: NextRequest) {
  const stripeService = new StripeService();
  const body = await request.text();
  const headersList = headers();
  const sig: string = headersList.get("stripe-signature") || "";

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing Webhook Secret" },
      { status: 500 }
    );
  }

  let event;
  try {
    event = stripeService.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event);
        break;

      default:
        console.error(`Evento no manejado: ${event.type}`);
        break;
    }
  } catch (error) {
    // Catch errors that might have bubbled up from handlers if they chose to throw
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
