
import { Navbar } from "@/components/Navbar";
import { Temas } from "@/components/Temas";


export default function Page() {

    return <div>
        <Navbar />
        <section className="w-full h-[80vh] flex justify-center">
            <div className="lg:max-w-5xl">
                <Temas />
            </div>
        </section>

    </div>
}