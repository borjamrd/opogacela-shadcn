import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
    question: string;
    answer: string;
    value: string;
}

const FAQList: FAQProps[] = [
    {
        question: "¿Cómo es el formato de los apuntes?",
        answer: "Todos los apuntes se envían físicamente impresos, sin excepción. Están impresos a doble cara con letra 12 para que ocupen lo menos posible. ",
        value: "item-0",
    },
    {
        question: "¿Cómo es el proceso de compra?",
        answer: "Una vez que escojas tus esquemas te llegará un correo de confirmación y la información ",
        value: "item-1",
    },
    {
        question: "¿Puedo pedirlos en formato PDF?",
        answer:
            "No, por cuestiones de logística se envían exclusivamente a domicilio, los costes de envío están incluidos en el precio final",
        value: "item-2",
    },
    {
        question:
            "¿Puedo pagar los esquemas de otra manera?",
        answer:
            "Sí, por defecto es con tarjeta bancaria pero puedes hacer transferencia, bizum, o incluso efectivo si estas en Madrid 😅",
        value: "item-3",
    },
    {
        question:
            "¿Puedo contactar contigo si tengo alguna duda sobre los esquemas?",
        answer:
            "¡Claro! Por lo general estoy atenta a Whatsapp, puedes dejarme tu pregunta y te contensto cuando tenga un hueco o si necesitas profundizar podemos tener videollamada",
        value: "item-4",
    },
    {
        question:
            "Soy un opopobre (todos lo somos) y los apuntes son muy caros. ¿Piedad?",
        answer:
            "No te preocupes,  tienes la opción de aplazar tus compras, te aparecerá como opción de pago a la hora de realizar la compra.",
        value: "item-5",
    },
];

export const FAQ = () => {
    return (
        <section
            id="faq"
            className="container py-24 sm:py-32"
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    Preguntas{" "}
                </span>
                más frecuentes

            </h2>

            <Accordion
                type="single"
                collapsible
                className="w-full AccordionRoot"
            >
                {FAQList.map(({ question, answer, value }: FAQProps) => (
                    <AccordionItem
                        key={value}
                        value={value}
                    >
                        <AccordionTrigger className="text-left">
                            {question}
                        </AccordionTrigger>

                        <AccordionContent>{answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <h3 className="font-medium mt-4">
                ¿Sigues con dudas?{" "}
                <a
                    href="mailto:instaopogacela@gmail.com?Subject=Quiero%20más%20información"
                    target="_blank"
                    className="text-primary transition-all border-primary hover:border-b-2"
                >
                    Contacta conmigo
                </a>
            </h3>
        </section>
    );
};