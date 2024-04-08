import { Navbar } from "@/components/Navbar";

export default function ThankYou() {
    return <div>
        <Navbar />
        <section className="w-full h-[80vh] flex items-center justify-center">
            <div className="max-w-5xl ">
                <h2 className="text-2xl font-bold mb-5 text-foreground">¡Gracias por tu compra! 🎊</h2>
                <p>Te llegará un correo con la información de tu compra, revisa SPAM por si acaso 😄</p>
            </div>

        </section>

    </div>
}