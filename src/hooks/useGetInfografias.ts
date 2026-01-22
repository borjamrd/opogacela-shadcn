import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Infografia {
    id: number;
    created_at: string;
    title: string;
    contenido_html: string;
    published: boolean;
    updated_at: string;
}

const INFOGRAFIAS_CACHE_KEY = 'infografias';

export function useGetInfografias() {
    const [infografias, setInfografias] = useState<Infografia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInfografias = async () => {
            setIsLoading(true);
            try {
                // Check if data is already cached
                const cachedData = localStorage.getItem(INFOGRAFIAS_CACHE_KEY);
                if (cachedData) {
                    setInfografias(JSON.parse(cachedData));
                    return; // Exit early, no need to fetch from Supabase
                }

                const { data, error } = await supabase
                    .from('infografias')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                // Cache the data in local storage
                localStorage.setItem(INFOGRAFIAS_CACHE_KEY, JSON.stringify(data));
                setInfografias(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInfografias();
    }, []);

    return { infografias, isLoading, error };
}
