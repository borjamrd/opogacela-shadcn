import * as React from 'react';

interface TestimonialRequestEmailProps {
    customerName: string;
    testimonialLink: string;
}

export const TestimonialRequestEmail: React.FC<Readonly<TestimonialRequestEmailProps>> = ({
    customerName,
    testimonialLink,
}) => (
    <div className="w-full h-96 flex flex-col gap-2">
        <h1>¡Hola, {customerName}!</h1>

        <p>
            Hace tiempo que realizaste una compra de apuntes en Opogacela. ¿Te están sirviendo? Si
            es así, deja un comentario en el siguiente enlace. Me ayudarás a mejorar el servicio y a
            que más gente pueda disfrutar de los apuntes.
        </p>
        <p className="mb-3">Enlace para dejar tu comentario: </p>
        <a href={testimonialLink} className="text-blue-500 underline">
            {testimonialLink}
        </a>
    </div>
);
