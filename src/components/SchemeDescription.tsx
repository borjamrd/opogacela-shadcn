"use client"

import React from "react"

export const SchemeDescription = (({ description, features }: { description: any, features: any }) => {
    const MAX_LENGTH = 180
    const totalLength = description?.length + features?.length


    const [showMore, setShowMore] = React.useState(false)
    const toggleShowMore = () => setShowMore(!showMore)



    if (description) {

        return (<div className="mt-3 text-sm text-muted-foreground">
            <p>{showMore ? description : description.substring(0, MAX_LENGTH)}</p>
            {showMore && <ul>{features?.map((feature: any, i: number) => { return <li className="list-disc list-inside" key={i}>{feature.name}</li> })}</ul>}
            <p className="text-black mt-3" onClick={() => toggleShowMore()}>{showMore ? 'Mostrar menos' : 'Mostrar más'}</p>
        </div>)
    }



})
