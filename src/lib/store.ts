import { Stripe } from 'stripe';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OpogaceState {
    prices: Stripe.Price[];
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    addPrices: (product: Stripe.Price) => void;
    removePrices: (productId: string) => void;
    removeAllPrices: () => void;
}

// ... existing imports
export const useOpogaceStore = create<OpogaceState>()(
    persist(
        (set) => ({
            prices: [],
            isCartOpen: false,
            removeAllPrices: () => set({ prices: [] }),
            setCartOpen: (open: boolean) => set({ isCartOpen: open }),
            addPrices: (price) =>
                set((state) => ({
                    prices: [...state.prices, price],
                })),
            removePrices: (productId: any) =>
                set((state) => ({
                    prices: state.prices.filter((price) => price.id !== productId),
                })),
        }),
        { name: 'opogaceStore' }
    )
);
