import { Stripe } from 'stripe';
import { EmailService } from '@/services/email.service';

export async function handlePaymentFailed(event: Stripe.PaymentIntentPaymentFailedEvent) {
    const emailService = new EmailService();

    const paymentIntent = event.data.object as any;

    const billingDetails = paymentIntent.last_payment_error?.payment_method?.billing_details;

    const customerEmail = billingDetails?.email;
    const customerName = billingDetails?.name;

    const fallbackEmail = paymentIntent['charges']?.data[0]?.billing_details?.email;
    const fallbackName = paymentIntent['charges']?.data[0]?.billing_details?.name;

    const finalEmail = customerEmail || fallbackEmail;
    const finalName = customerName || fallbackName;

    const checkoutUrl = `${process.env.NEXT_PUBLIC_URL}`;

    if (finalEmail) {
        try {
            await emailService.sendKlarnaReminder(finalEmail, finalName, checkoutUrl);
        } catch (error) {
            console.error('Error sending Klarna reminder:', error);
        }
    }
}
