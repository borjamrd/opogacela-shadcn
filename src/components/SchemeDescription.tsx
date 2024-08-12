"use client"

import { Temas } from "@/components/Temas";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
export const SchemeDescription = (({ description, features }: { description: any, features: any }) => {
    const MAX_LENGTH = 180

    const [showMore, setShowMore] = React.useState(false)
    const toggleShowMore = () => setShowMore(!showMore)



    if (description) {

        return (<div className="mt-3 text-sm text-muted-foreground">
            <p>{showMore ? description : description.substring(0, MAX_LENGTH)}</p>
            {showMore && <ul>{features?.map((feature: any, i: number) => { return <li className="list-disc list-inside" key={i}>{feature.name}</li> })}</ul>}
            {showMore && < div className="mt-3">
                <Drawer >
                    <DrawerTrigger className="p-0 text-primary underline-offset-4 hover:underline">
                        Contenido de todos los temas
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>
                                Contenido de todos los temas</DrawerTitle>
                            <DrawerDescription>Aquí aparece todo el contenido de todos los bloques de Opogacela</DrawerDescription>
                        </DrawerHeader>
                        <div className="h-[50vh] overflow-auto">
                            <Temas />
                        </div>

                        <DrawerFooter>

                            <DrawerClose>
                                Cerrar
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>}


            <p className="mt-2" onClick={() => toggleShowMore()}>{showMore ? 'Mostrar menos' : 'Mostrar más'}</p>





        </div >)
    }



})
