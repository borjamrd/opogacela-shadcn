import { Stripe } from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });
  }

  get client() {
    return this.stripe;
  }

  constructEvent(body: string, sig: string, secret: string) {
    return this.stripe.webhooks.constructEvent(body, sig, secret);
  }

  async retrieveSessionWithLineItems(sessionId: string) {
    return this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  }
}
