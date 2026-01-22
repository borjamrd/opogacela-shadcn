import { EmailService } from '@/services/email.service';
import { GoogleSheetsService } from '@/services/google-sheets.service';
import { StripeService } from '@/services/stripe.service';
import { Stripe } from 'stripe';

export async function handleCheckoutSessionCompleted(event: Stripe.CheckoutSessionCompletedEvent) {
    const stripeService = new StripeService();
    const emailService = new EmailService();
    const googleSheetsService = new GoogleSheetsService();

    const checkoutSessionCompleted = event.data.object;
    const customerAddress: any = checkoutSessionCompleted.customer_details?.address || 'not found';
    const customerEmail =
        checkoutSessionCompleted.customer_email ||
        checkoutSessionCompleted.customer_details?.email ||
        'not found';
    const customerName = checkoutSessionCompleted.customer_details?.name || 'not found';
    const customerPhone =
        checkoutSessionCompleted.custom_fields?.find((field) => field.key === 'phone')?.text
            ?.value || 'not found';

    const sessionWithLineItems = await stripeService.retrieveSessionWithLineItems(
        event.data.object.id
    );

    const lineItems = sessionWithLineItems.line_items;
    const totalPrice = checkoutSessionCompleted?.amount_total
        ? checkoutSessionCompleted?.amount_total / 100
        : null;
    const purchaseDate = new Date(event.created * 1000);

    // SAVE TO GOOGLE SHEETS
    try {
        await googleSheetsService.saveOrder(
            new Date(event.created * 1000),
            customerName,
            customerName, // Passing name as surname too as per original code logic
            customerAddress?.line1,
            customerAddress?.line2,
            customerAddress.postal_code,
            customerAddress.state,
            customerEmail,
            customerPhone,
            totalPrice,
            event.data.object.payment_intent as string // Casting as likely string or null, original code passed it directly
        );
    } catch (error) {
        console.error('Problemas al guardar los datos en Google Sheets', error);
    }

    // SEND EMAILS
    try {
        await emailService.sendShippingDetails(customerEmail, customerName, customerAddress);

        await emailService.sendAdminNotification(
            customerName,
            customerEmail,
            customerAddress,
            customerPhone,
            lineItems?.data
        );
    } catch (error) {
        console.error('Error sending shipping/admin emails', error);
        // Original code returned Response.json({ error }) here which might stop execution.
        // We'll throw so the main handler can return response if needed, or just log.
        // The original code stops execution of the *testimonial email* if this fails contextually.
        throw error;
    }

    // SCHEDULE TESTIMONIAL
    try {
        await emailService.scheduleTestimonialRequest(customerEmail, customerName, purchaseDate);
    } catch (error) {
        console.error('Excepción al intentar programar el email de testimonio:', error);
    }
}
