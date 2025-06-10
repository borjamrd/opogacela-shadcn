import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Infografia {
  id: number
  created_at: string
  title: string
  contenido_html: string
  published: boolean
  updated_at: string
}

export function useGetInfografiaById(id: string | undefined) {
  const [infografia, setInfografia] = useState<Infografia | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInfografia = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('infografias')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          throw error
        }

        setInfografia(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInfografia()
  }, [id])

  return { infografia, isLoading, error }
}
