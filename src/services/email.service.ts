import { Resend } from 'resend';
import { ShippingDetails } from '@/components/email/shippingDetails';
import { ShippingAdminDetails } from '@/components/email/shippingAdmin';
import { TestimonialRequestEmail } from '@/components/email/TestimonialRequestEmail';
import { KlarnaReminderEmail } from '@/components/email/KlarnaReminderEmail';

export class EmailService {
    private resend: Resend;
    private environment: string | undefined;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.environment = process.env.ENV;
    }

    async sendShippingDetails(email: string, name: string, address: any) {
        return this.resend.emails.send({
            from: 'Compras Opogacela <compras@opogacela.es>',
            to: [email],
            subject: 'Compra realizada con éxito',
            react: ShippingDetails({
                name: name,
                email: email,
                address: address,
            }) as React.ReactElement,
        });
    }

    async sendAdminNotification(
        customerName: string,
        customerEmail: string,
        customerAddress: any,
        customerPhone: string,
        lineItems: any
    ) {
        let adminRecipients: string[];
        if (this.environment === 'development') {
            adminRecipients = ['borjamrd1@gmail.com'];
        } else {
            adminRecipients = ['instaopogacela@gmail.com', 'borjamrd1@gmail.com'];
        }

        return this.resend.emails.send({
            from: 'Compras Opogacela <compras@opogacela.es>',
            to: adminRecipients,
            subject: `Nueva compra en OPOGACELA ${this.environment === 'development' ? '[DEV]' : ''}`,
            react: ShippingAdminDetails({
                name: customerName,
                email: customerEmail,
                address: customerAddress,
                phone: customerPhone,
                items: lineItems,
            }) as React.ReactElement,
        });
    }

    async scheduleTestimonialRequest(
        customerEmail: string,
        customerName: string,
        purchaseDate: Date
    ) {
        const DEV_DELAY_MS = 60_000;
        const DAYS_AFTER_PURCHASE = 15;
        const SEND_HOUR_CET = 10;
        let scheduledDateTime: Date;

        if (this.environment === 'development') {
            scheduledDateTime = new Date(Date.now() + DEV_DELAY_MS);
        } else {
            scheduledDateTime = new Date(
                purchaseDate.getTime() + DAYS_AFTER_PURCHASE * 24 * 60 * 60 * 1000
            );

            // 10:00 CET = 09:00 UTC
            scheduledDateTime.setUTCHours(SEND_HOUR_CET - 1, 0, 0, 0);
        }

        return this.resend.emails.send({
            from: 'Opogacela Testimonios <testimonios@opogacela.es>',
            to: [customerEmail],
            subject: `¿Nos das tu opinión sobre tu compra en Opogacela, ${customerName}?`,
            react: TestimonialRequestEmail({
                customerName,
                testimonialLink: `${process.env.NEXT_PUBLIC_URL}/add-testimonial`,
            }) as React.ReactElement,
            // @ts-ignore
            scheduledAt: scheduledDateTime.toISOString(),
        });
    }

    async sendKlarnaReminder(email: string, name: string, checkoutUrl?: string | null) {
        if (!email) return;

        return this.resend.emails.send({
            from: 'Opogacela <compras@opogacela.es>',
            to: [email],
            subject: 'Problema con el pago - Prueba Klarna',
            react: KlarnaReminderEmail({
                name: name,
                checkoutUrl: checkoutUrl || undefined,
            }) as React.ReactElement,
        });
    }
}
