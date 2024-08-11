"use client"

import { Temas } from "@/app/temas/page";
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
import { Button } from "./ui/button";
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
                    <DrawerTrigger>
                        <Button variant={'link'} className="p-0">
                            Contenido de todos los temas
                        </Button>
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
                                <Button variant="outline">Cerrar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>}


            <p className="mt-2" onClick={() => toggleShowMore()}>{showMore ? 'Mostrar menos' : 'Mostrar más'}</p>





        </div >)
    }



})
