import { buttonVariants } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { AiOutlineMail } from "react-icons/ai";
import opogacela from '../../public/images/opogacela.png';
import portada from '../../public/images/portada.jpeg';
import whatsapp from '../../public/images/whatsapp.jpeg';
import { LightBulbIcon } from "./Icons";


export const HeroCards = () => {
    return (
        <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
            {/* Testimonial */}
            <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <Image src={whatsapp} alt=""
                    className="w-full object-contain rounded-lg"></Image>
            </Card>

            {/* Team */}
            <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="mt-8 flex justify-center items-center pb-2">
                    <Image

                        src={opogacela}
                        alt="user avatar"
                        className="absolute -top-12 rounded-full w-24 h-24 aspect-square object-cover"
                    />
                    <CardTitle className="text-center">@opogace_la</CardTitle>

                </CardHeader>

                <CardContent className="text-center pb-2">
                    <p>
                        Mnemotecnias y apuntes para que puedas estudiar mejor
                    </p>

                </CardContent>

                <CardFooter>
                    <div>
                        <a
                            href="https://www.instagram.com/opogace_la/"
                            target="_blank"
                            className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            })}
                        >
                            <span className="sr-only">Github icon</span>
                            <InstagramLogoIcon className="w-5 h-5" />
                        </a>


                        <a
                            href="mailto:instaopogacela@gmail.com?Subject=Quiero%20más%20información"
                            target="_blank"
                            className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            })}
                        >
                            <span className="sr-only">Linkedin icon</span>
                            <AiOutlineMail size="20" />
                        </a>
                    </div>
                </CardFooter>
            </Card>

            {/* Pricing */}
            <Card className="absolute p-0 top-[200px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <Image src={portada}
                    alt=""
                    className="w-[300px] object-contain rounded-lg"></Image>
            </Card>

            {/* Service */}
            <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
                <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
                    <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
                        <LightBulbIcon />
                    </div>
                    <div>
                        <CardTitle>Comunidad de opositores</CardTitle>
                        <CardDescription className="text-md mt-2">
                            Únete a los canales en Telegram y Discord para estar al tanto de las últimas noticias
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
};