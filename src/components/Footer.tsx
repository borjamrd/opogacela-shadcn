export const Footer = () => {
    return (
        <footer id="footer">
            <hr className="w-11/12 mx-auto" />

            <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
                <div className="col-span-full xl:col-span-2">
                    <a href="/" className="ml-2 font-bold text-xl flex text-primary">
                        Opo<span className="text-[#b985ab]">gacela</span>
                    </a>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">Opogacela</h3>
                    <div>
                        <a href="#sobremi" className="opacity-60 hover:opacity-100">
                            Sobre mí
                        </a>
                    </div>

                    <div>
                        <a href="#testimonials" className="opacity-60 hover:opacity-100">
                            Opiniones
                        </a>
                    </div>
                    <div>
                        <a href="/politica-privacidad" className="opacity-60 hover:opacity-100">
                            Política de privacidad
                        </a>
                    </div>
                    <div>
                        <a href="/politica-privacidad" className="opacity-60 hover:opacity-100">
                            Condiciones generales y de uso
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">Contenido</h3>
                    <div>
                        <a href="#howitworks" className="opacity-60 hover:opacity-100">
                            ¿Cómo funciona?
                        </a>
                    </div>

                    <div>
                        <a href="#esquemas" className="opacity-60 hover:opacity-100">
                            Esquemas
                        </a>
                    </div>

                    <div>
                        <a href="#faq" className="opacity-60 hover:opacity-100">
                            FAQ
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-lg">Comunidad</h3>

                    <div>
                        <a href="#" className="opacity-60 hover:opacity-100">
                            Telegram
                        </a>
                    </div>

                    <div>
                        <a
                            href="https://www.instagram.com/opogace_la/"
                            target="_blank"
                            className="opacity-60 hover:opacity-100"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </section>

            <section className="container pb-14 text-center">
                <h3>{new Date().getFullYear()} created by Opogacela</h3>
            </section>
        </footer>
    );
};
