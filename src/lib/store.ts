import { create } from 'zustand'
import Product from 'stripe'
interface StripeProduct {
    active?: boolean | null
    attributes?: (string)[] | null
    caption?: string | null
    created: number
    deactivate_on?: any[]
    description?: string | null
    id: string
    images: (string)[]
    livemode: boolean
    metadata: { [key: string]: string }
    name: string
    object: "product"
    package_dimensions?: PackageDimensions | null
    shippable?: boolean | null
    statement_descriptor?: string | null
    type: "good" | "service"
    unit_label?: string | null
    updated: number
    url?: string | null
}
interface PackageDimensions {
    height: number
    length: number
    weight: number
    width: number
}

interface OpogaceState {
    products: StripeProduct[]
    addProduct: (product: StripeProduct) => void;
    removeProduct: (productId: string) => void;
}

export const useOpogaceStore = create<OpogaceState>()((set) => ({
    products: [],
    addProduct: (product) => set((state) => ({
        products: [...state.products, product],
    })),
    removeProduct: (productId: any) => set((state) => ({
        products: state.products.filter(product => product.id !== productId),
    })),
}))