import { Stripe } from 'stripe';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface OpogaceState {
    prices: Stripe.Price[]
    addPrices: (product: Stripe.Price) => void;
    removePrices: (productId: string) => void;
}

export const useOpogaceStore = create<OpogaceState>()(
    persist(
        (set) => ({
            prices: [],
            addPrices: (price) => set((state) => ({
                prices: [...state.prices, price],
            })),
            removePrices: (productId: any) => set((state) => ({
                prices: state.prices.filter(price => price.id !== productId),
            })),
        }), { name: 'opogaceStore' }
    )


)