import { Stripe } from "stripe";
import { EmailService } from "@/services/email.service";

export async function handlePaymentFailed(
  event:
    | Stripe.CheckoutSessionAsyncPaymentFailedEvent
    | Stripe.CheckoutSessionExpiredEvent
) {
  const emailService = new EmailService();

  const session = event.data.object;
  const customerEmail =
    session.customer_email || session.customer_details?.email || "";

  const customerName = session.customer_details?.name || "Cliente";

  // Recover the checkout URL if available to let them retry,
  // though for a failed session sometimes creating a new one is better,
  // but Stripe often provides a url in the session object if it's still valid-ish
  // or we might just want to send them to the main pricing page if not.
  // checkout.session.url is usually available.
  const checkoutUrl = session.url;

  if (customerEmail) {
    try {
      await emailService.sendKlarnaReminder(
        customerEmail,
        customerName,
        checkoutUrl
      );
    } catch (error) {
      console.error("Error sending Klarna reminder:", error);
    }
  }
}
