import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';

export async function POST(request: NextRequest) {
    const { prices } = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: prices,
        allow_promotion_codes: true,
        shipping_address_collection: {
            allowed_countries: ['ES'],
        },
        custom_fields: [
            {
                key: 'phone',
                label: {
                    type: 'custom',
                    custom: 'Teléfono de contacto',
                },
                type: 'text',
                text: {
                    maximum_length: 9,
                    minimum_length: 9,
                },
                optional: false,
            },
        ],
        success_url: `${process.env.BASE_URL}/thank-you`,
        cancel_url: `${process.env.BASE_URL}/#esquemas`,
    });

    return NextResponse.json({ url: session.url });
}
