import * as React from 'react';
import { Testimonial } from '../Testimonials';

export const NewTestimonial: React.FC<Readonly<Partial<Testimonial>>> = ({
    id,
    name,
    position,
    surname,
    description,
}) => (
    <div className="w-full h-96 flex flex-col gap-2">
        <h1>¡Nuevo testimonio de {name}!</h1>

        <ul>
            <li>Nombre: {name}</li>
            <li>Apellidos: {surname}</li>
            <li>Posición: {position}</li>
            <li>Reseña: {description}</li>
        </ul>

        <a
            href={`${process.env.BASE_URL}/confirm-testimonial?id=${id}`}
            style={{
                marginTop: '1.25rem',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '25px',
                width: 'fit-content',
                paddingLeft: '2.5rem',
                paddingRight: '2.5rem',
                paddingTop: '1rem',
                paddingBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#1d4ed8',
                fontSize: '1.5rem',
                lineHeight: '2rem',
                cursor: 'pointer',
            }}
        >
            Verificar
        </a>
    </div>
);
