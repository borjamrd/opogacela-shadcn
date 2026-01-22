'use client';

import React, { useState } from 'react';
import { Input } from './ui/input';
import { FeatureProps } from './Examples';
import ViewPdfButton from './ViewPdfButton';
import TypeBadge from './TypeBadge';
import { Card, CardHeader, CardTitle, CardFooter } from './ui/card';

const BuscadorTemas = ({ features }: { features: FeatureProps[] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeatures = features.filter(({ title }) =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col w-full">
            <div className="w-full flex justify-center mb-5">
                <Input
                    type="text"
                    placeholder="Buscar un tema..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md text-lg"
                />
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredFeatures.length > 0 ? (
                    filteredFeatures.map(({ id, title, file, type, price_id }: FeatureProps) => (
                        <Card className="relative pt-10 group flex flex-col" key={id}>
                            <CardHeader>
                                <CardTitle>{title}</CardTitle>
                            </CardHeader>
                            <TypeBadge type={type} />
                            <CardFooter className="mt-auto">
                                <ViewPdfButton file={file} priceId={price_id} />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">
                        No se encontraron resultados.
                    </p>
                )}
            </div>
        </div>
    );
};

export default BuscadorTemas;
