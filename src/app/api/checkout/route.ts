import { NextRequest, NextResponse } from "next/server";
import { Stripe } from 'stripe'

export async function POST(request: NextRequest) {
    const { prices } = await request.json()
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'paypal'],
        line_items: prices,
        success_url: `${process.env.BASE_URL}/thank-you`,
        cancel_url: `${process.env.BASE_URL}/#esquemas`
    })
    return NextResponse.json({ url: session.url })
}