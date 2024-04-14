import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Stripe } from 'stripe';
import { Resend } from 'resend';
import { ShippingDetails } from "@/components/email/shippingDetails";
import { ShippingAdminDetails } from "@/components/email/shippingAdmin";


export async function POST(request: NextRequest) {

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const body = await request.text()
    const headersList = headers()
    const sig: string = headersList.get('stripe-signature') || ''

    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: error }, { status: 400 })
    }
    switch (event.type) {
        case 'checkout.session.completed':

            //TODO change default fields with better options such custom fields with customername 
            const checkoutSessionCompleted = event.data.object
            const customerAddress = checkoutSessionCompleted.customer_details?.address || 'not found'
            const customerEmail = checkoutSessionCompleted.customer_email || checkoutSessionCompleted.customer_details?.email || 'not found'
            const customerName = checkoutSessionCompleted.customer_details?.name || 'not found'
            const resend = new Resend(process.env.RESEND_API_KEY);

            try {
                await resend.emails.send({
                    from: 'compras@opogacela.es',
                    to: [customerEmail],
                    subject: "Compra realizada con éxito",
                    react: ShippingDetails({ name: customerName, email: customerEmail, address: customerAddress }) as React.ReactElement,
                });

                await resend.emails.send({
                    from: 'compras@opogacela.es',
                    to: ['pilar.soldado@gmail.com '],
                    subject: "Nueva compra en OPOGACELA",
                    react: ShippingAdminDetails({ name: customerName, email: customerEmail, address: customerAddress }) as React.ReactElement,
                });
            } catch (error) {
                return Response.json({ error });
            }

            break;

        default:
            console.log(`Evento no manejado: ${event.type}`)
            break;
    }




    return NextResponse.json({ event }, { status: 200 })
}