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
        question: "¿Cómo es el proceso de compra?",
        answer: "Una vez que escojas tus apuntes te llegará un correo de confirmación y la información ",
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
            "Lorem ipsum dolor sit amet  Consectetur natus dolores minus quibusdam?",
        answer:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore qui nostrum reiciendis veritatis necessitatibus maxime quis ipsa vitae cumque quo?",
        value: "item-3",
    },
    {
        question: "Lorem ipsum dolor sit amet, consectetur adipisicing elit?",
        answer: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
        value: "item-4",
    },
    {
        question:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur natus?",
        answer:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint labore quidem quam? Consectetur sapiente iste rerum reiciendis animi nihil nostrum sit quo, modi quod.",
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