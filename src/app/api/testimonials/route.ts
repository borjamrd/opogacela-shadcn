import { NewTestimonial } from "@/components/email/newTestimonial";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
export async function POST(request: NextRequest) {
    const { newTestimonial } = await request.json();
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "Web Opogacela <web@opogacela.es>",
        to: ["instaopogacela@gmail.com", "borjamrd1@gmail.com"],
        subject: 'Nuevo testimonial en Opogacela',
        react: NewTestimonial(newTestimonial) as React.ReactElement,
    });

    if (error) {

        return NextResponse.json({ error });
    }

    return NextResponse.json({ data })
}